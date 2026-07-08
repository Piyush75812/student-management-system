// ===================================================
// Marks Page Logic - CRUD
// ===================================================

let studentsCache = [];
let coursesCache = [];
let deleteTargetId = null;
let searchTimeout;

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtnDropdown = document.getElementById('logoutBtnDropdown');
    if (logoutBtnDropdown) logoutBtnDropdown.addEventListener('click', (e) => { e.preventDefault(); logout(); });

    loadStudentsForDropdown();
    loadCoursesForDropdown();
    loadMarks();

    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => loadMarks(e.target.value.trim()), 400);
    });

    document.getElementById('marksForm').addEventListener('submit', handleMarksFormSubmit);
    document.getElementById('confirmDeleteBtn').addEventListener('click', handleConfirmDelete);
});

async function loadStudentsForDropdown() {
    try {
        const res = await fetch(`${API_BASE_URL}/students?limit=1000`, { headers: authHeaders() });
        const data = await res.json();
        if (data.success) {
            studentsCache = data.data;
            const select = document.getElementById('student_id');
            select.innerHTML = '<option value="">Select Student</option>' +
                studentsCache.map(s => `<option value="${s.id}">${escapeHtml(s.student_id)} - ${escapeHtml(s.full_name)}</option>`).join('');
        }
    } catch (err) {
        console.error('Failed to load students', err);
    }
}

async function loadCoursesForDropdown() {
    try {
        const res = await fetch(`${API_BASE_URL}/courses`, { headers: authHeaders() });
        const data = await res.json();
        if (data.success) {
            coursesCache = data.data;
            const select = document.getElementById('course_id');
            select.innerHTML = '<option value="">Select Course</option>' +
                coursesCache.map(c => `<option value="${c.id}">${escapeHtml(c.course_name)}</option>`).join('');
        }
    } catch (err) {
        console.error('Failed to load courses', err);
    }
}

async function loadMarks(search = '') {
    const tbody = document.getElementById('marksBody');
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Loading...</td></tr>`;

    try {
        const res = await fetch(`${API_BASE_URL}/marks?search=${encodeURIComponent(search)}`, { headers: authHeaders() });
        const data = await res.json();

        if (res.status === 401) { logout(); return; }

        if (!data.success || data.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No marks records found</td></tr>`;
            return;
        }

        tbody.innerHTML = data.data.map(m => {
            const percentage = ((Number(m.marks_obtained) / Number(m.max_marks)) * 100).toFixed(1);
            const badgeClass = percentage >= 75 ? 'success' : percentage >= 40 ? 'warning' : 'danger';
            return `
                <tr>
                    <td>${escapeHtml(m.student_code)}</td>
                    <td>${escapeHtml(m.full_name)}</td>
                    <td>${escapeHtml(m.course_name || '-')}</td>
                    <td>${escapeHtml(m.exam_type)}</td>
                    <td>${m.marks_obtained} / ${m.max_marks}</td>
                    <td><span class="badge bg-${badgeClass}">${percentage}%</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick='openEditModal(${JSON.stringify(m)})'>
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="openDeleteModal(${m.id})">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">Unable to load marks</td></tr>`;
    }
}

function openAddModal() {
    document.getElementById('marksModalTitle').textContent = 'Add Marks';
    document.getElementById('marksForm').reset();
    document.getElementById('marksDbId').value = '';
    document.getElementById('max_marks').value = 100;
}

function openEditModal(record) {
    document.getElementById('marksModalTitle').textContent = 'Edit Marks';
    document.getElementById('marksDbId').value = record.id;
    document.getElementById('student_id').value = record.student_id;
    document.getElementById('course_id').value = record.course_id || '';
    document.getElementById('exam_type').value = record.exam_type;
    document.getElementById('marks_obtained').value = record.marks_obtained;
    document.getElementById('max_marks').value = record.max_marks;

    new bootstrap.Modal(document.getElementById('marksModal')).show();
}

async function handleMarksFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('marksDbId').value;
    const payload = {
        student_id: document.getElementById('student_id').value,
        course_id: document.getElementById('course_id').value || null,
        exam_type: document.getElementById('exam_type').value,
        marks_obtained: document.getElementById('marks_obtained').value,
        max_marks: document.getElementById('max_marks').value
    };

    const url = id ? `${API_BASE_URL}/marks/${id}` : `${API_BASE_URL}/marks`;
    const method = id ? 'PUT' : 'POST';

    try {
        toggleSpinner(true);
        const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
        const data = await res.json();

        if (!data.success) {
            showAlert('alertContainer', data.message, 'danger');
            return;
        }

        bootstrap.Modal.getInstance(document.getElementById('marksModal')).hide();
        showAlert('alertContainer', data.message, 'success');
        loadMarks(document.getElementById('searchInput').value.trim());
    } catch (err) {
        showAlert('alertContainer', 'Something went wrong. Please try again.', 'danger');
    } finally {
        toggleSpinner(false);
    }
}

function openDeleteModal(id) {
    deleteTargetId = id;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

async function handleConfirmDelete() {
    if (!deleteTargetId) return;
    try {
        toggleSpinner(true);
        const res = await fetch(`${API_BASE_URL}/marks/${deleteTargetId}`, { method: 'DELETE', headers: authHeaders() });
        const data = await res.json();

        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();

        if (data.success) {
            showAlert('alertContainer', data.message, 'success');
            loadMarks(document.getElementById('searchInput').value.trim());
        } else {
            showAlert('alertContainer', data.message, 'danger');
        }
    } catch (err) {
        showAlert('alertContainer', 'Unable to delete marks record.', 'danger');
    } finally {
        toggleSpinner(false);
        deleteTargetId = null;
    }
}

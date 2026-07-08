// ===================================================
// Students Page Logic - CRUD, Search, Pagination
// ===================================================

let currentPage = 1;
const pageLimit = 10;
let searchTimeout;
let coursesCache = [];
let deleteTargetId = null;

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtnDropdown = document.getElementById('logoutBtnDropdown');
    if (logoutBtnDropdown) logoutBtnDropdown.addEventListener('click', (e) => { e.preventDefault(); logout(); });

    loadCoursesForDropdown();
    loadStudents();

    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentPage = 1;
            loadStudents(e.target.value.trim());
        }, 400);
    });

    document.getElementById('studentForm').addEventListener('submit', handleStudentFormSubmit);
    document.getElementById('confirmDeleteBtn').addEventListener('click', handleConfirmDelete);
});

// Load courses for the dropdown inside the Add/Edit modal
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

// Fetch and render students list
async function loadStudents(search = '') {
    const tbody = document.getElementById('studentsBody');
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Loading...</td></tr>`;

    try {
        const res = await fetch(`${API_BASE_URL}/students?search=${encodeURIComponent(search)}&page=${currentPage}&limit=${pageLimit}`, {
            headers: authHeaders()
        });
        const data = await res.json();

        if (res.status === 401) { logout(); return; }

        if (!data.success) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">${data.message}</td></tr>`;
            return;
        }

        if (data.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No students found</td></tr>`;
            renderPagination(0, 0);
            return;
        }

        tbody.innerHTML = data.data.map(s => `
            <tr>
                <td>${escapeHtml(s.student_id)}</td>
                <td>${escapeHtml(s.full_name)}</td>
                <td>${escapeHtml(s.email)}</td>
                <td>${escapeHtml(s.phone)}</td>
                <td>${escapeHtml(s.course_name || '-')}</td>
                <td>${escapeHtml(s.semester)}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick='openEditModal(${JSON.stringify(s)})'>
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="openDeleteModal(${s.id})">
                        <i class="bi bi-trash3"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        renderPagination(data.pagination.totalPages, data.pagination.page);
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">Unable to load students</td></tr>`;
    }
}

// Render pagination controls
function renderPagination(totalPages, page) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === page ? 'active' : ''}">
                <a class="page-link" href="#" onclick="goToPage(event, ${i})">${i}</a>
            </li>
        `;
    }
}

function goToPage(e, page) {
    e.preventDefault();
    currentPage = page;
    loadStudents(document.getElementById('searchInput').value.trim());
}

// Open modal in "Add" mode
function openAddModal() {
    document.getElementById('studentModalTitle').textContent = 'Add Student';
    document.getElementById('studentForm').reset();
    document.getElementById('studentDbId').value = '';
}

// Open modal in "Edit" mode, pre-filled with student data
function openEditModal(student) {
    document.getElementById('studentModalTitle').textContent = 'Edit Student';
    document.getElementById('studentDbId').value = student.id;
    document.getElementById('student_id').value = student.student_id;
    document.getElementById('full_name').value = student.full_name;
    document.getElementById('email').value = student.email;
    document.getElementById('phone').value = student.phone;
    document.getElementById('gender').value = student.gender;
    document.getElementById('dob').value = student.dob ? student.dob.split('T')[0] : '';
    document.getElementById('semester').value = student.semester;
    document.getElementById('course_id').value = student.course_id || '';
    document.getElementById('address').value = student.address || '';

    new bootstrap.Modal(document.getElementById('studentModal')).show();
}

// Handle Add/Edit form submission
async function handleStudentFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('studentDbId').value;
    const payload = {
        student_id: document.getElementById('student_id').value.trim(),
        full_name: document.getElementById('full_name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        semester: document.getElementById('semester').value,
        course_id: document.getElementById('course_id').value || null,
        address: document.getElementById('address').value.trim()
    };

    const url = id ? `${API_BASE_URL}/students/${id}` : `${API_BASE_URL}/students`;
    const method = id ? 'PUT' : 'POST';

    try {
        toggleSpinner(true);
        const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
        const data = await res.json();

        if (!data.success) {
            showAlert('alertContainer', data.message, 'danger');
            return;
        }

        bootstrap.Modal.getInstance(document.getElementById('studentModal')).hide();
        showAlert('alertContainer', data.message, 'success');
        loadStudents(document.getElementById('searchInput').value.trim());
    } catch (err) {
        showAlert('alertContainer', 'Something went wrong. Please try again.', 'danger');
    } finally {
        toggleSpinner(false);
    }
}

// Open delete confirmation modal
function openDeleteModal(id) {
    deleteTargetId = id;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

// Confirm deletion
async function handleConfirmDelete() {
    if (!deleteTargetId) return;
    try {
        toggleSpinner(true);
        const res = await fetch(`${API_BASE_URL}/students/${deleteTargetId}`, { method: 'DELETE', headers: authHeaders() });
        const data = await res.json();

        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();

        if (data.success) {
            showAlert('alertContainer', data.message, 'success');
            loadStudents(document.getElementById('searchInput').value.trim());
        } else {
            showAlert('alertContainer', data.message, 'danger');
        }
    } catch (err) {
        showAlert('alertContainer', 'Unable to delete student.', 'danger');
    } finally {
        toggleSpinner(false);
        deleteTargetId = null;
    }
}

// ===================================================
// Teachers Page Logic - CRUD
// ===================================================

let deleteTargetId = null;

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtnDropdown = document.getElementById('logoutBtnDropdown');
    if (logoutBtnDropdown) logoutBtnDropdown.addEventListener('click', (e) => { e.preventDefault(); logout(); });

    loadTeachers();
    document.getElementById('teacherForm').addEventListener('submit', handleTeacherFormSubmit);
    document.getElementById('confirmDeleteBtn').addEventListener('click', handleConfirmDelete);
});

async function loadTeachers() {
    const tbody = document.getElementById('teachersBody');
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">Loading...</td></tr>`;

    try {
        const res = await fetch(`${API_BASE_URL}/teachers`, { headers: authHeaders() });
        const data = await res.json();

        if (res.status === 401) { logout(); return; }

        if (!data.success || data.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No teachers found</td></tr>`;
            return;
        }

        tbody.innerHTML = data.data.map(t => `
            <tr>
                <td>${escapeHtml(t.teacher_id)}</td>
                <td>${escapeHtml(t.name)}</td>
                <td>${escapeHtml(t.department)}</td>
                <td>${escapeHtml(t.email)}</td>
                <td>${escapeHtml(t.phone)}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick='openEditModal(${JSON.stringify(t)})'>
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="openDeleteModal(${t.id})">
                        <i class="bi bi-trash3"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">Unable to load teachers</td></tr>`;
    }
}

function openAddModal() {
    document.getElementById('teacherModalTitle').textContent = 'Add Teacher';
    document.getElementById('teacherForm').reset();
    document.getElementById('teacherDbId').value = '';
}

function openEditModal(teacher) {
    document.getElementById('teacherModalTitle').textContent = 'Edit Teacher';
    document.getElementById('teacherDbId').value = teacher.id;
    document.getElementById('teacher_id').value = teacher.teacher_id;
    document.getElementById('name').value = teacher.name;
    document.getElementById('department').value = teacher.department;
    document.getElementById('email').value = teacher.email;
    document.getElementById('phone').value = teacher.phone;

    new bootstrap.Modal(document.getElementById('teacherModal')).show();
}

async function handleTeacherFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('teacherDbId').value;
    const payload = {
        teacher_id: document.getElementById('teacher_id').value.trim(),
        name: document.getElementById('name').value.trim(),
        department: document.getElementById('department').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim()
    };

    const url = id ? `${API_BASE_URL}/teachers/${id}` : `${API_BASE_URL}/teachers`;
    const method = id ? 'PUT' : 'POST';

    try {
        toggleSpinner(true);
        const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
        const data = await res.json();

        if (!data.success) {
            showAlert('alertContainer', data.message, 'danger');
            return;
        }

        bootstrap.Modal.getInstance(document.getElementById('teacherModal')).hide();
        showAlert('alertContainer', data.message, 'success');
        loadTeachers();
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
        const res = await fetch(`${API_BASE_URL}/teachers/${deleteTargetId}`, { method: 'DELETE', headers: authHeaders() });
        const data = await res.json();

        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();

        if (data.success) {
            showAlert('alertContainer', data.message, 'success');
            loadTeachers();
        } else {
            showAlert('alertContainer', data.message, 'danger');
        }
    } catch (err) {
        showAlert('alertContainer', 'Unable to delete teacher.', 'danger');
    } finally {
        toggleSpinner(false);
        deleteTargetId = null;
    }
}

// ===================================================
// Courses Page Logic - CRUD
// ===================================================

let deleteTargetId = null;

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtnDropdown = document.getElementById('logoutBtnDropdown');
    if (logoutBtnDropdown) logoutBtnDropdown.addEventListener('click', (e) => { e.preventDefault(); logout(); });

    loadCourses();
    document.getElementById('courseForm').addEventListener('submit', handleCourseFormSubmit);
    document.getElementById('confirmDeleteBtn').addEventListener('click', handleConfirmDelete);
});

async function loadCourses() {
    const tbody = document.getElementById('coursesBody');
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">Loading...</td></tr>`;

    try {
        const res = await fetch(`${API_BASE_URL}/courses`, { headers: authHeaders() });
        const data = await res.json();

        if (res.status === 401) { logout(); return; }

        if (!data.success || data.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No courses found</td></tr>`;
            return;
        }

        tbody.innerHTML = data.data.map(c => `
            <tr>
                <td>${escapeHtml(c.course_code)}</td>
                <td>${escapeHtml(c.course_name)}</td>
                <td>${escapeHtml(c.duration)}</td>
                <td>${escapeHtml(c.semester)}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick='openEditModal(${JSON.stringify(c)})'>
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="openDeleteModal(${c.id})">
                        <i class="bi bi-trash3"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">Unable to load courses</td></tr>`;
    }
}

function openAddModal() {
    document.getElementById('courseModalTitle').textContent = 'Add Course';
    document.getElementById('courseForm').reset();
    document.getElementById('courseDbId').value = '';
}

function openEditModal(course) {
    document.getElementById('courseModalTitle').textContent = 'Edit Course';
    document.getElementById('courseDbId').value = course.id;
    document.getElementById('course_code').value = course.course_code;
    document.getElementById('course_name').value = course.course_name;
    document.getElementById('duration').value = course.duration;
    document.getElementById('semester').value = course.semester;

    new bootstrap.Modal(document.getElementById('courseModal')).show();
}

async function handleCourseFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('courseDbId').value;
    const payload = {
        course_code: document.getElementById('course_code').value.trim(),
        course_name: document.getElementById('course_name').value.trim(),
        duration: document.getElementById('duration').value.trim(),
        semester: document.getElementById('semester').value
    };

    const url = id ? `${API_BASE_URL}/courses/${id}` : `${API_BASE_URL}/courses`;
    const method = id ? 'PUT' : 'POST';

    try {
        toggleSpinner(true);
        const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
        const data = await res.json();

        if (!data.success) {
            showAlert('alertContainer', data.message, 'danger');
            return;
        }

        bootstrap.Modal.getInstance(document.getElementById('courseModal')).hide();
        showAlert('alertContainer', data.message, 'success');
        loadCourses();
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
        const res = await fetch(`${API_BASE_URL}/courses/${deleteTargetId}`, { method: 'DELETE', headers: authHeaders() });
        const data = await res.json();

        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();

        if (data.success) {
            showAlert('alertContainer', data.message, 'success');
            loadCourses();
        } else {
            showAlert('alertContainer', data.message, 'danger');
        }
    } catch (err) {
        showAlert('alertContainer', 'Unable to delete course.', 'danger');
    } finally {
        toggleSpinner(false);
        deleteTargetId = null;
    }
}

// ===================================================
// Attendance Page Logic
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtnDropdown = document.getElementById('logoutBtnDropdown');
    if (logoutBtnDropdown) logoutBtnDropdown.addEventListener('click', (e) => { e.preventDefault(); logout(); });

    const dateInput = document.getElementById('attendanceDate');
    // Default to today's date
    dateInput.value = new Date().toISOString().split('T')[0];

    loadAttendance(dateInput.value);

    dateInput.addEventListener('change', () => loadAttendance(dateInput.value));
    document.getElementById('saveAttendanceBtn').addEventListener('click', saveAttendance);
});

async function loadAttendance(date) {
    const tbody = document.getElementById('attendanceBody');
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">Loading...</td></tr>`;

    try {
        const res = await fetch(`${API_BASE_URL}/attendance?date=${date}`, { headers: authHeaders() });
        const data = await res.json();

        if (res.status === 401) { logout(); return; }

        if (!data.success || data.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No students found</td></tr>`;
            return;
        }

        const statusConfig = [
            { value: 'Present', label: 'P', color: 'success' },
            { value: 'Absent', label: 'A', color: 'danger' },
            { value: 'Leave', label: 'L', color: 'warning' }
        ];

        tbody.innerHTML = data.data.map(s => `
            <tr data-student-db-id="${s.student_db_id}">
                <td>${escapeHtml(s.student_id)}</td>
                <td>${escapeHtml(s.full_name)}</td>
                <td>${escapeHtml(s.course_name || '-')}</td>
                <td>
                    <div class="btn-group btn-group-sm attendance-status-group" role="group">
                        ${statusConfig.map(cfg => `
                            <input type="radio" class="btn-check" name="status_${s.student_db_id}"
                                   id="status_${s.student_db_id}_${cfg.value}" value="${cfg.value}"
                                   ${s.status === cfg.value ? 'checked' : ''} autocomplete="off">
                            <label class="btn btn-outline-${cfg.color}" for="status_${s.student_db_id}_${cfg.value}" title="${cfg.value}">${cfg.label}</label>
                        `).join('')}
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-4">Unable to load attendance</td></tr>`;
    }
}

async function saveAttendance() {
    const date = document.getElementById('attendanceDate').value;
    const rows = document.querySelectorAll('#attendanceBody tr[data-student-db-id]');

    const records = [];
    let hasUnmarked = false;

    rows.forEach(row => {
        const studentId = row.getAttribute('data-student-db-id');
        const checked = row.querySelector(`input[name="status_${studentId}"]:checked`);
        if (checked) {
            records.push({ student_id: Number(studentId), status: checked.value });
        } else {
            hasUnmarked = true;
        }
    });

    if (records.length === 0) {
        showAlert('alertContainer', 'Please mark attendance for at least one student.', 'danger');
        return;
    }

    if (hasUnmarked) {
        showAlert('alertContainer', 'Some students are unmarked and will be skipped. Marking available selections...', 'warning');
    }

    try {
        toggleSpinner(true);
        const res = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ date, records })
        });
        const data = await res.json();

        if (data.success) {
            showAlert('alertContainer', data.message, 'success');
        } else {
            showAlert('alertContainer', data.message, 'danger');
        }
    } catch (err) {
        showAlert('alertContainer', 'Unable to save attendance. Please try again.', 'danger');
    } finally {
        toggleSpinner(false);
    }
}

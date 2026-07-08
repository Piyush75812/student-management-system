// ===================================================
// Dashboard Page Logic
// ===================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Wire up dropdown logout button too
    const logoutBtnDropdown = document.getElementById('logoutBtnDropdown');
    if (logoutBtnDropdown) logoutBtnDropdown.addEventListener('click', (e) => { e.preventDefault(); logout(); });

    try {
        toggleSpinner(true);
        const res = await fetch(`${API_BASE_URL}/dashboard/summary`, { headers: authHeaders() });
        const data = await res.json();

        if (res.status === 401) { logout(); return; }

        if (data.success) {
            document.getElementById('totalStudents').textContent = data.data.totalStudents;
            document.getElementById('totalCourses').textContent = data.data.totalCourses;
            document.getElementById('totalTeachers').textContent = data.data.totalTeachers;

            const tbody = document.getElementById('recentStudentsBody');
            if (data.data.recentStudents.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No students registered yet</td></tr>`;
            } else {
                tbody.innerHTML = data.data.recentStudents.map(s => `
                    <tr>
                        <td>${escapeHtml(s.student_id)}</td>
                        <td>${escapeHtml(s.full_name)}</td>
                        <td>${escapeHtml(s.course_name || '-')}</td>
                        <td>${escapeHtml(s.semester)}</td>
                        <td>${new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                `).join('');
            }
        }
    } catch (err) {
        showAlert('alertContainer', 'Unable to load dashboard data. Please check your connection.', 'danger');
    } finally {
        toggleSpinner(false);
    }
});

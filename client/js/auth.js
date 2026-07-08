// ===================================================
// Auth Helper Functions
// ===================================================

// Save token & user info after login
function saveAuth(token, user) {
    localStorage.setItem('sms_token', token);
    localStorage.setItem('sms_user', JSON.stringify(user));
}

// Get saved token
function getToken() {
    return localStorage.getItem('sms_token');
}

// Get saved user
function getUser() {
    const user = localStorage.getItem('sms_user');
    return user ? JSON.parse(user) : null;
}

// Clear auth data and redirect to login
function logout() {
    localStorage.removeItem('sms_token');
    localStorage.removeItem('sms_user');
    window.location.href = 'login.html';
}

// Protect admin pages - call this at the top of every protected page
function requireAuth() {
    if (!getToken()) {
        window.location.href = 'login.html';
    }
}

// Redirect to dashboard if already logged in (used on login page)
function redirectIfLoggedIn() {
    if (getToken()) {
        window.location.href = 'dashboard.html';
    }
}

// Build headers with Authorization token for fetch calls
function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

// ---------------- Login Form Handler ----------------
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    redirectIfLoggedIn();

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorBox = document.getElementById('loginError');
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        errorBox.classList.add('d-none');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Logging in...';

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!data.success) {
                errorBox.textContent = data.message || 'Login failed';
                errorBox.classList.remove('d-none');
                return;
            }

            saveAuth(data.token, data.user);
            window.location.href = 'dashboard.html';
        } catch (err) {
            errorBox.textContent = 'Unable to connect to server. Please try again.';
            errorBox.classList.remove('d-none');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Login';
        }
    });
});

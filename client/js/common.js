// ===================================================
// Common JS - Sidebar toggle, profile dropdown, alerts
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
    // Guard: only run on protected pages that include the sidebar
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    requireAuth();

    // Populate profile name in navbar
    const user = getUser();
    const profileName = document.getElementById('profileName');
    if (profileName && user) profileName.textContent = user.name;

    // Create a backdrop overlay used to close the sidebar on mobile
    const backdrop = document.createElement('div');
    backdrop.id = 'sidebarBackdrop';
    backdrop.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(15,23,42,0.4);z-index:1035;';
    document.body.appendChild(backdrop);

    const openSidebar = () => {
        sidebar.classList.add('show');
        backdrop.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
        sidebar.classList.remove('show');
        backdrop.style.display = 'none';
        document.body.style.overflow = '';
    };

    // Sidebar toggle for mobile
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.contains('show') ? closeSidebar() : openSidebar();
        });
    }

    // Tapping the backdrop closes the sidebar
    backdrop.addEventListener('click', closeSidebar);

    // Auto-close sidebar after tapping a nav link on mobile
    sidebar.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 991) closeSidebar();
        });
    });

    // Reset sidebar/backdrop state if window is resized back to desktop width
    window.addEventListener('resize', () => {
        if (window.innerWidth > 991) closeSidebar();
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Highlight active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Show a bootstrap alert message inside a given container id
function showAlert(containerId, message, type = 'success') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    container.innerHTML = alertHtml;

    setTimeout(() => {
        const alertEl = container.querySelector('.alert');
        if (alertEl) alertEl.remove();
    }, 4000);
}

// Toggle a full-page loading spinner
function toggleSpinner(show) {
    let overlay = document.getElementById('spinnerOverlay');
    if (show) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'spinnerOverlay';
            overlay.className = 'spinner-overlay';
            overlay.innerHTML = `<div class="spinner-border text-primary" style="width:3rem;height:3rem;" role="status"></div>`;
            document.body.appendChild(overlay);
        }
    } else if (overlay) {
        overlay.remove();
    }
}

// Escape HTML to prevent XSS when injecting dynamic content into tables
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

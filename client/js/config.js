// ===================================================
// Global Config
// ===================================================

// Automatically use localhost while developing, and your deployed
// Railway backend URL once the site is live on Vercel.
// 👉 Replace the URL below with your actual Railway backend URL after deployment.
const PRODUCTION_API_URL = 'https://your-backend-name.up.railway.app/api';

const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:7000/api'
    : PRODUCTION_API_URL;

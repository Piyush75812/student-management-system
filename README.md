# 🎓 Student Management System

A full-stack **Student Management System** built with **HTML5, CSS3, Bootstrap 5, JavaScript (ES6)** on the frontend and **Node.js, Express.js, MySQL** on the backend. Designed as a clean, responsive, beginner-friendly project — ideal for a fresher's portfolio.

---

## ✨ Features

- 🔐 Admin Login with JWT Authentication
- 📊 Dashboard with summary cards (Total Students, Courses, Teachers) + recent registrations
- 👨‍🎓 Student Management — full CRUD with search & pagination
- 👩‍🏫 Teacher Management — full CRUD
- 📚 Course Management — full CRUD
- 🗓️ Attendance Management — mark daily attendance (Present/Absent/Leave) per student, editable per date
- 📝 Marks Management — record exam-wise marks per student/course with auto-calculated percentage
- ✅ Form validation (required fields, email format, phone length, duplicate ID checks)
- 📱 Fully responsive UI (desktop, tablet, mobile) using Bootstrap 5
- 🎨 Clean blue & white theme with cards, shadows, rounded buttons, and simple animations
- 🔔 Success/Error alerts, loading spinner, confirmation modal before delete
- 🚫 Custom 404 error page
- 🧱 MVC architecture on the backend (routes → controllers → models)

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|------------------------------------------|
| Frontend   | HTML5, CSS3, Bootstrap 5, JavaScript ES6 |
| Backend    | Node.js, Express.js                      |
| Database   | MySQL                                    |
| Auth       | JWT (jsonwebtoken) + bcryptjs            |

---

## 📁 Project Structure

```
student-management-system/
│
├── client/
│   ├── css/style.css
│   ├── js/
│   │   ├── config.js        # API base URL
│   │   ├── auth.js          # Login + auth helpers
│   │   ├── common.js        # Sidebar, alerts, spinner
│   │   ├── dashboard.js
│   │   ├── students.js
│   │   ├── teachers.js
│   │   ├── courses.js
│   │   ├── attendance.js
│   │   └── marks.js
│   ├── pages/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── students.html
│   │   ├── teachers.html
│   │   ├── courses.html
│   │   ├── attendance.html
│   │   ├── marks.html
│   │   └── 404.html
│   └── index.html
│
├── server/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── database/
│   └── student_management.sql
│
└── README.md
```

---

## 🚀 Setup Instructions

### 1. Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v16 or above)
- [MySQL](https://dev.mysql.com/downloads/) (v8 recommended)

### 2. Set up the Database
1. Open MySQL Workbench or your MySQL CLI.
2. Run the SQL script to create the database, tables, and seed data:
   ```bash
   mysql -u root -p < database/student_management.sql
   ```
   This creates the `student_management` database with sample students, teachers, and courses, plus a default admin account.

### 3. Set up the Backend
```bash
cd server
npm install
cp .env.example .env
```
Now open `.env` and update your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=student_management
DB_PORT=3306
JWT_SECRET=studentmanagementsecretkey123
```
Start the backend server:
```bash
npm run dev
```
The API will run at **http://localhost:7000**

### 4. Set up the Frontend
The frontend is plain HTML/CSS/JS — no build step required.

- Simply open `client/pages/login.html` in your browser, **or**
- Serve it with a lightweight static server (recommended, avoids CORS/file:// issues):
  ```bash
  cd client
  npx serve .
  ```
  Then visit the printed URL and go to `/pages/login.html`.

> If your backend runs on a different port/host, update `API_BASE_URL` in `client/js/config.js`.

### 5. Login
Use the default seeded admin account:
```
Email: admin@sms.com
Password: Admin@123
```

---

## 🔌 REST API Overview

| Method | Endpoint                | Description               | Protected |
|--------|--------------------------|----------------------------|-----------|
| POST   | /api/auth/login          | Admin login                | No        |
| GET    | /api/auth/me             | Get logged-in admin info   | Yes       |
| GET    | /api/dashboard/summary   | Dashboard summary stats    | Yes       |
| GET    | /api/students            | List students (search/paginate) | Yes  |
| POST   | /api/students            | Add student                | Yes       |
| GET    | /api/students/:id        | Get single student         | Yes       |
| PUT    | /api/students/:id        | Update student              | Yes       |
| DELETE | /api/students/:id        | Delete student              | Yes       |
| GET    | /api/teachers            | List teachers                | Yes     |
| POST   | /api/teachers            | Add teacher                  | Yes     |
| PUT    | /api/teachers/:id        | Update teacher                | Yes     |
| DELETE | /api/teachers/:id        | Delete teacher                | Yes     |
| GET    | /api/courses             | List courses                  | Yes     |
| POST   | /api/courses             | Add course                    | Yes     |
| PUT    | /api/courses/:id         | Update course                  | Yes     |
| DELETE | /api/courses/:id         | Delete course                  | Yes     |
| GET    | /api/attendance?date=    | Get attendance for all students on a date | Yes |
| POST   | /api/attendance          | Bulk mark attendance for a date | Yes   |
| GET    | /api/attendance/student/:studentId | Attendance history for one student | Yes |
| GET    | /api/marks?search=       | List marks (search by student) | Yes    |
| POST   | /api/marks               | Add marks record               | Yes     |
| PUT    | /api/marks/:id           | Update marks record             | Yes     |
| DELETE | /api/marks/:id           | Delete marks record             | Yes     |
| GET    | /api/marks/student/:studentId | Marks history for one student | Yes |

All protected routes require a header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📝 Notes for Portfolio / Resume

- Mention this project as: **"Student Management System – Full Stack Web App (Node.js, Express, MySQL, Bootstrap 5)"**
- Highlights to call out: JWT authentication, RESTful API design, MVC architecture, normalized MySQL schema with foreign keys, responsive UI, form validation, and CRUD operations across three entities.

---

## 👤 Author

**Piyush Kumar**
MCA Student | Full Stack Developer (Fresher)

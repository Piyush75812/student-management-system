-- ===================================================
-- Student Management System - Database Schema
-- ===================================================

DROP DATABASE IF EXISTS student_management;
CREATE DATABASE student_management;
USE student_management;

-- ---------------------------------------------------
-- Table: users (Admin login)
-- ---------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------
-- Table: courses
-- ---------------------------------------------------
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------
-- Table: teachers
-- ---------------------------------------------------
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------
-- Table: students
-- ---------------------------------------------------
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    dob DATE NOT NULL,
    course_id INT,
    semester INT NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- ---------------------------------------------------
-- Table: attendance
-- ---------------------------------------------------
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Leave') NOT NULL DEFAULT 'Present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_date (student_id, attendance_date)
);

-- ---------------------------------------------------
-- Table: marks
-- ---------------------------------------------------
CREATE TABLE marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT,
    exam_type VARCHAR(50) NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- ---------------------------------------------------
-- Seed Data
-- ---------------------------------------------------

-- Default Admin (email: admin@sms.com | password: Admin@123)
-- Password below is bcrypt hash of "Admin@123"
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@sms.com', '$2b$10$wNy.nZSIXh47VKUQqifp1epDyhXZ4MrFki1QpjwoDwZ2H2Z7aqtTS', 'admin');

INSERT INTO courses (course_code, course_name, duration, semester) VALUES
('CSE101', 'Computer Science Engineering', '4 Years', 1),
('MCA201', 'Master of Computer Applications', '2 Years', 1),
('BCA301', 'Bachelor of Computer Applications', '3 Years', 1),
('ECE401', 'Electronics & Communication Engineering', '4 Years', 1);

INSERT INTO teachers (teacher_id, name, department, email, phone) VALUES
('T001', 'Dr. Ramesh Sharma', 'Computer Science', 'ramesh.sharma@sms.com', '9876543210'),
('T002', 'Prof. Anita Verma', 'Electronics', 'anita.verma@sms.com', '9876543211'),
('T003', 'Dr. Suresh Iyer', 'Mathematics', 'suresh.iyer@sms.com', '9876543212');

INSERT INTO students (student_id, full_name, email, phone, gender, dob, course_id, semester, address) VALUES
('S1001', 'Rahul Kumar', 'rahul.kumar@example.com', '9123456780', 'Male', '2003-05-14', 1, 3, 'Delhi, India'),
('S1002', 'Priya Singh', 'priya.singh@example.com', '9123456781', 'Female', '2002-11-02', 2, 2, 'Noida, India'),
('S1003', 'Aman Gupta', 'aman.gupta@example.com', '9123456782', 'Male', '2003-01-20', 3, 4, 'Ghaziabad, India');

INSERT INTO attendance (student_id, attendance_date, status) VALUES
(1, CURDATE(), 'Present'),
(2, CURDATE(), 'Absent'),
(3, CURDATE(), 'Present'),
(1, CURDATE() - INTERVAL 1 DAY, 'Present'),
(2, CURDATE() - INTERVAL 1 DAY, 'Present'),
(3, CURDATE() - INTERVAL 1 DAY, 'Leave');

INSERT INTO marks (student_id, course_id, exam_type, marks_obtained, max_marks) VALUES
(1, 1, 'Mid Term', 78, 100),
(1, 1, 'Final Term', 85, 100),
(2, 2, 'Mid Term', 65, 100),
(3, 3, 'Mid Term', 72, 100);

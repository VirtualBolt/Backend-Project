# Backend & Frontend System

Welcome to the full-stack system built using Laravel 11 (Backend) and React Vite (Frontend). This document serves as the primary walkthrough on how to execute, configure, and test the project.

---

##  Project Setup & Execution Guide

### 1. Backend Setup (Laravel)
The backend requires a MySQL connection. Please execute the following before running the server:

**Step A: Configure Environment Variables**
1. Ensure you have an empty MySQL database created (e.g., `backend`).
2. Open the `.env` file located in the root directory.
3. Update the database variables to match your local MySQL credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
```

**Step B: Install Dependencies & Setup**
Run the following commands in the root directory:
```bash
# 1. Install PHP dependencies
composer install

# 2. Run Database Migrations (This dynamically builds your Users & Books tables!)
php artisan migrate

# 3. Start the Laravel Server
php artisan serve
```
*Your backend is now securely running on `http://127.0.0.1:8000`.*

### 2. Frontend Setup (React Vite)
The frontend connects directly to the backend API you just launched. Open a **new terminal tab** and follow these steps:

```bash
# 1. Navigate into the frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start the React Development Server
npm run dev
```
*Your frontend is now available at `http://localhost:5173`.*

---

## Backend API Walkthrough & Routes

The backend uses stateless **JWT (JSON Web Tokens)** for robust authentication and implements a custom global scope for soft-deletions on the Books module. 

### Authentication Module (Prefix: `/api/auth`)
1. **`POST /register`**
   - **Inputs:** `name`, `email`, `password`
   - **Action:** Validates data, uniquely checks the email, securely hashes the password via `bcrypt`, and registers the user.
2. **`POST /login`**
   - **Inputs:** `email`, `password`
   - **Action:** Authenticates credentials and returns a secure **JWT Bearer Token**.
3. **`GET /profile`**
   - **Security:** *Protected (Requires JWT Token Header)*
   - **Action:** Returns the authenticated user entity resolving the JWT Subject.

### Books CRUD Module (Prefix: `/api/books`)
*All Book endpoints are secured via the `auth:api` middleware and require your JWT Token.*

1. **`GET /api/books`**
   - **Features:** Supports `?page=X` (Pagination: 10 per page) and `?search=String` (filters Title or Author).
   - **Action:** Lists available books. It utilizes a Global Scope to inherently hide any books where `_deleted = 1`.
2. **`POST /api/books`**
   - **Inputs:** `title` (required), `author` (required), `price`, `cover_image`, `published_date` (YYYY-MM-DD).
   - **Action:** Validates strict typing and creates a new Library record.
3. **`GET /api/books/{id}`**
   - **Action:** Fetches details of a specific book by ID. Returns 404 if soft-deleted or missing.
4. **`PUT /api/books/{id}`**
   - **Inputs:** Dynamic conditional fields.
   - **Action:** Applies updates cleanly to an existing record.
5. **`DELETE /api/books/{id}`**
   - **Action:** Triggers a custom `softDelete()` function on the Model. It does **not** permanently erase the row; instead, it safely updates `_deleted = 1`.

---

## How to Test

You can test these routes through two primary methods:

1. **The Visual React Frontend:** 
   Navigate to `http://localhost:5173`, create a dummy account, and use the beautiful Dashboard UI to add books, search them, use the calendar date-picker, and perform deletions!
   
2. **Postman (API Level):**
   There is a `postman_collection.json` file in the root directory. Import it into your Postman application. 
   - Execute the *Login* route.
   - Copy the `"access_token"` from the JSON response.
   - Set it as the value for the `jwt_token` Collection Variable in Postman.
   - You can now test every raw CRUD endpoint natively!


https://res.cloudinary.com/dfzodc4k2/video/upload/q_auto/f_auto/v1776962747/WhatsApp_Video_2026-04-23_at_10.12.45_PM_ojft8h.mp4

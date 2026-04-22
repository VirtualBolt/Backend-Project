# Mini Backend System

This is a mini backend system built using PHP (Laravel 11), MySQL, and JWT Authentication. It provides full API endpoints for user authentication and dynamic Book CRUD management (including pagination, search, validation, and a soft-delete mechanism).

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation Steps](#installation-steps)
- [DB Setup](#db-setup)
- [JWT Setup](#jwt-setup)
- [API Documentation](#api-documentation)
- [Postman Collection](#postman-collection)

## Features
- **User Authentication:** Registration, Login, and Profile endpoints secured strictly by JWT tokens.
- **Books CRUD:** Comprehensive JSON-based RESTful API for Books.
- **Search & Pagination:** The `GET /api/books` path paginates response items in bundles of 10 and accepts `?search=xyz` logic to explore `titles` or `authors` via Eloquent relationships.
- **Custom Soft Delete:** Book deletion updates a `_deleted` field as required, securely masked from typical data retrieves.
- **Security:** Hashed passwords (`Hash::make()` under bcrypt), detailed Data Validation (Form requests), preventing SQL-Injections with Eloquent Query Builders.

## Requirements
- PHP >= 8.2
- MySQL 8.x
- Composer

## Installation Steps
1. Clone or download this project to your local directory.
2. In the project root folder, run:
   ```bash
   composer install
   ```
3. Copy the `.env.example` file and rename it to `.env`:
   ```bash
   copy .env.example .env
   ```
4. Generate the application key:
   ```bash
   php artisan key:generate
   ```

## DB Setup
1. Establish a connection to your MySQL server (via UI or CLI).
2. Import the enclosed `database.sql` dump file:
   ```bash
   mysql -u root -p < database.sql
   ```
3. This standard script initializes the `mini_backend` schema and spawns the `users` and `books` tables automatically.
4. Update your `.env` configuration sequentially:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=mini_backend
   DB_USERNAME=root
   DB_PASSWORD=your_password_here
   ```

*(Alternatively, if you prefer, you can run migrations strictly via Laravel: `php artisan migrate` after creating an empty database)*

## JWT Setup
The local token mechanism relies heavily on `tymon/jwt-auth`.
It is pre-configured in `config/auth.php` and its Provider is mapped globally.
Ensure it tracks your secrets cleanly by launching:
```bash
php artisan jwt:secret
```
It populates the `JWT_SECRET=` section in your `.env` securely.

## API Documentation

Our Base URL is typically `http://127.0.0.1:8000/api` when utilizing `php artisan serve`.

### Authentication Module

1. **`POST /api/auth/register`**
   - **Inputs:** `name` (string), `email` (string, unique), `password` (string, min 6)
   - **Return:** HTTP 201 Success Message + User.
2. **`POST /api/auth/login`**
   - **Inputs:** `email`, `password`
   - **Return:** HTTP 200 JSON with Bearer JWT Token mapping.
3. **`GET /api/auth/profile`**
   - **Headers:** `Authorization: Bearer <Your-JWT-Token>`
   - **Return:** HTTP 200 Currently logged User Entity.

### Books Module
*All endpoints are secure and require a valid Bearer JWT Authentication matching the header template layout above!*

1. **`GET /api/books`**
   - **Parameters:** `?search=String` (Optional)
   - **Return:** Full paginated array omitting `_deleted = 1` files.
2. **`POST /api/books`**
   - **Inputs:** `title` (required), `author` (required), `price` (optional), `cover_image` (optional), `published_date` (optional).
   - **Return:** HTTP 201 The newly minted entity.
3. **`GET /api/books/{id}`**
   - **Return:** Specific resource matching standard `id` checks.
4. **`PUT /api/books/{id}`**
    - **Inputs:** Reuses the parameter validations conditionally parsing fields mapping differences.
    - **Return:** Updates.
5. **`DELETE /api/books/{id}`**
    - Triggers the isolated Model logical mutation, enforcing `_deleted=1` across bounds and ceasing immediate visibility uniformly.

## Postman Collection
Import the included `postman_collection.json` file straight into the Postman console to execute visual simulations effortlessly.

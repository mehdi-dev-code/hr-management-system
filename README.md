# HR — Management System

A full-stack HR management system built to handle employees, departments,
attendance, and leave requests with role-based access control.

<!-- **Live demo:** _(add link once deployed)_ -->

## Overview

This is the backend — a Laravel REST API with token-based authentication
(Laravel Sanctum) and three roles: admin, HR, and employee. Admin/HR manage
departments, employees, and approve leave; employees check themselves in and
out and submit their own leave requests.

Built as a hands-on project while transitioning from a MERN background into
PHP/Laravel, alongside an internal HR coordinator role at BitcraftX.

## Tech stack

- **Laravel 13** (PHP 8.3)
- **Laravel Sanctum** — token authentication
- **MySQL** (local dev) / SQLite (deployment)
- **RESTful API** — no server-rendered views, pure JSON API

## Features

- Role-based access control (admin / hr / employee) via custom middleware
- Employee records linked 1:1 with user accounts, created together in a
  single DB transaction
- Department management with live headcount
- Daily attendance check-in/check-out, one record per employee per day
  (enforced at the database level with a unique constraint)
- Leave request workflow: employee submits → HR/admin approves or rejects
  with an optional note

## API summary

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/register`, `/api/login` | Public |
| GET | `/api/me` | Authenticated |
| POST | `/api/attendance/check-in`, `/check-out` | Authenticated (self) |
| POST | `/api/leave-requests` | Authenticated (self) |
| GET | `/api/leave-requests/mine` | Authenticated (self) |
| CRUD | `/api/departments`, `/api/employees` | HR / Admin only |
| GET | `/api/attendance` | HR / Admin only |
| GET | `/api/leave-requests` | HR / Admin only |
| PATCH | `/api/leave-requests/{id}/review` | HR / Admin only |

## Local setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Set your database credentials in `.env`, then:

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate --seed
php artisan serve
```

Seeded accounts (password for all: `password`):

| Role | Email |
|---|---|
| Admin | admin@hrms.test |
| HR | hr@hrms.test |
| Employee | employee@hrms.test |

## Design notes

- Role checks live in one place — a `role:admin,hr` middleware alias applied
  at the route group level, not scattered across controllers.
- Creating an employee creates a linked `User` account in the same DB
  transaction, so a failed insert never leaves an orphaned login with no
  employee record (or vice versa).
- Attendance has a compound unique constraint on `(employee_id, date)` —
  duplicate check-ins for the same day are rejected by the database itself,
  not just application logic.

<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@hrms.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // HR coordinator
        User::create([
            'name' => 'HR Coordinator',
            'email' => 'hr@hrms.test',
            'password' => Hash::make('password'),
            'role' => 'hr',
        ]);

        // Departments
        $engineering = Department::create(['name' => 'Engineering', 'description' => 'Product & platform engineering']);
        $sales = Department::create(['name' => 'Sales', 'description' => 'Sales & business development']);

        // Sample employees (each gets a linked User with role=employee)
        $employeeUser = User::create([
            'name' => 'Jane Employee',
            'email' => 'employee@hrms.test',
            'password' => Hash::make('password'),
            'role' => 'employee',
        ]);

        Employee::create([
            'user_id' => $employeeUser->id,
            'department_id' => $engineering->id,
            'employee_code' => 'EMP-001',
            'designation' => 'Backend Developer',
            'joining_date' => now()->subMonths(6),
            'salary' => 80000,
        ]);

        $employeeUser2 = User::create([
            'name' => 'John Sales',
            'email' => 'john@hrms.test',
            'password' => Hash::make('password'),
            'role' => 'employee',
        ]);

        Employee::create([
            'user_id' => $employeeUser2->id,
            'department_id' => $sales->id,
            'employee_code' => 'EMP-002',
            'designation' => 'Sales Executive',
            'joining_date' => now()->subMonths(3),
            'salary' => 60000,
        ]);
    }
}

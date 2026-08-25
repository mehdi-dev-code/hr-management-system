<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with(['user', 'department']);

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(15));
    }

    // Creates a User + linked Employee record in one transaction.
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'department_id' => 'nullable|exists:departments,id',
            'employee_code' => 'required|string|unique:employees,employee_code',
            'designation' => 'required|string|max:255',
            'joining_date' => 'required|date',
            'salary' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $employee = DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'employee',
            ]);

            return Employee::create([
                'user_id' => $user->id,
                'department_id' => $request->department_id,
                'employee_code' => $request->employee_code,
                'designation' => $request->designation,
                'joining_date' => $request->joining_date,
                'salary' => $request->salary,
            ]);
        });

        return response()->json($employee->load('user', 'department'), 201);
    }

    public function show(Employee $employee)
    {
        return response()->json($employee->load(['user', 'department', 'attendances', 'leaveRequests']));
    }

    public function update(Request $request, Employee $employee)
    {
        $validator = Validator::make($request->all(), [
            'department_id' => 'nullable|exists:departments,id',
            'designation' => 'sometimes|required|string|max:255',
            'salary' => 'nullable|numeric|min:0',
            'status' => 'sometimes|in:active,on_leave,terminated',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $employee->update($validator->validated());

        return response()->json($employee->load('user', 'department'));
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return response()->json(['message' => 'Employee deleted']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    // Employee checks themself in for today.
    public function checkIn(Request $request)
    {
        $employee = $request->user()->employee;

        if (!$employee) {
            return response()->json(['message' => 'No employee record linked to this user'], 404);
        }

        $attendance = Attendance::firstOrCreate(
            ['employee_id' => $employee->id, 'date' => now()->toDateString()],
            ['check_in' => now()->toTimeString(), 'status' => 'present']
        );

        if ($attendance->check_in && $attendance->wasRecentlyCreated === false) {
            return response()->json(['message' => 'Already checked in today'], 409);
        }

        return response()->json($attendance);
    }

    public function checkOut(Request $request)
    {
        $employee = $request->user()->employee;

        $attendance = Attendance::where('employee_id', $employee->id)
            ->where('date', now()->toDateString())
            ->first();

        if (!$attendance) {
            return response()->json(['message' => 'No check-in found for today'], 404);
        }

        $attendance->update(['check_out' => now()->toTimeString()]);

        return response()->json($attendance);
    }

    // HR/admin: view attendance, optionally filtered by employee or date range.
    public function index(Request $request)
    {
        $query = Attendance::with('employee.user');

        if ($request->has('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }
        if ($request->has('from') && $request->has('to')) {
            $query->whereBetween('date', [$request->from, $request->to]);
        }

        return response()->json($query->orderByDesc('date')->paginate(30));
    }
}

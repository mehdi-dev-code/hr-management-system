<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LeaveRequestController extends Controller
{
    // HR/admin: see all leave requests, optionally filtered by status.
    public function index(Request $request)
    {
        $query = LeaveRequest::with(['employee.user', 'reviewer']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderByDesc('created_at')->paginate(15));
    }

    // Employee: submit a new leave request for themself.
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $employee = $request->user()->employee;

        if (!$employee) {
            return response()->json(['message' => 'No employee record linked to this user'], 404);
        }

        $leave = LeaveRequest::create([
            'employee_id' => $employee->id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
        ]);

        return response()->json($leave, 201);
    }

    // Employee: view their own leave history.
    public function myLeaves(Request $request)
    {
        $employee = $request->user()->employee;

        return response()->json(
            LeaveRequest::where('employee_id', $employee->id)->orderByDesc('created_at')->get()
        );
    }

    // HR/admin: approve or reject a pending request.
    public function review(Request $request, LeaveRequest $leaveRequest)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected',
            'review_note' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $leaveRequest->update([
            'status' => $request->status,
            'reviewed_by' => $request->user()->id,
            'review_note' => $request->review_note,
        ]);

        return response()->json($leaveRequest->load('employee.user', 'reviewer'));
    }
}

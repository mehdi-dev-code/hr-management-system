<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    public function index()
    {
        return response()->json(Department::withCount('employees')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:departments,name',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $department = Department::create($validator->validated());

        return response()->json($department, 201);
    }

    public function show(Department $department)
    {
        return response()->json($department->load('employees.user'));
    }

    public function update(Request $request, Department $department)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:departments,name,' . $department->id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $department->update($validator->validated());

        return response()->json($department);
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return response()->json(['message' => 'Department deleted']);
    }
}

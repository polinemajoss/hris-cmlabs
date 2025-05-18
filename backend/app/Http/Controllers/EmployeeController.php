<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EmployeeController extends Controller
{
    // Get all employees
    public function index()
    {
        return Employee::with('user')->get();
    }

    // Store new employee
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'     => 'required|exists:users,id',
            'first_name'  => 'required|string|max:100',
            'last_name'   => 'required|string|max:100',
            'gender'      => 'required|in:M,F',
            'address'     => 'nullable|string',
            'ck_settings_id' => 'nullable|uuid',
        ]);

        $validated['id'] = (string) Str::uuid();

        $employee = Employee::create($validated);

        return response()->json($employee, 201);
    }

    // Show specific employee
    public function show($id)
    {
        return Employee::with('user')->findOrFail($id);
    }

    // Update employee
    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        $employee->update($request->only([
            'first_name',
            'last_name',
            'gender',
            'address',
            'ck_settings_id'
        ]));

        return response()->json($employee);
    }

    // Delete employee
    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return response()->json(['message' => 'Employee deleted']);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class EmployeeController extends Controller
{
    // Get all employees
    public function index()
    {
        return response()->json(Employee::with('user')->get(), 200);
    }

    // Show specific employee
    public function show($id)
    {
        try {
            $employee = Employee::with('user')->findOrFail($id);
            return response()->json($employee, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Employee not found'], 404);
        }
    }

    // Store new employee
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'gender' => 'required|in:M,F',
                'mobile_number' => 'nullable|string|max:20',
                'nik' => 'nullable|string|max:20|unique:employees,nik',
                'birth_place' => 'nullable|string|max:100',
                'birth_date' => 'nullable|date',
                'education' => 'nullable|string|max:100',
                'position' => 'nullable|string|max:100',
                'grade' => 'nullable|string|max:50',
                'branch' => 'nullable|string|max:100',
                'contract_type' => 'nullable|in:Tetap,Kontrak,Lepas',
                'bank' => 'nullable|string|max:50',
                'bank_account_number' => 'nullable|string|max:50',
                'bank_account_name' => 'nullable|string|max:100',
                'sp_type' => 'nullable|string|max:50',
                'status' => 'nullable|in:Aktif,Tidak Aktif',
                'avatar' => 'nullable|string',
            ]);

            $validated['id'] = (string) Str::uuid();

            $employee = Employee::create($validated);
            return response()->json($employee, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    // Update employee
    public function update(Request $request, $id)
    {
        try {
            $employee = Employee::findOrFail($id);

            $validated = $request->validate([
                'first_name' => 'sometimes|string|max:100',
                'last_name' => 'sometimes|string|max:100',
                'gender' => 'sometimes|in:M,F',
                'mobile_number' => 'nullable|string|max:20',
                'nik' => 'nullable|string|max:20|unique:employees,nik,' . $id,
                'birth_place' => 'nullable|string|max:100',
                'birth_date' => 'nullable|date',
                'education' => 'nullable|string|max:100',
                'position' => 'nullable|string|max:100',
                'grade' => 'nullable|string|max:50',
                'branch' => 'nullable|string|max:100',
                'contract_type' => 'nullable|in:Tetap,Kontrak,Lepas',
                'bank' => 'nullable|string|max:50',
                'bank_account_number' => 'nullable|string|max:50',
                'bank_account_name' => 'nullable|string|max:100',
                'sp_type' => 'nullable|string|max:50',
                'status' => 'nullable|in:Aktif,Tidak Aktif',
                'avatar' => 'nullable|string',
            ]);

            $employee->update($validated);
            return response()->json($employee, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Employee not found'], 404);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    // Delete employee
    public function destroy($id)
    {
        try {
            $employee = Employee::findOrFail($id);
            $employee->delete();
            return response()->json(['message' => 'Employee deleted'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Employee not found'], 404);
        }
    }
}

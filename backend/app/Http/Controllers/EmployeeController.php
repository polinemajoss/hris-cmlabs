<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log; 
use Illuminate\Support\Str;
use Illuminate\Validation\Rule; 


class EmployeeController extends Controller
{
    // Get all employees
    public function index()
    {
        try {
            // Return data langsung sesuai yang diharapkan frontend Anda saat ini
            return response()->json(Employee::with('user')->get(), 200);
        } catch (\Exception $e) {
            Log::error("Error fetching employees: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve employees.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Show specific employee
    public function show($id)
    {
        try {
            $employee = Employee::with('user')->findOrFail($id);
            return response()->json($employee, 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Employee not found'], 404);
        } catch (\Exception $e) {
            Log::error("Error fetching employee by ID: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve employee.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Store new employee
    public function store(Request $request)
    {
        try {
            Log::info('Received Request Data:', $request->all());
            $validated = $request->validate([
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'gender' => 'required|in:M,F', // Perhatikan: ini 'M' atau 'F'
                'mobile_number' => 'nullable|string|max:20',
                'nik' => 'nullable|string|max:20|unique:employees,nik',
                'birth_place' => 'nullable|string|max:100',
                'birth_date' => 'nullable|date', // Format YYYY-MM-DD
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

            $validated['user_id'] = $validated['user_id'] ?? Str::uuid(); // Ambil user_id dari token yang sudah ada

            $employee = Employee::create($validated);
            return response()->json([
                'status' => 'success',
                'message' => 'Employee created successfully',
                'data' => $employee
            ], 201);
        } catch (ValidationException $e) {
            Log::error("Validation Error creating employee: " . json_encode($e->errors()));
            return response()->json(['status' => 'error', 'message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error("Error creating employee: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create employee.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update employee
    public function update(Request $request, $id)
    {
        try {
            $employee = Employee::findOrFail($id);

            $validated = $request->validate([
                'user_id'       => 'required|exists:users,id',
                'first_name'    => 'required|string|max:100',
                'last_name'     => 'required|string|max:100',
                'gender'        => 'required|in:M,F', // Hanya 'M' atau 'F'
                'mobile_number' => 'nullable|string|max:20',
                'nik'           => [ // <--- UBAH BAGIAN INI
                    'nullable',
                    'string',
                    'max:20',
                    Rule::unique('employees', 'nik')->ignore($employee->id), // Mengabaikan ID employee saat ini
                ],                'birth_place' => 'nullable|string|max:100',
                'birth_date'          => 'nullable|date', // Format YYYY-MM-DD
                'education'           => 'nullable|string|max:100',
                'position'            => 'nullable|string|max:100',
                'grade'               => 'nullable|string|max:50',
                'branch'              => 'nullable|string|max:100',
                'contract_type'       => 'nullable|in:Tetap,Kontrak,Lepas',
                'bank'                => 'nullable|string|max:50',
                'bank_account_number' => 'nullable|string|max:50',
                'bank_account_name'   => 'nullable|string|max:100',
                'sp_type'             => 'nullable|string|max:50',
                'status'              => 'nullable|in:Aktif,Tidak Aktif',
                'avatar'              => 'nullable|string',
            ]);

            $employee->update($validated);
            return response()->json([
                'status' => 'success',
                'message' => 'Employee updated successfully',
                'data' => $employee
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Employee not found'], 404);
        } catch (ValidationException $e) {
            Log::error("Validation Error updating employee: " . json_encode($e->errors()));
            return response()->json(['status' => 'error', 'message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error("Error updating employee: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update employee.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Delete employee
    public function destroy($id)
    {
        try {
            $employee = Employee::findOrFail($id);
            $employee->delete();
            return response()->json(['status' => 'success', 'message' => 'Employee deleted'], 200); // 204 No Content juga cocok
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Employee not found'], 404);
        } catch (\Exception $e) {
            Log::error("Error deleting employee: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete employee.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
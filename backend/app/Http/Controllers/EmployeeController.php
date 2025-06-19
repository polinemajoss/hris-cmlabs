<?php

namespace App\Http\Controllers;

use App\Models\User; // Pastikan ini diimpor jika Anda menggunakannya di sini, meskipun tidak di method ini
use App\Models\Employee;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException; // Diimpor tapi tidak dipakai langsung di update
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str; // Diimpor tapi tidak dipakai langsung di store/update/destroy
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash; // Diimpor tapi tidak dipakai langsung di EmployeeController
use Illuminate\Support\Facades\Validator;


class EmployeeController extends Controller
{
    // Get all employees
    public function index()
    {
        try {
            // Mengembalikan data employee dengan relasi user
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
        $validator = Validator::make($request->all(),[
            'email' => 'required|string|email|max:255|unique:users,email',
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
            'avatar' => 'nullable|string', // Avatar disimpan via endpoint terpisah, ini hanya untuk path di DB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Menggunakan transaksi database untuk memastikan kedua operasi berhasil atau tidak sama sekali
            $newEmployee = DB::transaction(function () use ($request) {
                // A. Buat User baru
                $newUser = User::create([
                    'name' => $request->input('first_name') . ' ' . $request->input('last_name'),
                    'email' => $request->input('email'),
                    'password' => Hash::make(Str::random(10)), // Password acak
                    'role' => 'employee', // <<< PENTING: SET ROLE DEFAULT 'employee' UNTUK USER BARU
                ]);

                // B. Buat record baru di tabel `employees`
                // Kita gunakan semua data dari request KECUALI 'email', lalu tambahkan 'user_id'
                return Employee::create(array_merge(
                    $request->except('email'), // Ambil semua input KECUALI email
                    ['user_id' => $newUser->id] // Tambahkan user_id dari user yang baru dibuat
                ));
            });

            return response()->json([
                'message' => 'Karyawan dan Akun Pengguna berhasil dibuat!',
                'data' => $newEmployee->load('user') // Load user relation to return full data
            ], 201);

        } catch (\Exception $e) {
            Log::error("Gagal membuat Karyawan & User: " . $e->getMessage());
            return response()->json([
                'message' => 'Gagal membuat Karyawan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update employee
    public function update(Request $request, $id)
    {
        try {
            $employee = Employee::findOrFail($id);

            // Validasi data yang masuk
            $validatedData = $request->validate([
                'user_id'       => 'required|exists:users,id',
                'first_name'    => 'required|string|max:100',
                'last_name'     => 'required|string|max:100',
                'gender'        => 'required|in:M,F',
                'mobile_number' => 'nullable|string|max:20',
                'nik'           => [
                    'nullable',
                    'string',
                    'max:20',
                    Rule::unique('employees', 'nik')->ignore($employee->id), // Mengabaikan ID employee saat ini
                ],
                'birth_place'   => 'nullable|string|max:100',
                'birth_date'    => 'nullable|date',
                'education'     => 'nullable|string|max:100',
                'position'      => 'nullable|string|max:100',
                'grade'         => 'nullable|string|max:50',
                'branch'        => 'nullable|string|max:100',
                'contract_type' => 'nullable|in:Tetap,Kontrak,Lepas',
                'bank'          => 'nullable|string|max:50',
                'bank_account_number' => 'nullable|string|max:50',
                'bank_account_name' => 'nullable|string|max:100',
                'sp_type'       => 'nullable|string|max:50',
                'status'        => 'nullable|in:Aktif,Tidak Aktif',
                'avatar'        => 'nullable|string', // Avatar disimpan via endpoint terpisah, ini hanya untuk path di DB
            ]);

            // Update user data (name)
            $user = User::find($validatedData['user_id']);
            if ($user) {
                $user->name = $validatedData['first_name'] . ' ' . $validatedData['last_name'];
                // Update email hanya jika dikirim dan berbeda
                if ($request->has('email') && $request->input('email') !== $user->email) {
                     $user->email = $request->input('email');
                     // Tambahkan validasi unique email jika diperlukan di sini juga
                }
                $user->save();
            }

            $employee->update($validatedData); // Update data employee

            return response()->json([
                'status' => 'success',
                'message' => 'Employee updated successfully',
                'data' => $employee->load('user') // Load user relation to return full data
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
            // Hapus user terkait jika diperlukan (hati-hati dengan ini di produksi)
            // if ($employee->user) {
            //     $employee->user->delete();
            // }
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

    // Download PDF for a specific employee
    public function downloadPDF(Employee $employee)
    {
        $data = [
            'employee' => $employee
        ];

        $pdf = PDF::loadView('pdf.employee-details', $data);

        $fileName = 'data-karyawan-' . strtolower(str_replace(' ', '-', $employee->first_name)) . '.pdf';
        
        return $pdf->stream($fileName);
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SalaryController extends Controller
{
    public function index()
    {
        // Mengembalikan daftar gaji
        return response()->json(['message' => 'List of salaries']);
    }

    public function store(Request $request)
    {
        // Menyimpan data gaji baru
        return response()->json(['message' => 'Salary created successfully']);
    }

    public function show($id)
    {
        // Menampilkan detail gaji berdasarkan ID
        return response()->json(['message' => "Details of salary with ID: $id"]);
    }

    public function update(Request $request, $id)
    {
        // Memperbarui data gaji berdasarkan ID
        return response()->json(['message' => "Salary with ID: $id updated successfully"]);
    }

    public function destroy($id)
    {
        // Menghapus data gaji berdasarkan ID
        return response()->json(['message' => "Salary with ID: $id deleted successfully"]);
    }
}
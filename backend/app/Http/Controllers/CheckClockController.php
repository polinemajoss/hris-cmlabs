<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CheckClockController extends Controller
{
    public function index()
    {
        // Mengembalikan daftar absensi
        return response()->json(['message' => 'List of clock checks']);
    }

    public function store(Request $request)
    {
        // Menyimpan data absensi baru
        return response()->json(['message' => 'Clock check created successfully']);
    }

    public function show($id)
    {
        // Menampilkan detail absensi berdasarkan ID
        return response()->json(['message' => "Details of clock check with ID: $id"]);
    }

    public function update(Request $request, $id)
    {
        // Memperbarui data absensi berdasarkan ID
        return response()->json(['message' => "Clock check with ID: $id updated successfully"]);
    }

    public function destroy($id)
    {
        // Menghapus data absensi berdasarkan ID
        return response()->json(['message' => "Clock check with ID: $id deleted successfully"]);
    }
}
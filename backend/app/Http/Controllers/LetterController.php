<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LetterController extends Controller
{
    public function index()
    {
        // Mengembalikan daftar surat
        return response()->json(['message' => 'List of letters']);
    }

    public function store(Request $request)
    {
        // Menyimpan data surat baru
        return response()->json(['message' => 'Letter created successfully']);
    }

    public function show($id)
    {
        // Menampilkan detail surat berdasarkan ID
        return response()->json(['message' => "Details of letter with ID: $id"]);
    }

    public function update(Request $request, $id)
    {
        // Memperbarui data surat berdasarkan ID
        return response()->json(['message' => "Letter with ID: $id updated successfully"]);
    }

    public function destroy($id)
    {
        // Menghapus data surat berdasarkan ID
        return response()->json(['message' => "Letter with ID: $id deleted successfully"]);
    }
}
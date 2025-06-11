<?php

namespace App\Http\Controllers;

use App\Models\Letter; // <-- PASTIKAN ANDA SUDAH MEMBUAT MODEL INI
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Exception;

class LetterController extends Controller
{
    /**
     * Menampilkan daftar surat dengan filter, pencarian, dan paginasi.
     * Ini adalah fungsi yang akan dipanggil oleh frontend.
     */
    public function index(Request $request)
    {
        try {
            // Validasi input sederhana
            $request->validate([
                'type' => 'nullable|string',
                'search' => 'nullable|string',
                'page' => 'nullable|integer',
                'limit' => 'nullable|integer',
            ]);

            // Mulai query ke model Letter
            $query = Letter::query();

            // Terapkan filter berdasarkan tipe jika ada di request
            if ($request->filled('type')) {
                // Ambil tipe dari string "izin,cuti" menjadi array ['izin', 'cuti']
                $types = explode(',', $request->input('type'));
                $query->whereIn('type', $types);
            }

            // Terapkan filter pencarian berdasarkan judul jika ada di request
            if ($request->filled('search')) {
                $searchTerm = $request->input('search');
                $query->where('title', 'like', '%' . $searchTerm . '%');
            }

            // Ambil data dengan paginasi
            $limit = $request->input('limit', 10); // Default 10 item per halaman
            $letters = $query->latest()->paginate($limit); // latest() untuk mengurutkan dari yang terbaru

            // Kembalikan data dalam format JSON yang diharapkan frontend
            return response()->json([
                'data' => $letters->items(),
                'meta' => [
                    'total' => $letters->total(),
                    'current_page' => $letters->currentPage(),
                    'last_page' => $letters->lastPage(),
                    'per_page' => $letters->perPage(),
                ]
            ], 200);

        } catch (QueryException $e) {
            // Handle error jika query ke database gagal (misal: tabel tidak ada)
            return response()->json(['message' => 'Database error.', 'error' => $e->getMessage()], 500);
        } catch (Exception $e) {
            // Handle error umum lainnya
            return response()->json(['message' => 'An unexpected error occurred.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Menyimpan data surat baru.
     * (Fungsi ini bisa Anda kembangkan nanti)
     */
    public function store(Request $request)
    {
        // Validasi, simpan data, dll.
        return response()->json(['message' => 'Letter created successfully'], 201);
    }

    /**
     * Menampilkan detail surat berdasarkan ID.
     * (Fungsi ini bisa Anda kembangkan nanti)
     */
    public function show($id)
    {
        // Cari surat berdasarkan ID
        $letter = Letter::find($id);
        if (!$letter) {
            return response()->json(['message' => 'Letter not found'], 404);
        }
        return response()->json($letter);
    }

    /**
     * Memperbarui data surat berdasarkan ID.
     * (Fungsi ini bisa Anda kembangkan nanti)
     */
    public function update(Request $request, $id)
    {
        // Validasi, update data, dll.
        return response()->json(['message' => "Letter with ID: $id updated successfully"]);
    }

    /**
     * Menghapus data surat berdasarkan ID.
     * (Fungsi ini bisa Anda kembangkan nanti)
     */
    public function destroy($id)
    {
        // Hapus data
        return response()->json(['message' => "Letter with ID: $id deleted successfully"]);
    }
}

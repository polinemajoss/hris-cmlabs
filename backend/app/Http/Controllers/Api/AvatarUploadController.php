<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator; // Validator diimpor, tapi $request->validate() tidak membutuhkannya secara langsung
use Illuminate\Support\Facades\Log; // Tambahkan ini untuk logging error

class AvatarUploadController extends Controller
{
    /**
     * Menangani permintaan upload avatar.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        Log::info('Avatar upload request received.', ['file_data' => $request->all()]); // Log semua data request

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            Log::info('File avatar detected.', [
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(), // <--- INI PENTING! Log MIME Type yang dideteksi Laravel
                'size_kb' => $file->getSize() / 1024,
                'extension' => $file->getClientOriginalExtension(),
            ]);
        } else {
            Log::info('No avatar file detected in the request.');
        }
        
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // max:2048 berarti 2048 KB = 2MB
        ]);

        if ($validator->fails()) { // Periksa validator secara eksplisit
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // 2. Simpan file ke dalam 'storage/app/public/avatars'
            // 'public' adalah disk yang bisa diakses publik
            $path = $request->file('avatar')->store('avatars', 'public');

            // 3. Dapatkan URL yang bisa diakses oleh frontend
            // Ini akan menghasilkan URL seperti 'http://localhost:8000/storage/avatars/namafile.jpg'
            // Pastikan Anda sudah menjalankan `php artisan storage:link`
            $url = Storage::url($path);

            // 4. Kirim kembali URL ke frontend
            return response()->json([
                'message' => 'Avatar berhasil diupload',
                'url' => $url,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Gagal upload avatar: ' . $e->getMessage()); // Menggunakan Log::error
            return response()->json(['message' => 'Terjadi kesalahan saat mengupload file.'], 500);
        }
    }
}
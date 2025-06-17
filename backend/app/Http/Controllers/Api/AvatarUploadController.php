<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
        // 1. Validasi file yang masuk
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Wajib ada, harus gambar, max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // 2. Simpan file ke dalam 'storage/app/public/avatars'
            // 'public' adalah disk yang bisa diakses publik
            $path = $request->file('avatar')->store('avatars', 'public');

            // 3. Dapatkan URL yang bisa diakses oleh frontend
            // Ini akan menghasilkan URL seperti 'http://localhost:8000/storage/avatars/namafile.jpg'
            $url = Storage::url($path);

            // 4. Kirim kembali URL ke frontend
            return response()->json([
                'message' => 'Avatar berhasil diupload',
                'url' => $url,
            ], 200);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Gagal upload avatar: ' . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan saat mengupload file.'], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\Employee; // Pastikan Anda mengimpor model Employee


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
        Log::info('Avatar upload request received.', ['file_data' => $request->all()]);

        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            Log::info('File avatar detected.', [
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size_kb' => $file->getSize() / 1024,
                'extension' => $file->getClientOriginalExtension(),
            ]);
        } else {
            Log::info('No avatar file detected in the request.');
        }

        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // max:2048 berarti 2048 KB = 2MB
            'employee_id' => 'sometimes|exists:employees,id', // Jika Anda mengirim employee_id dari frontend
        ]);

        if ($validator->fails()) {
            Log::warning('Avatar validation failed.', ['errors' => $validator->errors()->all()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Simpan file ke dalam 'storage/app/public/avatars'
            $path = $request->file('avatar')->store('avatars', 'public');
            $url = Storage::url($path); // Dapatkan URL yang bisa diakses oleh frontend (jalankan `php artisan storage:link`)

            // --- Bagian untuk menyimpan URL ke database karyawan ---
            if ($request->has('employee_id')) {
                $employee = Employee::find($request->input('employee_id'));
                if ($employee) {
                    // Hapus avatar lama jika ada
                    if ($employee->avatar && $employee->avatar !== $url) {
                        $oldPath = str_replace('/storage/', '', $employee->avatar);
                        if (Storage::disk('public')->exists($oldPath)) {
                            Storage::disk('public')->delete($oldPath);
                            Log::info('Old avatar deleted: ' . $oldPath);
                        }
                    }
                    $employee->avatar = $url;
                    $employee->save();
                    Log::info('Employee avatar updated in DB.', ['employee_id' => $employee->id, 'avatar_url' => $url]);
                } else {
                    // Jika employee_id tidak ditemukan, hapus file yang sudah terupload
                    Storage::disk('public')->delete($path);
                    Log::error('Employee not found for avatar update.', ['employee_id' => $request->input('employee_id')]);
                    return response()->json(['message' => 'Karyawan tidak ditemukan untuk update avatar.'], 404);
                }
            }
            // --- Akhir Bagian Penyimpanan DB ---

            return response()->json([
                'message' => 'Avatar berhasil diupload',
                'url' => $url,
            ], 200);

        } catch (\Exception $e) {
            // Jika terjadi error saat menyimpan file atau update DB, hapus file yang baru diupload
            if (isset($path) && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
            Log::error('Gagal upload atau update avatar: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Terjadi kesalahan saat mengupload atau menyimpan avatar.'], 500);
        }
    }
}
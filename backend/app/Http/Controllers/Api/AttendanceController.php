<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Menampilkan daftar riwayat absensi.
     * Sesuai untuk halaman "Checkclock Overview".
     */
    public function index()
    {
        try {
            // Mengambil data absensi dan relasi employee untuk menampilkan nama/jabatan
            // Sesuai dengan kebutuhan tabel di wireframe 
            $attendances = Attendance::with('employee')
                ->latest('attendance_time') // Diurutkan berdasarkan waktu absensi terbaru
                ->paginate(10); // Menggunakan pagination sesuai wireframe 

            return response()->json($attendances);
            
        } catch (\Exception $e) {
            Log::error('Error fetching attendances: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal mengambil data absensi.'], 500);
        }
    }

    /**
     * Menyimpan data absensi baru dari form "Add Checkclock".
     */
    public function store(Request $request)
    {
        // Validasi berdasarkan field di wireframe "Add Checkclock" 
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|string|exists:employees,id',
            'type' => 'required|string|in:Masuk,Pulang', // Disederhanakan untuk awal
            'attendance_time' => 'required|date_format:Y-m-d H:i:s', // Contoh format: 2025-06-08 08:00:00
            'photo_proof' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // max 2MB
            'address_detail' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $data = $validator->validated();

            // --- Logika Penentuan Status (sesuai kriteria evaluasi ) ---
            // CATATAN: Ini adalah logika sederhana. Nantinya akan dihubungkan dengan
            // modul "Check-Clock Settings" yang Anda buat.
            if ($data['type'] === 'Masuk') {
                $clockInTime = Carbon::parse($data['attendance_time']);
                // Asumsi jam masuk standar adalah 08:30
                $standardInTime = $clockInTime->copy()->setTime(8, 30, 0);

                if ($clockInTime->gt($standardInTime)) {
                    $data['status'] = 'Late';
                } else {
                    $data['status'] = 'On Time';
                }
            }
            // --- Akhir Logika Penentuan Status ---


            // Handle file upload jika ada
            if ($request->hasFile('photo_proof')) {
                // Simpan file di dalam folder 'public/proofs'
                // Path yang disimpan di DB akan menjadi 'proofs/namafile.jpg'
                $path = $request->file('photo_proof')->store('proofs', 'public');
                $data['photo_proof'] = $path;
            }

            $attendance = Attendance::create($data);

            return response()->json([
                'message' => 'Absensi berhasil direkam!',
                'data' => $attendance,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error storing attendance: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menyimpan data absensi.'], 500);
        }
    }

    /**
     * Menampilkan detail satu data absensi.
     */
    public function show(string $id)
    {
        try {
            $attendance = Attendance::with('employee.user')->findOrFail($id);
            return response()->json($attendance);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Data absensi tidak ditemukan.'], 404);
        }
    }

    // CATATAN: Fungsi update (untuk approval) dan destroy bisa ditambahkan di sini nanti.
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\Letter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SidebarCountController extends Controller
{
    /**
     * Mengambil dan mengembalikan jumlah data untuk filter di sidebar.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // === 1. Menghitung Jumlah Karyawan berdasarkan Status ===
        $employeeCounts = Employee::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        // === 2. Menghitung Jumlah Data Checkclock berdasarkan Status ===
        // Mengambil data untuk 'On Time', 'Late', dll. dari kolom 'status'
        $attendanceStatusCounts = Attendance::query()
            ->select('status', DB::raw('count(*) as total'))
            ->whereIn('status', ['On Time', 'Late', 'Absent', 'Sick Leave', 'Annual Leave'])
            ->groupBy('status')
            ->pluck('total', 'status');
        
        // Menghitung 'Waiting Approval' secara terpisah dari kolom 'approval_status'
        $waitingApprovalCount = Attendance::query()
            ->where('approval_status', 'Pending')
            ->count();

        // Menggabungkan hasil perhitungan absensi
        $checkclockCounts = $attendanceStatusCounts->toArray();
        $checkclockCounts['Waiting Approval'] = $waitingApprovalCount;

        // === 3. Menghitung Jumlah Surat berdasarkan Tipe ===
        $letterCounts = Letter::query()
            ->select('type', DB::raw('count(*) as total'))
            ->groupBy('type')
            ->pluck('total', 'type');

        // === 4. Kembalikan semua data dalam satu respons JSON ===
        return response()->json([
            'employees' => [
                'status' => $employeeCounts,
            ],
            'checkclock' => [
                'status' => $checkclockCounts,
            ],
            'letters' => [
                'type' => $letterCounts,
            ],
        ]);
    }
}
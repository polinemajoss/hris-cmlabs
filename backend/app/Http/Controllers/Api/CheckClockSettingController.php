<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use App\Models\CheckClockSetting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CheckClockSettingController extends Controller
{
    public function index()
    {
        // Menampilkan semua jadwal kerja yang ada beserta detail waktunya
        $settings = CheckClockSetting::with('times')->latest()->get();
        return response()->json($settings);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|in:WFO,WFA,Hybrid',
            'location_name' => 'nullable|string|max:255',
            'location_address' => 'nullable|string',
            'location_lat' => 'nullable|numeric',
            'location_long' => 'nullable|numeric',
            'radius' => 'nullable|integer',
            'times' => 'required|array|min:1', // Wajib ada array 'times'
            'times.*.day' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'times.*.clock_in' => 'required|date_format:H:i',
            'times.*.clock_out' => 'required|date_format:H:i|after:times.*.clock_in',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $setting = DB::transaction(function () use ($request) {
                // 1. Buat data utama di tabel check_clock_settings
                $newSetting = CheckClockSetting::create($request->except('times'));

                // 2. Loop dan buat data di tabel check_clock_setting_times
                foreach ($request->input('times') as $timeData) {
                    $newSetting->times()->create($timeData);
                }

                return $newSetting;
            });

            return response()->json([
                'message' => 'Pengaturan jadwal kerja berhasil disimpan!',
                'data' => $setting->load('times'),
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error storing check clock setting: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menyimpan pengaturan jadwal.'], 500);
        }
    }
}
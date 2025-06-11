<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SalaryController extends Controller
{
    public function index()
    {
        $salaries = Salary::with('employee.user')->latest()->paginate(10);
        return response()->json($salaries);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|string|exists:employees,id',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|string|max:255',
            'effective_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $salary = Salary::create($validator->validated());

        return response()->json([
            'message' => 'Data gaji berhasil ditambahkan!',
            'data' => $salary,
        ], 201);
    }
}
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Karyawan - {{ $employee->first_name }} {{ $employee->last_name }}</title>
    <style>
        @page {
            margin: 0px;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #333;
            margin: 0px;
        }
        .container {
            padding: 40px;
        }
        .header {
            text-align: left;
            margin-bottom: 25px;
            border-bottom: 2px solid #E5E7EB;
            padding-bottom: 15px;
        }
        .logo {
            width: 130px;
            margin-bottom: 10px;
        }
        h1 {
            font-size: 22px;
            margin: 0;
            color: #111827;
        }
        .content {
            margin-top: 20px;
        }
        .employee-photo {
            text-align: center;
            margin-bottom: 25px;
        }
        .employee-photo img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #F3F4F6;
        }
        h2 {
            font-size: 18px;
            color: #1E3A5F;
            border-bottom: 1px solid #D1D5DB;
            padding-bottom: 5px;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
        }
        .details-table td {
            padding: 10px 5px;
            border-bottom: 1px solid #E5E7EB;
        }
        .details-table tr:last-child td {
            border-bottom: none;
        }
        .details-table .label {
            font-weight: bold;
            width: 35%;
            color: #4B5563;
        }
        /* Watermark */
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(3);
            opacity: 0.08;
            font-size: 120px;
            font-weight: bold;
            color: #9CA3AF;
            z-index: -1000;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div class="watermark">
        <img src="{{ public_path('images/hris-logo.png') }}" alt="Logo" class="logo">
        <div style="font-size: 20px; text-align: center;">HRIS CMLABS</div>
    </div>

    <div class="container">
        <div class="header">
            <img src="{{ public_path('images/hris-logo.png') }}" alt="Logo" class="logo">
            <h1>Detail Data Karyawan</h1>
        </div>

        <div class="content">
            <div class="employee-photo">
                @if($employee->avatar)
                    <img src="{{ $employee->avatar }}" alt="Foto Karyawan">
                @else
                    <img src="https://ui-avatars.com/api/?name={{ urlencode($employee->first_name) }}+{{ urlencode($employee->last_name) }}&background=EBF4FF&color=1E3A5F&size=120" alt="Avatar">
                @endif
            </div>

            <h2>Informasi Pribadi</h2>
            <table class="details-table">
                <tr>
                    <td class="label">Nama Lengkap</td>
                    <td>: {{ $employee->first_name }} {{ $employee->last_name }}</td>
                </tr>
                <tr>
                    <td class="label">NIK</td>
                    <td>: {{ $employee->nik ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Jenis Kelamin</td>
                    <td>: {{ $employee->gender === 'M' ? 'Laki-laki' : 'Perempuan' }}</td>
                </tr>
                <tr>
                    <td class="label">Tempat, Tanggal Lahir</td>
                    <td>: {{ $employee->birth_place ?? '-' }}, {{ $employee->birth_date ? \Carbon\Carbon::parse($employee->birth_date)->format('d F Y') : '-' }}</td>
                </tr>
                 <tr>
                    <td class="label">Nomor Ponsel</td>
                    <td>: {{ $employee->mobile_number ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Pendidikan Terakhir</td>
                    <td>: {{ $employee->education ?? '-' }}</td>
                </tr>
            </table>

            <h2>Informasi Kepegawaian</h2>
            <table class="details-table">
                <tr>
                    <td class="label">Cabang</td>
                    <td>: {{ $employee->branch ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Jabatan</td>
                    <td>: {{ $employee->position ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Grade</td>
                    <td>: {{ $employee->grade ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Tipe Kontrak</td>
                    <td>: {{ $employee->contract_type ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Status</td>
                    <td>: {{ $employee->status ?? '-' }}</td>
                </tr>
            </table>
            
            <h2>Informasi Bank</h2>
            <table class="details-table">
                 <tr>
                    <td class="label">Nama Bank</td>
                    <td>: {{ $employee->bank ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Nomor Rekening</td>
                    <td>: {{ $employee->bank_account_number ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Atas Nama</td>
                    <td>: {{ $employee->bank_account_name ?? '-' }}</td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
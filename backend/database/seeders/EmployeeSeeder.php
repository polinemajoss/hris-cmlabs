<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    /**
     * Jalankan database seeder.
     *
     * @return void
     */
    public function run(): void
    {
        // Hapus data karyawan lama
        Employee::query()->delete();

        $employeesData = [
            [
                'email' => 'budi.santoso@cmlabs.co', 'first_name' => 'Budi', 'last_name' => 'Santoso', 'gender' => 'M', 'mobile_number' => '081234567890', 'nik' => '3273211234560001',
                'birth_place' => 'Jakarta', 'birth_date' => '1990-05-15', 'education' => 'S1 Teknik Informatika', 'position' => 'Software Engineer', 'grade' => 'A',
                'branch' => 'Kantor Pusat', 'contract_type' => 'Tetap', 'bank' => 'BCA', 'bank_account_number' => '1234567890', 'bank_account_name' => 'Budi Santoso',
                'status' => 'Aktif',
            ],
            [
                'email' => 'citra.lestari@cmlabs.co', 'first_name' => 'Citra', 'last_name' => 'Lestari', 'gender' => 'F', 'mobile_number' => '081234567891', 'nik' => '3273211234560002',
                'birth_place' => 'Bandung', 'birth_date' => '1992-08-22', 'education' => 'S1 Desain Komunikasi Visual', 'position' => 'UI/UX Designer', 'grade' => 'A',
                'branch' => 'Kantor Pusat', 'contract_type' => 'Tetap', 'bank' => 'Mandiri', 'bank_account_number' => '1122334455', 'bank_account_name' => 'Citra Lestari',
                'status' => 'Aktif',
            ],
            [
                'email' => 'doni.firmansyah@cmlabs.co', 'first_name' => 'Doni', 'last_name' => 'Firmansyah', 'gender' => 'M', 'mobile_number' => '081234567892', 'nik' => '3273211234560003',
                'birth_place' => 'Surabaya', 'birth_date' => '1995-01-30', 'education' => 'S1 Sistem Informasi', 'position' => 'Project Manager', 'grade' => 'B',
                'branch' => 'Cabang Jakarta', 'contract_type' => 'Kontrak', 'bank' => 'BNI', 'bank_account_number' => '6677889900', 'bank_account_name' => 'Doni Firmansyah',
                'status' => 'Aktif',
            ],
            ['email' => 'eka.putri@cmlabs.co', 'first_name' => 'Eka', 'last_name' => 'Putri', 'gender' => 'F', 'mobile_number' => '081234567893', 'nik' => '3273211234560004', 'birth_place' => 'Yogyakarta', 'birth_date' => '1993-11-11', 'education' => 'S1 Akuntansi', 'position' => 'Finance Staff', 'grade' => 'C', 'branch' => 'Kantor Pusat', 'contract_type' => 'Kontrak', 'bank' => 'BRI', 'bank_account_number' => '1212121212', 'bank_account_name' => 'Eka Putri', 'status' => 'Aktif'],
            ['email' => 'fajar.nugraha@cmlabs.co', 'first_name' => 'Fajar', 'last_name' => 'Nugraha', 'gender' => 'M', 'mobile_number' => '081234567894', 'nik' => '3273211234560005', 'birth_place' => 'Medan', 'birth_date' => '1991-03-25', 'education' => 'S1 Teknik Elektro', 'position' => 'IT Support', 'grade' => 'B', 'branch' => 'Cabang Bandung', 'contract_type' => 'Tetap', 'bank' => 'BCA', 'bank_account_number' => '1313131313', 'bank_account_name' => 'Fajar Nugraha', 'status' => 'Aktif'],
            ['email' => 'gita.wulandari@cmlabs.co', 'first_name' => 'Gita', 'last_name' => 'Wulandari', 'gender' => 'F', 'mobile_number' => '081234567895', 'nik' => '3273211234560006', 'birth_place' => 'Semarang', 'birth_date' => '1994-07-07', 'education' => 'D3 Pemasaran', 'position' => 'Marketing Associate', 'grade' => 'C', 'branch' => 'Cabang Jakarta', 'contract_type' => 'Lepas', 'bank' => 'CIMB Niaga', 'bank_account_number' => '1414141414', 'bank_account_name' => 'Gita Wulandari', 'status' => 'Tidak Aktif'],
            ['email' => 'hendra.setiawan@cmlabs.co', 'first_name' => 'Hendra', 'last_name' => 'Setiawan', 'gender' => 'M', 'mobile_number' => '081234567896', 'nik' => '3273211234560007', 'birth_place' => 'Makassar', 'birth_date' => '1989-12-01', 'education' => 'S2 Manajemen Bisnis', 'position' => 'Head of Marketing', 'grade' => 'A', 'branch' => 'Kantor Pusat', 'contract_type' => 'Tetap', 'bank' => 'Mandiri', 'bank_account_number' => '1515151515', 'bank_account_name' => 'Hendra Setiawan', 'status' => 'Aktif'],
            ['email' => 'indah.permata@cmlabs.co', 'first_name' => 'Indah', 'last_name' => 'Permata', 'gender' => 'F', 'mobile_number' => '081234567897', 'nik' => '3273211234560008', 'birth_place' => 'Denpasar', 'birth_date' => '1996-02-14', 'education' => 'S1 Psikologi', 'position' => 'HR Generalist', 'grade' => 'B', 'branch' => 'Kantor Pusat', 'contract_type' => 'Kontrak', 'bank' => 'BNI', 'bank_account_number' => '1616161616', 'bank_account_name' => 'Indah Permata', 'status' => 'Aktif'],
            ['email' => 'joko.prasetyo@cmlabs.co', 'first_name' => 'Joko', 'last_name' => 'Prasetyo', 'gender' => 'M', 'mobile_number' => '081234567898', 'nik' => '3273211234560009', 'birth_place' => 'Solo', 'birth_date' => '1990-09-09', 'education' => 'S1 Ilmu Komputer', 'position' => 'Backend Developer', 'grade' => 'A', 'branch' => 'Kantor Pusat', 'contract_type' => 'Tetap', 'bank' => 'BCA', 'bank_account_number' => '1717171717', 'bank_account_name' => 'Joko Prasetyo', 'status' => 'Aktif'],
            ['email' => 'kartika.dewi@cmlabs.co', 'first_name' => 'Kartika', 'last_name' => 'Dewi', 'gender' => 'F', 'mobile_number' => '081234567899', 'nik' => '3273211234560010', 'birth_place' => 'Palembang', 'birth_date' => '1997-04-18', 'education' => 'S1 Hubungan Internasional', 'position' => 'Content Writer', 'grade' => 'C', 'branch' => 'Cabang Jakarta', 'contract_type' => 'Kontrak', 'bank' => 'Mandiri', 'bank_account_number' => '1818181818', 'bank_account_name' => 'Kartika Dewi', 'status' => 'Aktif'],
            ['email' => 'lukman.hakim@cmlabs.co', 'first_name' => 'Lukman', 'last_name' => 'Hakim', 'gender' => 'M', 'mobile_number' => '081234567900', 'nik' => '3273211234560011', 'birth_place' => 'Padang', 'birth_date' => '1988-06-20', 'education' => 'S1 Teknik Sipil', 'position' => 'QA Engineer', 'grade' => 'B', 'branch' => 'Kantor Pusat', 'contract_type' => 'Tetap', 'bank' => 'BRI', 'bank_account_number' => '1919191919', 'bank_account_name' => 'Lukman Hakim', 'status' => 'Aktif'],
            ['email' => 'maya.sari@cmlabs.co', 'first_name' => 'Maya', 'last_name' => 'Sari', 'gender' => 'F', 'mobile_number' => '081234567901', 'nik' => '3273211234560012', 'birth_place' => 'Bekasi', 'birth_date' => '1998-10-02', 'education' => 'SMK Multimedia', 'position' => 'Junior Graphic Designer', 'grade' => 'D', 'branch' => 'Cabang Bandung', 'contract_type' => 'Lepas', 'bank' => 'BCA', 'bank_account_number' => '2020202020', 'bank_account_name' => 'Maya Sari', 'status' => 'Aktif'],
            ['email' => 'nanda.pratama@cmlabs.co', 'first_name' => 'Nanda', 'last_name' => 'Pratama', 'gender' => 'M', 'mobile_number' => '081234567902', 'nik' => '3273211234560013', 'birth_place' => 'Tangerang', 'birth_date' => '1992-07-15', 'education' => 'S1 Manajemen', 'position' => 'Business Development', 'grade' => 'B', 'branch' => 'Kantor Pusat', 'contract_type' => 'Kontrak', 'bank' => 'CIMB Niaga', 'bank_account_number' => '2121212121', 'bank_account_name' => 'Nanda Pratama', 'status' => 'Aktif'],
            ['email' => 'olivia.ratna@cmlabs.co', 'first_name' => 'Olivia', 'last_name' => 'Ratna', 'gender' => 'F', 'mobile_number' => '081234567903', 'nik' => '3273211234560014', 'birth_place' => 'Bogor', 'birth_date' => '1994-09-30', 'education' => 'S1 Sastra Inggris', 'position' => 'SEO Specialist', 'grade' => 'B', 'branch' => 'Kantor Pusat', 'contract_type' => 'Tetap', 'bank' => 'BNI', 'bank_account_number' => '2222222222', 'bank_account_name' => 'Olivia Ratna', 'status' => 'Aktif'],
            ['email' => 'pandu.wijaya@cmlabs.co', 'first_name' => 'Pandu', 'last_name' => 'Wijaya', 'gender' => 'M', 'mobile_number' => '081234567904', 'nik' => '3273211234560015', 'birth_place' => 'Depok', 'birth_date' => '1993-01-01', 'education' => 'S1 Teknik Industri', 'position' => 'Data Analyst', 'grade' => 'A', 'branch' => 'Kantor Pusat', 'contract_type' => 'Tetap', 'bank' => 'Mandiri', 'bank_account_number' => '2323232323', 'bank_account_name' => 'Pandu Wijaya', 'status' => 'Aktif'],
            ['email' => 'rina.amelia@cmlabs.co', 'first_name' => 'Rina', 'last_name' => 'Amelia', 'gender' => 'F', 'mobile_number' => '081234567905', 'nik' => '3273211234560016', 'birth_place' => 'Malang', 'birth_date' => '1995-08-17', 'education' => 'D3 Administrasi Perkantoran', 'position' => 'Office Administrator', 'grade' => 'C', 'branch' => 'Kantor Pusat', 'contract_type' => 'Kontrak', 'bank' => 'BRI', 'bank_account_number' => '2424242424', 'bank_account_name' => 'Rina Amelia', 'status' => 'Aktif'],
            ['email' => 'samsul.arifin@cmlabs.co', 'first_name' => 'Samsul', 'last_name' => 'Arifin', 'gender' => 'M', 'mobile_number' => '081234567906', 'nik' => '3273211234560017', 'birth_place' => 'Pekanbaru', 'birth_date' => '1987-11-23', 'education' => 'S1 Hukum', 'position' => 'Legal Staff', 'grade' => 'B', 'branch' => 'Kantor Pusat', 'contract_type' => 'Tetap', 'bank' => 'BCA', 'bank_account_number' => '2525252525', 'bank_account_name' => 'Samsul Arifin', 'status' => 'Aktif'],
            ['email' => 'tika.hartono@cmlabs.co', 'first_name' => 'Tika', 'last_name' => 'Hartono', 'gender' => 'F', 'mobile_number' => '081234567907', 'nik' => '3273211234560018', 'birth_place' => 'Manado', 'birth_date' => '1996-05-05', 'education' => 'S1 Komunikasi', 'position' => 'Social Media Manager', 'grade' => 'B', 'branch' => 'Cabang Jakarta', 'contract_type' => 'Kontrak', 'bank' => 'Mandiri', 'bank_account_number' => '2626262626', 'bank_account_name' => 'Tika Hartono', 'status' => 'Tidak Aktif'],
            ['email' => 'umar.said@cmlabs.co', 'first_name' => 'Umar', 'last_name' => 'Said', 'gender' => 'M', 'mobile_number' => '081234567908', 'nik' => '3273211234560019', 'birth_place' => 'Banjarmasin', 'birth_date' => '1991-02-28', 'education' => 'S1 Teknik Mesin', 'position' => 'DevOps Engineer', 'grade' => 'A', 'branch' => 'Kantor Pusat', 'contract_type' => 'Tetap', 'bank' => 'BNI', 'bank_account_number' => '2727272727', 'bank_account_name' => 'Umar Said', 'status' => 'Aktif'],
            ['email' => 'vina.yuliana@cmlabs.co', 'first_name' => 'Vina', 'last_name' => 'Yuliana', 'gender' => 'F', 'mobile_number' => '081234567909', 'nik' => '3273211234560020', 'birth_place' => 'Jayapura', 'birth_date' => '1999-07-21', 'education' => 'SMK Akuntansi', 'position' => 'Junior Accountant', 'grade' => 'D', 'branch' => 'Kantor Pusat', 'contract_type' => 'Lepas', 'bank' => 'Mandiri', 'bank_account_number' => '2828282828', 'bank_account_name' => 'Vina Yuliana', 'status' => 'Aktif'],
        ];

        foreach ($employeesData as $data) {
            // Cari pengguna berdasarkan email
            $user = User::where('email', $data['email'])->first();

            // Jika pengguna ditemukan, buat data karyawan
            if ($user) {
                Employee::create([
                    'user_id' => $user->id,
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'gender' => $data['gender'],
                    'mobile_number' => $data['mobile_number'],
                    'nik' => $data['nik'],
                    'birth_place' => $data['birth_place'],
                    'birth_date' => $data['birth_date'],
                    'education' => $data['education'],
                    'position' => $data['position'],
                    'grade' => $data['grade'],
                    'branch' => $data['branch'],
                    'contract_type' => $data['contract_type'],
                    'bank' => $data['bank'],
                    'bank_account_number' => $data['bank_account_number'],
                    'bank_account_name' => $data['bank_account_name'],
                    'status' => $data['status'],
                    'sp_type' => 'Tidak Ada',
                    'avatar' => 'https://i.pravatar.cc/150?u=' . $user->email,
                ]);
            }
        }
    }
}
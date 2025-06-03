// hris-cmlabs/frontend/src/app/employee/page.tsx
"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios"; // Impor instance yang dikonfigurasi
import axios from "axios"; // <-- Tambahkan impor axios default untuk isAxiosError

// Definisikan interface untuk data karyawan
interface Employee {
  id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  gender: "M" | "F";
  mobile_number?: string;
  nik?: string;
  position: string;
  branch: string;
  status: "Aktif" | "Tidak Aktif";
  // Sesuaikan dengan kolom lain di tabel employees Anda
}

export default function EmployeeDatabase() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get("/employees"); // Gunakan axiosInstance untuk request
      console.log("API Response for /employees:", res.data);

      let fetchedData: Employee[] = [];
      if (res.data && Array.isArray(res.data.data)) {
        fetchedData = res.data.data;
      } else if (Array.isArray(res.data)) {
        fetchedData = res.data;
      } else {
        console.warn("Unexpected API response format for /employees:", res.data);
        setError("Format data karyawan dari server tidak sesuai.");
        fetchedData = [];
      }
      setEmployees(fetchedData);
    } catch (err: any) {
      console.error("Fetch error:", err);
      // PERBAIKAN DI SINI: Gunakan 'axios.isAxiosError' (dari impor axios default)
      if (axios.isAxiosError(err) && err.response) { // <-- UBAH KE 'axios.isAxiosError'
        setError(`Gagal memuat data karyawan: ${err.response.status} - ${err.response.data?.message || JSON.stringify(err.response.data)}`);
      } else if (axios.isAxiosError(err) && err.request) { // <-- UBAH KE 'axios.isAxiosError'
        setError("Gagal memuat data karyawan: Tidak ada respons dari server.");
      } else {
        setError(`Gagal memuat data karyawan: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authEnabledFrontend = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';

    if (!authEnabledFrontend) {
        fetchEmployees();
    } else {
        fetchEmployees();
    }
  }, []);

  if (loading) return <div className="p-4">Loading data karyawan...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Daftar Karyawan</h1>
      {employees.length === 0 ? (
        <p>Tidak ada data karyawan yang ditemukan.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nama</th>
              <th className="py-2 px-4 border-b">Jabatan</th>
              <th className="py-2 px-4 border-b">Cabang</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{emp.first_name} {emp.last_name}</td>
                <td className="py-2 px-4 border-b">{emp.position}</td>
                <td className="py-2 px-4 border-b">{emp.branch}</td>
                <td className="py-2 px-4 border-b">{emp.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
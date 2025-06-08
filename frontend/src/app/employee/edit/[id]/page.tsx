"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import EmployeeForm, { EmployeeFormData } from "../../../../components/employee/EmployeeForm";
import axios from "axios";
// Definisikan interface yang sesuai dengan backend Laravel
interface EmployeeData {
  id: string;
  user_id?: string; // Optional karena bisa jadi tidak perlu diedit
  first_name: string;
  last_name: string;
  gender: "M" | "F";
  mobile_number?: string;
  nik?: string;
  birth_place?: string;
  birth_date?: string | null;
  education?: string;
  position?: string;
  grade?: string;
  branch?: string;
  contract_type?: "Tetap" | "Kontrak" | "Lepas";
  bank?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  sp_type?: string;
  status?: "Aktif" | "Tidak Aktif";
  avatar?: string;
  created_at?: string;
  updated_at?: string;
  user?: Record<string, unknown>;
}

export default function EditEmployeePage() {
  const router = useRouter();
  const { id } = useParams(); // ID dari URL (misalnya: /employee/edit/[id])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);

  // Ambil data awal karyawan saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("ID karyawan tidak ditemukan.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axiosInstance.get(`/employees/${id}`);

        if (response.status === 200 && response.data) {
          setEmployeeData(response.data);
        } else {
          setError("Data karyawan tidak ditemukan.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Gagal mengambil data karyawan:", err.message);
        } else {
          console.error("Gagal mengambil data karyawan:", err);
        }
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          (err as { response?: { status?: number } }).response?.status === 404
        ) {
          setError("Karyawan tidak ditemukan.");
        } else {
          setError(`Gagal memuat data karyawan: ${(err as Error).message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Fungsi untuk menangani pengiriman formulir
  const handleUpdate = async (formData: EmployeeFormData) => {
    if (!id || !employeeData) {
      // Tambahkan pengecekan employeeData di sini juga
      alert("ID karyawan atau data karyawan tidak tersedia.");
      return;
    }

    let formattedBirthDate = null;
    if (formData.birth_date) {
      const date = new Date(formData.birth_date);
      if (!isNaN(date.getTime())) {
        formattedBirthDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
      } else {
        console.warn("Tanggal lahir tidak valid saat update, akan dikirim sebagai null/undefined.");
      }
    }

    // Gabungkan id dari URL dengan data form untuk payload backend
    const payload: Partial<EmployeeData> = {
      ...formData,
      user_id: employeeData.user_id,
      gender: formData.gender === "" ? undefined : formData.gender,
      birth_date: formattedBirthDate || undefined,
      contract_type: formData.contract_type === "" ? undefined : formData.contract_type,
      status: formData.status === "" ? undefined : formData.status,
    };

    try {
      const response = await axiosInstance.put(`/employees/${id}`, payload);

      if (response.status === 200) {
        console.log("Karyawan berhasil diupdate:", response.data);
        router.push("/employee");
      }
    } catch (err) {
      // Siapkan pesan default dari error standar
      let detailMessage = (err instanceof Error) ? err.message : 'Terjadi kesalahan tidak terduga.';

      // Periksa apakah ini error dari axios dan ambil pesan dari response API
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        detailMessage = err.response.data.message;
      }

      alert(`Gagal memperbarui data karyawan. Silakan coba lagi.\nDetail: ${detailMessage}`);
    }
  };

  // Tampilkan loading atau error state
  if (loading) return <p>Loading employee data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!employeeData) return <p>Data karyawan tidak tersedia.</p>;

  // Render form edit dengan data awal
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <EmployeeForm
        initialData={{
          ...employeeData,
          mobile_number: employeeData.mobile_number ?? "",
          nik: employeeData.nik ?? "",
          birth_place: employeeData.birth_place ?? "",
          birth_date: employeeData.birth_date ?? "",
          education: employeeData.education ?? "",
          position: employeeData.position ?? "",
          grade: employeeData.grade ?? "",
          branch: employeeData.branch ?? "",
          contract_type: employeeData.contract_type ?? "Tetap",
          bank: employeeData.bank ?? "",
          bank_account_number: employeeData.bank_account_number ?? "",
          bank_account_name: employeeData.bank_account_name ?? "",
          sp_type: employeeData.sp_type ?? "",
          status: employeeData.status ?? "Aktif",
          avatar: employeeData.avatar ?? "",
          email:
            // Try to get email from employeeData.user if available, otherwise fallback to empty string
            (employeeData.user && typeof employeeData.user === "object" && "email" in employeeData.user
              ? (employeeData.user as { email?: string }).email ?? ""
              : ""),
        }}
        onSubmit={handleUpdate}
        onCancel={() => router.push("/employee")}
      />
    </div>
  );
}

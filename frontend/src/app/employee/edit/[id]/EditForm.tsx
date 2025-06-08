// File: frontend/src/app/employee/edit/[id]/EditForm.tsx

"use client"; // Penanda ini WAJIB ada di baris paling atas

import { useEffect, useState } from "react";
import axiosInstance from "../../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import EmployeeForm, { EmployeeFormData } from "../../../../components/employee/EmployeeForm";
import axios from "axios";

// Definisikan interface yang sesuai dengan backend Laravel
interface EmployeeData {
  id: string;
  user_id?: string;
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

export default function EditForm({ initialData }: { initialData: EmployeeData }) { // Pastikan nama fungsinya EditForm
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);

  const handleUpdate = async (formData: EmployeeFormData) => {
    if (!initialData.id) {
      alert("ID karyawan tidak tersedia.");
      return;
    }

    if (!id || !employeeData) {
      alert("ID karyawan atau data karyawan tidak tersedia.");
      return;
    }

    let formattedBirthDate = null;
    if (formData.birth_date) {
      const date = new Date(formData.birth_date);
      if (!isNaN(date.getTime())) {
        formattedBirthDate = date.toISOString().split("T")[0];
      }
    }

    const payload: Partial<EmployeeFormData> = {
        ...formData,
        birth_date: formattedBirthDate,
    };

    const response = await axiosInstance.put(`/employees/${initialData.id}`, payload);

    try {
      const response = await axiosInstance.put(`/employees/${id}`, payload);
      if (response.status === 200) {
        console.log("Karyawan berhasil diupdate:", response.data);
        router.push("/employee");
      }
    } catch (err) {
      let detailMessage = (err instanceof Error) ? err.message : 'Terjadi kesalahan tidak terduga.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        detailMessage = err.response.data.message;
      }
      alert(`Gagal memperbarui data karyawan. Silakan coba lagi.\nDetail: ${detailMessage}`);
    }
  };

  if (loading) return <p>Loading employee data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!employeeData) return <p>Data karyawan tidak tersedia.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <EmployeeForm
        initialData={{
          ...initialData,
          // Tambahkan email jika ada di initialData.user
          email:
            typeof initialData.user === "object" &&
            initialData.user !== null &&
            "email" in initialData.user &&
            typeof initialData.user.email === "string"
              ? initialData.user.email
              : "",
          mobile_number: initialData.mobile_number ?? "",
          nik: initialData.nik ?? "",
          birth_place: initialData.birth_place ?? "",
          birth_date: initialData.birth_date ?? "",
          education: initialData.education ?? "",
          position: initialData.position ?? "",
          grade: initialData.grade ?? "",
          branch: initialData.branch ?? "",
          contract_type: initialData.contract_type ?? "",
          bank: initialData.bank ?? "",
          bank_account_number: initialData.bank_account_number ?? "",
          bank_account_name: initialData.bank_account_name ?? "",
          sp_type: initialData.sp_type ?? "",
          status: initialData.status ?? "",
          avatar: initialData.avatar ?? "",
        }}
        onSubmit={handleUpdate}
        onCancel={() => router.push("/employee")}
      />
    </div>
  );
}
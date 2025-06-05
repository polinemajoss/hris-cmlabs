"use client";

import axios from "axios";
import axiosInstance from "../../../lib/axios";
import { useRouter } from "next/navigation";
import AddEmployeeForm from "../../../components/ui/AddEmployeeForm";

// Definisikan interface yang sesuai dengan backend Laravel
interface EmployeePayload {
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
}

export default function CreateEmployeePage() {
  const router = useRouter();

  // Generate UUID untuk user_id secara otomatis
  const generateUserId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleSubmit = async (formData: any) => {
    if (!formData.first_name || !formData.last_name) {
      alert("Nama depan dan belakang harus diisi.");
      return;
    }
    const normalizedGender = formData.gender === "Laki-Laki" ? "M" : "F";
    const formattedBirthDate = new Date(formData.birth_date).toISOString().split('T')[0];

    try {
      // Normalisasi gender menjadi "M" atau "F"
      const payload: EmployeePayload = {
        ...formData,
        gender: normalizedGender,
        birth_date: formattedBirthDate
      };

      console.log("Data yang akan dikirim:", payload);

      const response = await axiosInstance.post("/employees", payload);
      console.log("Karyawan berhasil ditambahkan:", response.data);
      router.push("/employee");
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const validationErrors = error.response.data.errors;

        // Tambahkan pengecekan sebelum menggunakan Object.values
        if (validationErrors && typeof validationErrors === 'object') {
          const errorMessages = Object.values(validationErrors)
            .flat()
            .join('\n');
          alert(`Validasi gagal:\n${errorMessages}`);
        } else {
          alert("Validasi gagal: Format error tidak dikenali.");
        }
      } else {
        console.error("Error creating employee:", error);
        alert(`Gagal membuat karyawan: ${error.message}`);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Karyawan Baru</h1>
      {/* Pastikan `onSubmit` dan `onCancel` sesuai */}
      <AddEmployeeForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/employee")}
      />
    </div>
  );
}
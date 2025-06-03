"use client";

import axios from "axios"; // <-- Ini akan tetap ada untuk `axios.isAxiosError`
import axiosInstance from "../../../lib/axios"; // <-- TAMBAHKAN INI: Impor instance yang dikonfigurasi
import { useRouter } from "next/navigation";
// Hapus import useAuth karena tidak ada backend
// import { useAuth } from "../../../lib/authContext";

// Import AddEmployeeForm (pastikan path-nya benar)
import AddEmployeeForm from "../../../components/ui/AddEmployeeForm"; 

// Definisikan interface yang sesuai dengan backend Laravel
interface EmployeePayload {
    user_id?: string; // Jadikan opsional jika tidak selalu ada dari frontend
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
  // Hapus penggunaan useAuth dan user
  // const { user } = useAuth();
  const router = useRouter();

  // Import the EmployeeFormData type from AddEmployeeForm if not already imported
  // import type { EmployeeFormData } from "../../../components/ui/AddEmployeeForm";

  const handleSubmit = async (formData: any) => {
    // Ensure gender is either "M" or "F" before sending to backend
    const payload: EmployeePayload = {
      ...formData,
      gender: formData.gender === "M" || formData.gender === "F" ? formData.gender : undefined,
    };
    try {
      const response = await axiosInstance.post("/employees", payload);
      console.log("Employee created successfully:", response.data);
      router.push("/employee");
    } catch (error: any) {
      console.error("Error creating employee:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        alert(`Gagal membuat karyawan: ${error.response.status} - ${error.response.data?.message || JSON.stringify(error.response.data?.errors || error.response.data)}`);
      } else if (axios.isAxiosError(error) && error.request) {
        alert("Gagal membuat karyawan: Tidak ada respons dari server.");
      } else {
        alert(`Gagal membuat karyawan: ${error.message}`);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Karyawan Baru</h1>
      {/* Pastikan `onSubmit` dan `onCancel` memiliki tipe yang sesuai dengan AddEmployeeForm */}
      <AddEmployeeForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/employee")}
      />
    </div>
  );
}
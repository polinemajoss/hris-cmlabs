"use client";

import { useState } from "react";
import axiosInstance from "../../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import EmployeeForm, { EmployeeFormData } from "../../../../components/employee/EmployeeForm";
import axios from "axios";

export default function EditForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const { id } = useParams();

  const handleUpdate = async (formData: EmployeeFormData) => {
    if (!id) {
      alert("ID karyawan tidak tersedia.");
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

    try {
      const response = await axiosInstance.put(`/employees/${id}`, payload);
      if (response.status === 200) {
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

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <EmployeeForm
        initialData={{
          ...initialData,
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
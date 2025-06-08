"use client";

import axiosInstance from "../../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import EmployeeForm, { EmployeeFormData } from "../../../../components/employee/EmployeeForm";
import axios from "axios";

type EditFormProps = {
    initialData: Record<string, unknown>;
};

export default function EditForm({ initialData }: EditFormProps) {
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
                    id: typeof initialData.id === "string"
                        ? initialData.id
                        : typeof initialData.id === "number"
                        ? initialData.id.toString()
                        : "",
                    first_name: typeof initialData.first_name === "string" ? initialData.first_name : "",
                    last_name: typeof initialData.last_name === "string" ? initialData.last_name : "",
                    gender: typeof initialData.gender === "string" && ["", "M", "F"].includes(initialData.gender)
                        ? (initialData.gender as "" | "M" | "F")
                        : "",
                    email:
                        typeof initialData.user === "object" &&
                        initialData.user !== null &&
                        "email" in initialData.user &&
                        typeof (initialData.user as Record<string, unknown>).email === "string"
                            ? (initialData.user as { email: string }).email
                            : "",
                    mobile_number: typeof initialData.mobile_number === "string" ? initialData.mobile_number : "",
                    nik: typeof initialData.nik === "string" ? initialData.nik : "",
                    birth_place: typeof initialData.birth_place === "string" ? initialData.birth_place : "",
                    birth_date: typeof initialData.birth_date === "string" ? initialData.birth_date : "",
                    education: typeof initialData.education === "string" ? initialData.education : "",
                    position: typeof initialData.position === "string" ? initialData.position : "",
                    grade: typeof initialData.grade === "string" ? initialData.grade : "",
                    branch: typeof initialData.branch === "string" ? initialData.branch : "",
                    contract_type:
                        typeof initialData.contract_type === "string" &&
                        ["", "Tetap", "Kontrak", "Lepas"].includes(initialData.contract_type)
                            ? initialData.contract_type as "" | "Tetap" | "Kontrak" | "Lepas"
                            : "",
                    bank: typeof initialData.bank === "string" ? initialData.bank : "",
                    bank_account_number: typeof initialData.bank_account_number === "string" ? initialData.bank_account_number : "",
                    bank_account_name: typeof initialData.bank_account_name === "string" ? initialData.bank_account_name : "",
                    sp_type: typeof initialData.sp_type === "string" ? initialData.sp_type : "",
                    status:
                        typeof initialData.status === "string" && !Array.isArray(initialData.status) && typeof initialData.status !== "object" &&
                        ["", "Aktif", "Tidak Aktif"].includes(initialData.status)
                            ? (initialData.status as "" | "Aktif" | "Tidak Aktif")
                            : "",
                    avatar: typeof initialData.avatar === "string" ? initialData.avatar : "",
                }}
                onSubmit={handleUpdate}
                onCancel={() => router.push("/employee")}
            />
        </div>
    );
}
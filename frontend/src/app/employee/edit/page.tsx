// src/app/employee/edit/page.tsx
"use client";

import * as React from "react";
import { notFound, useRouter } from "next/navigation";
import axios from "axios";
import axiosInstance from "../../../lib/axios";
import EmployeeForm, { EmployeeFormData } from "../../../components/employee/EmployeeForm";
import { toast } from "sonner";

interface PageProps {
    params: Record<string, never>;
    searchParams?: {
        id?: string;
    };
}

// Perbaiki EmployeeApiResponse agar 'id' bisa jadi string atau number, sesuai respons API
interface EmployeeApiResponse extends EmployeeFormData {
    id: string | number; // <--- UBAH DI SINI: id bisa string atau number dari API
    user?: {
        email: string;
    };
    created_at?: string;
    updated_at?: string;
}

export default function EditEmployeePage({ searchParams }: PageProps) {
    const router = useRouter();
    const employeeId = searchParams?.id;

    const [employeeData, setEmployeeData] = React.useState<EmployeeFormData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            if (!employeeId) {
                setLoading(false);
                return notFound();
            }

            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                const res = await axiosInstance.get<EmployeeApiResponse | EmployeeApiResponse[]>(`${apiUrl}/employees/${employeeId}`);

                if (res.status === 404) {
                    setEmployeeData(null);
                } else if (!res.data) {
                    throw new Error("Empty response data.");
                } else {
                    const apiResponseData = Array.isArray(res.data) ? res.data[0] : res.data;

                    const formattedData: EmployeeFormData = {
                        // Perbaikan di sini: Pastikan apiResponseData.id selalu diubah menjadi string
                        id: String(apiResponseData.id || ""), // Gunakan String() untuk konversi aman dari number/null/undefined ke string
                        first_name: apiResponseData.first_name || "",
                        last_name: apiResponseData.last_name || "",
                        gender: apiResponseData.gender || "",
                        email: apiResponseData.user && typeof apiResponseData.user === "object" && "email" in apiResponseData.user && typeof apiResponseData.user.email === "string" ? apiResponseData.user.email : "",
                        mobile_number: apiResponseData.mobile_number || "",
                        nik: apiResponseData.nik || "",
                        birth_place: apiResponseData.birth_place || "",
                        birth_date: apiResponseData.birth_date ? (new Date(apiResponseData.birth_date).toISOString().split("T")[0]) : null,
                        education: apiResponseData.education || "",
                        position: apiResponseData.position || "",
                        grade: apiResponseData.grade || "",
                        branch: apiResponseData.branch || "",
                        contract_type: apiResponseData.contract_type || "",
                        bank: apiResponseData.bank || "",
                        bank_account_number: apiResponseData.bank_account_number || "",
                        bank_account_name: apiResponseData.bank_account_name || "",
                        sp_type: apiResponseData.sp_type || "",
                        status: apiResponseData.status || "",
                        avatar: apiResponseData.avatar || "",
                    };
                    setEmployeeData(formattedData);
                }
            } catch (err: unknown) {
                console.error("Error fetching employee data (Client Component):", err);
                setError("Gagal memuat data karyawan.");
                toast.error("Gagal memuat data karyawan.", { description: (err instanceof Error ? err.message : String(err)) });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [employeeId]);

    const handleUpdate = async (formData: EmployeeFormData) => {
        if (!employeeId) {
            toast.error("ID karyawan tidak tersedia.");
            return;
        }

        let formattedBirthDate = null;
        if (formData.birth_date) {
            const date = new Date(formData.birth_date);
            if (!isNaN(date.getTime())) {
                formattedBirthDate = date.toISOString().split("T")[0];
            } else {
                toast.error("Tanggal lahir tidak valid.");
                return;
            }
        }

        const payload: Partial<EmployeeFormData> = {
            ...formData,
            birth_date: formattedBirthDate,
            gender: formData.gender === "" ? undefined : formData.gender,
            contract_type: formData.contract_type === "" ? undefined : formData.contract_type,
            status: formData.status === "" ? undefined : formData.status,
            email: formData.email,
        };

        try {
            const response = await axiosInstance.put(`/employees/${employeeId}`, payload);

            if (response.status === 200) {
                toast.success("Data karyawan berhasil diperbarui!");
                router.push("/employee");
            } else {
                toast.warning(`Update berhasil, namun respons API: ${response.status}`);
                router.push("/employee");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const validationErrors = error.response.data.errors;
                const errorMessage = error.response.data.message || 'Terjadi kesalahan saat update.';

                if (validationErrors && typeof validationErrors === "object") {
                    const errorMessages: string[] = [];
                    const fieldLabels: Record<string, string> = {
                        first_name: "Nama Depan", last_name: "Nama Belakang", gender: "Jenis Kelamin",
                        birth_date: "Tanggal Lahir", mobile_number: "Nomor Telepon", branch: "Cabang",
                        position: "Posisi/Jabatan", grade: "Grade", bank: "Bank",
                        bank_account_number: "Nomor Rekening", bank_account_name: "Nama Pemilik Rekening",
                        status: "Status Karyawan", email: "Email"
                    };
                    Object.entries(validationErrors).forEach(([field, messages]) => {
                        const label = fieldLabels[field] || field;
                        if (Array.isArray(messages)) messages.forEach((msg) => errorMessages.push(`- ${label}: ${msg}`));
                        else errorMessages.push(`- ${label}: ${messages}`);
                    });
                    toast.error(`Validasi gagal: ${errorMessage}`, { description: errorMessages.join("\n") });
                } else {
                    toast.error("Gagal memperbarui karyawan.", { description: errorMessage });
                }
            } else if (error instanceof Error) {
                toast.error("Gagal memperbarui karyawan.", { description: `Error: ${error.message}` });
            } else {
                toast.error("Gagal memperbarui karyawan.", { description: "Terjadi kesalahan yang tidak diketahui." });
            }
            console.error("Error updating employee:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500 text-lg">Memuat data karyawan...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-600">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Coba Lagi</button>
            </div>
        );
    }

    if (!employeeData) {
        return notFound();
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Karyawan</h1>
            <EmployeeForm
                initialData={employeeData}
                onSubmit={handleUpdate}
                onCancel={() => router.push("/employee")}
                isEditMode={true}
            />
        </div>
    );
}
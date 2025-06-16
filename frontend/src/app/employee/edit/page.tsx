// src/app/employee/edit/page.tsx
// Ini adalah Client Component penuh, sehingga 'use client' ada di bagian paling atas.
"use client";

import * as React from "react"; // Impor React secara eksplisit
import { notFound, useRouter } from "next/navigation";
import axios from "axios"; // Untuk axios.isAxiosError
import axiosInstance from "../../../lib/axios"; // Sesuaikan path import untuk axiosInstance
import EmployeeForm, { EmployeeFormData } from "../../../components/employee/EmployeeForm"; // Sesuaikan path import untuk EmployeeForm
import { toast } from "sonner"; // Pastikan sonner terinstal dan <Toaster /> ada di root layout Anda

// Catatan: generateMetadata tidak akan bekerja secara dinamis di Client Component page.tsx ini.
// Jika metadata dinamis penting, page.tsx harus tetap Server Component.

// --- Tipe Props Halaman ---
// Next.js akan secara otomatis mengoper searchParams ke Client Component halaman
interface PageProps {
    params: Record<string, never>; // params tetap objek kosong karena tidak ada segmen dinamis di folder path ini
    searchParams?: {
        id?: string; // Query parameter 'id'
    };
}

// --- Interface untuk Data Karyawan dari API ---
// Pastikan ini sesuai persis dengan struktur respons dari backend Laravel Anda
interface EmployeeApiResponse extends EmployeeFormData {
    id: string; // ID biasanya selalu ada
    user?: {
        email: string;
    };
    created_at?: string;
    updated_at?: string;
}

// --- Komponen Halaman Edit Karyawan ---
export default function EditEmployeePage({ searchParams }: PageProps) {
    const router = useRouter();
    const employeeId = searchParams?.id; // Ambil ID dari searchParams yang diteruskan oleh Next.js

    const [employeeData, setEmployeeData] = React.useState<EmployeeFormData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // --- Fungsi untuk Mengambil Data Karyawan (Client-Side) ---
    React.useEffect(() => {
        const fetchData = async () => {
            if (!employeeId) {
                // Jika ID tidak ada, langsung ke notFound
                setLoading(false);
                return notFound(); // Menggunakan notFound() di Client Component
            }

            try {
                setLoading(true);
                // URL API dari variabel lingkungan
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                const res = await axiosInstance.get<EmployeeApiResponse>(`${apiUrl}/employees/${employeeId}`);

                if (res.status === 404) {
                    setEmployeeData(null); // Data tidak ditemukan
                } else if (!res.data) {
                    throw new Error("Empty response data.");
                } else {
                    const data = Array.isArray(res.data) ? res.data[0] : res.data;

                    // Format data agar sesuai dengan EmployeeFormData sebelum diset ke state
                    const formattedData: EmployeeFormData = {
                        id: typeof data.id === "string" ? data.id : (typeof data.id === "number" ? data.id.toString() : ""),
                        first_name: data.first_name || "",
                        last_name: data.last_name || "",
                        gender: data.gender || "",
                        email: data.user && typeof data.user === "object" && "email" in data.user && typeof data.user.email === "string" ? data.user.email : "",
                        mobile_number: data.mobile_number || "",
                        nik: data.nik || "",
                        birth_place: data.birth_place || "",
                        birth_date: data.birth_date ? (new Date(data.birth_date).toISOString().split("T")[0]) : null, // Format YYYY-MM-DD
                        education: data.education || "",
                        position: data.position || "",
                        grade: data.grade || "",
                        branch: data.branch || "",
                        contract_type: data.contract_type || "",
                        bank: data.bank || "",
                        bank_account_number: data.bank_account_number || "",
                        bank_account_name: data.bank_account_name || "",
                        sp_type: data.sp_type || "",
                        status: data.status || "",
                        avatar: data.avatar || "",
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
    }, [employeeId]); // Dependency array: jalankan ulang saat employeeId berubah

    // --- Fungsi handleUpdate untuk Submit Formulir ---
    const handleUpdate = async (formData: EmployeeFormData) => {
        if (!employeeId) {
            toast.error("ID karyawan tidak tersedia.");
            return;
        }

        // Format tanggal lahir
        let formattedBirthDate = null;
        if (formData.birth_date) {
            const date = new Date(formData.birth_date);
            if (!isNaN(date.getTime())) {
                formattedBirthDate = date.toISOString().split("T")[0]; // Format YYYY-MM-DD
            } else {
                toast.error("Tanggal lahir tidak valid.");
                return;
            }
        }

        // Payload yang akan dikirim ke API
        const payload: Partial<EmployeeFormData> = {
            ...formData,
            birth_date: formattedBirthDate,
            // Konversi string kosong menjadi undefined jika backend mengharapkannya tidak ada
            gender: formData.gender === "" ? undefined : formData.gender,
            contract_type: formData.contract_type === "" ? undefined : formData.contract_type,
            status: formData.status === "" ? undefined : formData.status,
            email: formData.email, // Pastikan ini dikirim jika perlu update email user
        };

        try {
            const response = await axiosInstance.put(`/employees/${employeeId}`, payload);

            if (response.status === 200) {
                toast.success("Data karyawan berhasil diperbarui!");
                router.push("/employee"); // Redirect ke halaman daftar karyawan setelah sukses
            } else {
                // Tangani status respons selain 200 (jika API Anda mengembalikan yang lain selain 200/error)
                toast.warning(`Update berhasil, namun respons API: ${response.status}`);
                router.push("/employee");
            }
        } catch (error: unknown) {
            // --- Penanganan Error ---
            if (axios.isAxiosError(error) && error.response) {
                const validationErrors = error.response.data.errors;
                const errorMessage = error.response.data.message || 'Terjadi kesalahan saat update.';

                if (validationErrors && typeof validationErrors === "object") {
                    // Jika ada error validasi dari Laravel
                    const errorMessages: string[] = [];
                    // Mapping label field untuk pesan yang lebih user-friendly
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
                    // Error non-validasi dari API
                    toast.error("Gagal memperbarui karyawan.", { description: errorMessage });
                }
            } else if (error instanceof Error) {
                // Error JavaScript atau jaringan
                toast.error("Gagal memperbarui karyawan.", { description: `Error: ${error.message}` });
            } else {
                // Error tidak diketahui
                toast.error("Gagal memperbarui karyawan.", { description: "Terjadi kesalahan yang tidak diketahui." });
            }
            console.error("Error updating employee:", error);
        }
    };

    // --- Penanganan Tampilan Loading, Error, Not Found ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500 text-lg">Memuat data karyawan...</div>
                {/* Anda bisa menambahkan spinner atau skeleton di sini */}
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
        // Jika data tidak ditemukan setelah loading selesai (misal 404 dari API),
        // ini akan memicu not-found.tsx jika ada, atau halaman 404 default Next.js
        return notFound();
    }

    // --- Merender Formulir Karyawan ---
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
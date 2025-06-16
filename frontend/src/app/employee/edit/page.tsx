// File: src/app/employee/edit/page.tsx

import EditForm from "../../../components/employee/EditForm"; // Sesuaikan path import jika EditForm pindah
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

type PageProps = {
    params: {}; // Rute ini tidak memiliki segmen dinamis di folder path-nya, jadi params adalah objek kosong
    searchParams?: { // Ini adalah query parameters dari URL (misal ?id=...)
        id?: string;
    };
};

async function getEmployeeData(id: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const res = await fetch(`${apiUrl}/employees/${id}`, { cache: 'no-store' });

        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Gagal mengambil data untuk karyawan ID ${id}`);

        const data = await res.json();
        return Array.isArray(data) ? data[0] : data;
    } catch (error) {
        console.error("Error di getEmployeeData:", error);
        return null;
    }
}

// ✅ generateMetadata menerima PageProps
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const id = searchParams?.id; // Ambil ID dari searchParams

    if (!id) {
        return { title: 'Karyawan Tidak Ditemukan (ID Hilang)' };
    }

    const employee = await getEmployeeData(id);

    if (!employee) {
        return { title: 'Karyawan Tidak Ditemukan' };
    }

    return {
        title: `Edit Karyawan: ${employee.first_name} ${employee.last_name}`,
    };
}

// ✅ export default async function EditEmployeePage menerima PageProps
export default async function EditEmployeePage({ searchParams }: PageProps) {
    const id = searchParams?.id; // Ambil ID dari searchParams

    if (!id) {
        // Jika ID tidak ada di query parameter, anggap tidak ditemukan atau redirect
        notFound(); // Atau redirect ke halaman error/daftar
    }

    const employeeData = await getEmployeeData(id);

    if (!employeeData) {
        notFound();
    }

    return <EditForm initialData={employeeData} />;
}
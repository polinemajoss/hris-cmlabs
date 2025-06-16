// File: src/app/employee/edit/page.tsx

import EditForm from "../../../components/employee/EditForm"; // Sesuaikan path import jika EditForm pindah
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

// ✅ Props sekarang akan menerima searchParams
type Props = {
    searchParams?: {
        id?: string;
    };
};

async function getEmployeeData(id: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const res = await fetch(`<span class="math-inline">\{apiUrl\}/employees/</span>{id}`, { cache: 'no-store' });

        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Gagal mengambil data untuk karyawan ID ${id}`);

        const data = await res.json();
        return Array.isArray(data) ? data[0] : data;
    } catch (error) {
        console.error("Error di getEmployeeData:", error);
        return null;
    }
}

// ✅ generateMetadata tidak lagi menerima 'params' tapi 'searchParams'
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
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

// ✅ export default async function EditEmployeePage({ searchParams }: Props) {
export default async function EditEmployeePage({ searchParams }: Props) {
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
// File: frontend/src/app/employee/edit/[id]/page.tsx
// TIDAK ADA "use client" DI SINI

import EditForm from "./EditForm";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

// -----------------------------------------------------------------------------
// HAPUS SELURUH FUNGSI 'generateStaticParams' DARI SINI
// -----------------------------------------------------------------------------

// FUNGSI UNTUK MENGAMBIL DATA TETAP DIPERLUKAN
async function getEmployeeData(id: string) {
  try {

    const res = await fetch(`<span class="math-inline">\{apiUrl\}/employees/</span>{id}`, { cache: 'no-store' });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Gagal mengambil data untuk karyawan ID ${id}`);
    return res.json();
  } catch (error) {
    console.error("Error di getEmployeeData:", error);
    return null;
  }
}

// FUNGSI METADATA TETAP BERGUNA
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const employee = await getEmployeeData(params.id);
  if (!employee) {
    return { title: 'Karyawan Tidak Ditemukan' };
  }
  return {
    title: `Edit Karyawan: ${employee.first_name} ${employee.last_name}`,
  };
}

// KOMPONEN UTAMA (SERVER COMPONENT)
export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  const employeeData = await getEmployeeData(params.id);

  if (!employeeData) {
    notFound();
  }

  return <EditForm initialData={employeeData} />;
}
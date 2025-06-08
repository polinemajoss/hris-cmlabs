// File: frontend/src/app/employee/edit/[id]/page.tsx
// TIDAK ADA "use client" DI SINI

import EditForm from "./EditForm";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

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

// -----------------------------------------------------------------------------
// HAPUS SELURUH FUNGSI 'generateStaticParams' DARI SINI
// -----------------------------------------------------------------------------

// FUNGSI UNTUK MENGAMBIL DATA TETAP DIPERLUKAN
async function getEmployeeData(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    // UBAH: Gunakan 'cache: "no-store"' untuk memastikan data selalu baru
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
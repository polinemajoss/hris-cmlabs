// File: frontend/src/app/employee/edit/[id]/page.tsx
import EditForm from "./EditForm";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

// Tipe untuk data karyawan, bisa diimpor dari file lain jika perlu
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
// FUNGSI 1: Memberitahu Next.js ID mana saja yang harus dibuat halamannya
// -----------------------------------------------------------------------------
export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const res = await fetch(`${apiUrl}/employees`);
    if (!res.ok) {
      throw new Error(`Gagal mengambil daftar karyawan: ${res.statusText}`);
    }
    const employees = await res.json();
    if (!Array.isArray(employees)) {
      console.error("API tidak mengembalikan array karyawan:", employees);
      return [];
    }
    return employees.map((employee: { id: number | string }) => ({
      id: String(employee.id),
    }));
  } catch (error) {
    console.error("Tidak bisa membuat halaman statis karyawan:", error);
    return [];
  }
}

// -----------------------------------------------------------------------------
// FUNGSI 2: Mengambil data untuk SATU halaman spesifik
// -----------------------------------------------------------------------------
async function getEmployeeData(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const res = await fetch(`${apiUrl}/employees/${id}`, {
      next: { revalidate: 60 }
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Gagal mengambil data untuk karyawan ID ${id}`);
    return res.json();
  } catch (error) {
    console.error("Error di getEmployeeData:", error);
    return null;
  }
}

// -----------------------------------------------------------------------------
// FUNGSI 3: Membuat judul halaman dinamis untuk SEO
// -----------------------------------------------------------------------------
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const employee = await getEmployeeData(params.id);
  if (!employee) {
    return { title: 'Karyawan Tidak Ditemukan' };
  }
  return {
    title: `Edit Karyawan: ${employee.first_name} ${employee.last_name}`,
  };
}

// =============================================================================
// INI BAGIAN YANG DIPERBAIKI
// =============================================================================

// Definisikan tipe yang lebih lengkap untuk props halaman
interface PageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// KOMPONEN UTAMA (SERVER COMPONENT)
export default async function EditEmployeePage({ params }: PageProps) {
  const employeeData = await getEmployeeData(params.id);

  if (!employeeData) {
    notFound();
  }

  return <EditForm initialData={employeeData} />;
}
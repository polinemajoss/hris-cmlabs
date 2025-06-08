// File: frontend/src/app/employee/edit/[id]/page.tsx
// TIDAK ADA "use client" DI SINI

import EditForm from "./EditForm";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

// Tipe untuk data karyawan, bisa diimpor dari file lain jika perlu
interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  // ... tambahkan properti lain yang Anda butuhkan
}

// -----------------------------------------------------------------------------
// FUNGSI 1: Memberitahu Next.js ID mana saja yang harus dibuat halamannya
// -----------------------------------------------------------------------------
export async function generateStaticParams() {
  try {
    // PENTING: Ganti URL ini dengan URL API produksi Anda di .env
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const res = await fetch(`${apiUrl}/employees`);
    
    if (!res.ok) {
      throw new Error(`Gagal mengambil daftar karyawan: ${res.statusText}`);
    }
    
    const employees = await res.json();
    
    // Pastikan employees adalah array sebelum di-map
    if (!Array.isArray(employees)) {
        console.error("API tidak mengembalikan array karyawan:", employees);
        return [];
    }

    // Return array objek dengan properti 'id' dalam bentuk string
    return employees.map((employee: { id: number | string }) => ({
      id: String(employee.id),
    }));

  } catch (error) {
    console.error("Tidak bisa membuat halaman statis karyawan:", error);
    // Kembalikan array kosong agar build tidak gagal total jika API error
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
        // Tambahkan revalidate untuk memastikan data bisa diperbarui di masa depan
        next: { revalidate: 60 } // Data akan coba divalidasi ulang setiap 60 detik
    });

    if (res.status === 404) {
      return null; // Karyawan tidak ditemukan
    }

    if (!res.ok) {
      throw new Error(`Gagal mengambil data untuk karyawan ID ${id}`);
    }

    return res.json();

  } catch (error) {
    console.error("Error di getEmployeeData:", error);
    return null; // Return null jika ada error lain
  }
}

// -----------------------------------------------------------------------------
// (Opsional) FUNGSI 3: Membuat judul halaman dinamis untuk SEO
// -----------------------------------------------------------------------------
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const employee = await getEmployeeData(params.id);
  if (!employee) {
    return { title: 'Karyawan Tidak Ditemukan' };
  }
  return {
    title: `Edit Karyawan: ${employee.first_name} ${employee.last_name}`,
  };
}

// -----------------------------------------------------------------------------
// DEFINISIKAN TIPE UNTUK PROPS DI SINI
// -----------------------------------------------------------------------------
type Props = {
  params: { id: string };
  // searchParams?: { [key: string]: string | string[] | undefined }; // Ini opsional untuk nanti jika butuh query URL
};


// -----------------------------------------------------------------------------
// KOMPONEN UTAMA (SERVER COMPONENT) - GUNAKAN TIPE PROPS YANG BARU
// -----------------------------------------------------------------------------
export default async function EditEmployeePage({ params }: Props) { // <-- UBAH MENJADI SEPERTI INI
  // Panggil fungsi untuk mengambil data karyawan spesifik berdasarkan ID dari URL
  const employeeData = await getEmployeeData(params.id);

  // Jika data tidak ditemukan, tampilkan halaman 404 Not Found dari Next.js
  if (!employeeData) {
    notFound();
  }

  // Oper data yang sudah lengkap ke Komponen Client
  return <EditForm initialData={employeeData} />;
}
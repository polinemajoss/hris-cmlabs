// File: src/app/employee/edit/[id]/page.tsx

import EditForm from "./EditForm";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const employee = await getEmployeeData(params.id);
  if (!employee) {
    return { title: 'Karyawan Tidak Ditemukan' };
  }
  return {
    title: `Edit Karyawan: ${employee.first_name} ${employee.last_name}`,
  };
}

export default async function EditEmployeePage({ params }: Props) {
  const employeeData = await getEmployeeData(params.id);

  if (!employeeData) {
    notFound();
  }

  return <EditForm initialData={employeeData} />;
}
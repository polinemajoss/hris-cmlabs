// frontend/src/app/employee/edit/[id]/page.tsx
// TIDAK ADA "use client" DI SINI

import EditForm from "./EditForm"; // Impor komponen client yang baru

// 1. Logika Server: generateStaticParams berjalan saat build
export async function generateStaticParams() {
  // Ini adalah Opsi B (Bypass) dari jawaban sebelumnya.
  // Jika Anda ingin membuat halaman untuk setiap karyawan, gunakan Opsi A.
  return [];
}

// 2. Komponen Server: Ini adalah "induk" yang akan me-render komponen client
export default function EditEmployeePage() {
  // Komponen server ini hanya merender komponen client
  return <EditForm />;
}
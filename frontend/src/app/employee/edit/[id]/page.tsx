// File: frontend/src/app/employee/edit/[id]/page.tsx
// TIDAK ADA "use client" DI SINI

import EditForm from "./EditForm"; // Impor komponen client yang akan kita buat

// Fungsi ini berjalan saat build di server
export async function generateStaticParams() {
  // Memberitahu Next.js untuk tidak membuat halaman statis apa pun saat build
  return [];
}

// Komponen Server ini hanya merender Komponen Client
export default function EditEmployeePage() {
  return <EditForm />;
}
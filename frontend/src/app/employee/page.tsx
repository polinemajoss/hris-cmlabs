// hris-cmlabs/frontend/src/app/employee/page.tsx
"use client";

import {
  SidebarProvider, // Tetap gunakan jika Anda ingin menguji sidebar provider
} from "../../components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Filter,
  Download,
  Upload,
  Plus,
} from "lucide-react";
import { SiteHeader } from "../../components/ui/site-header";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, } from "../../components/ui/alert-dialog";
import { AppSidebar } from "../../components/ui/app-sidebar";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";
import { SectionCardsEmployee } from "../../components/ui/section-card-employee";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import RealAddEmployeeForm from "../../components/ui/AddEmployeeForm"; // Ini digunakan jika Anda tetap pakai Sheet untuk Add/Edit

// Hapus import axios dan axiosInstance karena tidak ada backend
import axiosInstance from "../../lib/axios";
import axios from "axios";


// Definisikan interface untuk data karyawan (sesuaikan dengan kebutuhan tampilan Anda)
interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  gender: "M" | "F" | "Laki-Laki" | "Perempuan"; // Sesuaikan dengan format yang Anda inginkan
  mobile_number?: string;
  phone?: string; // Jika Anda punya field 'phone' untuk data mock
  nik?: string;
  birth_place?: string;
  birth_date?: string | null;
  education?: string;
  position: string;
  grade: string;
  branch: string;
  contract_type?: "Tetap" | "Kontrak" | "Lepas";
  bank?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  sp_type?: string;
  status: "Aktif" | "Tidak Aktif" | "active" | "inactive"; // Sesuaikan atau transformasikan
  avatar?: string;
  avatarUrl?: string; // Jika Anda punya field 'avatarUrl' untuk data mock
}


export default function EmployeeDatabase() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFilterActive, setIsFilterActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // State untuk sheet add/edit tidak lagi diperlukan jika langsung navigasi
  // const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  // const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fungsi untuk mengambil data karyawan (sekarang dari mock)
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/employees");
      console.log("API Response:", res.data);

      if (Array.isArray(res.data)) {
        const mappedEmployees = res.data.map(emp => ({
          id: emp.id,
          first_name: emp.first_name,
          last_name: emp.last_name,
          gender:
            emp.gender === "M" || emp.gender === "Laki-Laki"
              ? (emp.gender === "Laki-Laki" ? "Laki-Laki" : "M")
              : emp.gender === "F" || emp.gender === "Perempuan"
              ? (emp.gender === "Perempuan" ? "Perempuan" : "F")
              : "M", // fallback to "M" if unknown, or handle as needed
          mobile_number: emp.mobile_number || "",
          phone: emp.mobile_number || "", // Jika phone digunakan di UI
          nik: emp.nik,
          birth_place: emp.birth_place,
          birth_date: emp.birth_date,
          education: emp.education,
          position: emp.position,
          grade: emp.grade,
          branch: emp.branch,
          contract_type: emp.contract_type,
          bank: emp.bank,
          bank_account_number: emp.bank_account_number,
          bank_account_name: emp.bank_account_name,
          sp_type: emp.sp_type,
          status: emp.status, // Pastikan nilainya adalah "Aktif"/"Tidak Aktif"
          avatar: emp.avatar, // Bisa gunakan avatar dari user jika diperlukan
          avatarUrl: emp.avatar ? emp.avatar : undefined,
        }));
        setEmployees(mappedEmployees as Employee[]);
      } else {
        console.error("Invalid data format from API:", res.data);
        setError("Format data tidak valid dari API.");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(`Gagal memuat data karyawan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // generateAvatar: show image if url provided, else fallback to initials
  const generateAvatar = (name: string, imageUrl?: string) => {
    if (imageUrl) {
      return <img src={imageUrl} alt={name} className="w-8 h-8 rounded-full object-cover" />;
    }
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;

    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs relative overflow-hidden bg-[hsl(var(--avatar-bg))] text-[#1E3A5F]"
        title={name}
        style={{ ["--avatar-bg" as any]: `${h},70%,80%` }}
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="#000" style={{ opacity: 0.3 }}>
          <circle cx="12" cy="8" r="4" />
          <ellipse cx="12" cy="17" rx="7" ry="5" />
        </svg>
      </div>
    );
  };
  
  // Logika untuk search dan pagination
  const filteredEmployees = employees.filter((emp) =>
    `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // --- FUNGSI CRUD MOCK ---
  // Fungsi-fungsi ini sekarang hanya akan menampilkan console.log dan tidak melakukan panggilan API
  // Anda harus membuat halaman /employee/create dan /employee/edit/[id] secara terpisah
  // untuk mengimplementasikan fungsionalitas formulir dan penanganan data mock di sana.

  const handleOpenAddSheet = () => {
    // Navigasi ke halaman create
    router.push('/employee/create');
    console.log("Navigating to /employee/create (Add Employee action)");
  };

  const handleActualAddEmployee = async (formData: any) => {
    try {
      const res = await axiosInstance.post("/employees", formData);
      console.log("Karyawan berhasil ditambahkan:", res.data);
      router.push('/employee'); // Kembali ke halaman utama
    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        const errorMessage = Object.values(errors).flat().join('\n');
        alert(`Validasi gagal:\n${errorMessage}`);
      } else {
        console.error("Gagal menambahkan karyawan:", err.message);
        alert("Terjadi kesalahan saat menambahkan karyawan.");
      }
    }
  };

  const handleOpenEditSheet = (employee: Employee) => {
    setEditingEmployee(employee);
    // Navigasi ke halaman edit
    router.push(`/employee/edit/${employee.id}`);
    console.log("Navigating to /employee/edit/", employee.id);
  };
  
  const handleActualUpdateEmployee = async (formData: any) => {
    if (!editingEmployee) return;
    try {
      await axiosInstance.put(`/employees/${editingEmployee.id}`, formData);
      fetchEmployees(); // Reload data
      router.push('/employee'); // Kembali ke halaman utama
    } catch (err: any) {
      console.error("Error updating employee:", err);
      alert("Gagal mengubah karyawan");
    }
  };

  const confirmDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    console.log("Confirming delete for employee:", employee.first_name);
  };

  const executeDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    try {
      await axiosInstance.delete(`/employees/${employeeToDelete.id}`);
      fetchEmployees(); // Reload data
      setEmployeeToDelete(null);
    } catch (err: any) {
      console.error("Error deleting employee:", err);
      alert("Gagal menghapus karyawan");
    }
  };

  const handleDownloadPDF = async (employee: Employee) => {
    try {
      const res = await axiosInstance.get(`/employees/${employee.id}/download-pdf`, {
        responseType: 'blob', // Penting untuk download file
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${employee.first_name}-${employee.last_name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Gagal download PDF:", err);
      alert("Gagal mendownload PDF");
    }
  };


  if (loading) return <div className="p-4">Loading data karyawan...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
        <div className="flex-1 min-h-screen bg-gray-50">
          <SiteHeader />
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCardsEmployee />
            </div>
          </div>

          {/* Table Controls */}
          <section className="flex flex-col md:flex-row justify-between items-center gap-4 px-10 py-4">
            <h2 className="font-semibold text-lg whitespace-nowrap">Informasi Seluruh Karyawan</h2>
            <div className="flex gap-3 flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 border rounded text-xs h-8 focus:outline-none focus:border-[#1E3A5F] flex-1 min-w-0"
                style={{ minHeight: "2rem" }}
              />
              <button
                onClick={() => setIsFilterActive(!isFilterActive)}
                className="px-3 py-1 rounded border-none bg-transparent text-[#1E3A5F] flex items-center group hover:text-[#2563eb] text-xs h-8"
                style={{ minHeight: "2rem" }}
              >
                <Filter
                  size={12}
                  className="mr-1 transition-colors group-hover:text-[#2563eb]"
                /> Filter
              </button>
              {/* Tombol Export PDF dan Import */}
              <button
                className="px-3 py-1 border border-[#1E3A5F] text-[#1E3A5F] rounded hover:bg-[#1E3A5F] hover:text-white transition text-xs h-8 flex items-center"
                style={{ minHeight: "2rem" }}
                onClick={() => { /* Logika Export PDF Anda, bisa langsung panggil handleDownloadPDF tanpa employee spesifik jika export semua */ }}
              >
                <Upload size={12} className="mr-1" /> Export PDF
              </button>
              <label
                className="px-3 py-1 border border-[#1E3A5F] text-[#1E3A5F] rounded hover:bg-[#1E3A5F] hover:text-white transition text-xs h-8 flex items-center cursor-pointer"
                style={{ minHeight: "2rem" }}
              >
                <Download size={12} className="mr-1" /> Import
                <input type="file" className="hidden" onChange={async (e) => { /* Logika Import Anda */ }} />
              </label>

              {/* Tombol Tambah Data */}
              <button
                onClick={handleOpenAddSheet} // Menggunakan fungsi yang mengarahkan ke /employee/create
                className="px-3 py-1 bg-[#1E3A5F] text-white rounded transition flex items-center border border-transparent hover:bg-white hover:text-[#1E3A5F] hover:border-[#1E3A5F] text-xs h-8"
                style={{ minHeight: "2rem" }}
              >
                <Plus size={12} className="mr-1" /> Tambah Data
              </button>
            </div>
          </section>

          {/* Table */}
          <section className="px-6 pb-6 overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: 40, minWidth: 40, maxWidth: 40 }} className="text-center whitespace-nowrap">No</TableHead>
                  <TableHead className="w-[4%] text-center">Avatar</TableHead>
                  <TableHead className="w-[16%]">Nama</TableHead>
                  <TableHead className="w-[10%] text-center">Jenis Kelamin</TableHead>
                  <TableHead className="w-[10%]">Nomor Telepon</TableHead>
                  <TableHead className="w-[13%]">Cabang</TableHead>
                  <TableHead className="w-[13%]">Jabatan</TableHead>
                  <TableHead className="w-[13%]">Grade</TableHead>
                  <TableHead className="w-[8%] text-center">Status</TableHead>
                  <TableHead className="w-[12%] text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      Tidak ada data karyawan ditemukan.
                    </TableCell>
                  </TableRow>
                ) : currentEmployees.map((emp, i) => (
                  <TableRow key={emp.id} className="border-b-[6px] border-white">
                    <TableCell style={{ width: 40, minWidth: 40, maxWidth: 40 }} className="text-center whitespace-nowrap">
                      {indexOfFirstItem + i + 1}
                    </TableCell>
                    <TableCell className="text-center">
                      {generateAvatar(`${emp.first_name} ${emp.last_name}`, emp.avatar || emp.avatarUrl)}
                    </TableCell>
                    <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold justify-center`}
                        style={{
                          minWidth: 90, width: 90, display: "inline-flex",
                          background: emp.gender === "M" || emp.gender === "Laki-Laki" ? "#DBEAFE" : "#FCE7F3",
                          color: emp.gender === "M" || emp.gender === "Laki-Laki" ? "#1D4ED8" : "#BE185D",
                        }}
                      >
                        {/* Icon Gender bisa ditambahkan kembali jika diinginkan */}
                        {emp.gender === "M" ? "Laki-Laki" : emp.gender === "F" ? "Perempuan" : emp.gender}
                      </span>
                    </TableCell>
                    <TableCell>{emp.mobile_number || emp.phone}</TableCell>
                    <TableCell>{emp.branch}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>{emp.grade}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          emp.status === "Aktif" || emp.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {emp.status === "Aktif" || emp.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleDownloadPDF(emp)}
                        className="p-1 rounded bg-blue-100 hover:bg-blue-200 transition" title="Download">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="M9 15l3 3 3-3" /></svg>
                      </button>
                      <button
                        onClick={() => handleOpenEditSheet(emp)} // Menggunakan fungsi yang mengarahkan ke /employee/edit/[id]
                        className="p-1 rounded bg-yellow-100 hover:bg-yellow-200 transition" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() => confirmDeleteEmployee(emp)}
                            className="p-1 rounded-md bg-red-100 hover:bg-red-200 transition" title="Delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                          </button>
                        </AlertDialogTrigger>
                        {employeeToDelete && ( // Hanya render jika ada employeeToDelete
                          <AlertDialogContent className="shadow-[0_0_0_6px_rgba(239,68,68,0.10),0_4px_24px_0_rgba(239,68,68,0.18)]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Data karyawan <strong style={{ color: "red" }}>{employeeToDelete.first_name} {employeeToDelete.last_name}</strong> akan dihapus secara permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setEmployeeToDelete(null)}>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={executeDeleteEmployee}
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        )}
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Menampilkan</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => { setItemsPerPage(Number(value)); setCurrentPage(1); }}>
                  <SelectTrigger id="items-per-page" className="w-auto">
                    <SelectValue placeholder={itemsPerPage.toString()} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-700">
                Menampilkan {filteredEmployees.length > 0 ? indexOfFirstItem + 1 : 0} sampai {Math.min(indexOfLastItem, filteredEmployees.length)} dari {filteredEmployees.length} karyawan
              </div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3 py-1 border rounded-l text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Previous
                </button>
                {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                   <button
                     key={pageNumber}
                     onClick={() => setCurrentPage(pageNumber)}
                     className={`px-3 py-1 border ${currentPage === pageNumber ? 'bg-[#1E3A5F] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                   >
                     {pageNumber}
                   </button>
                 ))}
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-1 border rounded-r text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </section>
        </div>
      </div>
    </SidebarProvider>
  );
}
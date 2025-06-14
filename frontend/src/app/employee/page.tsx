// hris-cmlabs/frontend/src/app/employee/page.tsx

"use client";

import { SidebarProvider } from "../../components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Filter, Download, Upload, Plus } from "lucide-react";
import { SiteHeader } from "../../components/ui/site-header";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../../components/ui/alert-dialog";
import { AppSidebar } from "../../components/ui/app-sidebar";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";
import { SectionCardsEmployee } from "../../components/employee/section-card-employee";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../components/ui/sheet";

import { useEffect, useState } from "react";
import Image from "next/image";
import axiosInstance from "../../lib/axios";
import axios from "axios";

// Import EmployeeForm dan tipe datanya
import EmployeeForm, { EmployeeFormData } from "@/components/employee/EmployeeForm";

// --- 1. IMPORT KOMPONEN SKELETON ---
import { EmployeeTableSkeleton } from "@/components/skeletons/EmployeeTableSkeleton";

import { toast } from "sonner";

// Definisikan interface payload untuk create
interface EmployeePayload {
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
}

// Definisikan interface untuk data karyawan yang ditampilkan
interface Employee {
  id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  gender: "M" | "F";
  mobile_number?: string;
  phone?: string;
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
  status: "Aktif" | "Tidak Aktif";
  avatar?: string | null;
  email?: string;
}

export default function EmployeeDatabase() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFilterActive, setIsFilterActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulasi loading agar skeleton terlihat
      await new Promise(resolve => setTimeout(resolve, 1500));
      const res = await axiosInstance.get("/employees");
      if (Array.isArray(res.data)) {
        const mappedEmployees = res.data.map((emp) => ({
          ...emp,
          phone: emp.mobile_number || "",
          avatarUrl: emp.avatar || undefined,
        }));
        setEmployees(mappedEmployees);
      } else {
        setError("Format data tidak valid dari API.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Gagal memuat data karyawan: ${err.message}`);
      } else {
        setError("Gagal memuat data karyawan: Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ... (SEMUA FUNGSI HANDLER SEPERTI handleCreateSubmit, handleEditSubmit, dll TETAP SAMA)
    const handleCreateSubmit = async (formData: EmployeeFormData) => {
    if (!formData.first_name || !formData.last_name) {
      toast.error("Validasi Gagal", {
        description: "Nama depan dan belakang harus diisi.",
      });
      return;
    }
    const normalizedGender = formData.gender as "M" | "F";

    let formattedBirthDate = null;
    if (formData.birth_date) {
      const date = new Date(formData.birth_date);
      if (!isNaN(date.getTime())) {
        formattedBirthDate = date.toISOString().split("T")[0];
      } else {
        toast.error("Input Tidak Valid", {
          description: "Format tanggal lahir tidak benar.",
        });
        return;
      }
    }

    try {
      const payload: EmployeePayload = {
        ...formData,
        gender: normalizedGender,
        birth_date: formattedBirthDate || undefined,
        contract_type: formData.contract_type === "" ? undefined : formData.contract_type,
        status: formData.status === "" ? undefined : (formData.status as "Aktif" | "Tidak Aktif"),
      };

      await axiosInstance.post("/employees", payload);

      toast.success("Berhasil!", {
        description: "Karyawan baru telah berhasil ditambahkan.",
      });

      setIsCreateSheetOpen(false);
      fetchEmployees();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const validationErrors = error.response.data.errors;

        if (validationErrors && typeof validationErrors === "object") {
          if (validationErrors.nik) {
            toast.error("NIK Sudah Terdaftar", {
              description: validationErrors.nik[0] || "NIK yang Anda masukkan sudah ada di database.",
            });
          } else if (validationErrors.email) {
            toast.error("Email Sudah Digunakan", {
              description: validationErrors.email[0] || "Email yang Anda masukkan sudah terdaftar.",
            });
          } else {
            const errorMessages = Object.entries(validationErrors)
              .map(([field, messages]) => `- ${field}: ${(messages as string[]).join(", ")}`)
              .join("\n");

            toast.error("Validasi Gagal", {
              description: (
                <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
                  <code className="text-white">{errorMessages}</code>
                </pre>
              ),
            });
          }
        } else {
          const errorMsg = error.response.data.message || "Terjadi kesalahan saat membuat karyawan.";
          toast.error("Gagal Membuat Karyawan", {
            description: errorMsg,
          });
        }
      } else if (error instanceof Error) {
        console.error("Error creating employee:", error.message);
        toast.error("Terjadi Kesalahan", {
          description: error.message,
        });
      } else {
        toast.error("Terjadi Kesalahan", {
          description: "Unknown error occurred.",
        });
      }
    }
  };

  const handleEditSubmit = async (formData: EmployeeFormData) => {
    if (!editingEmployee) {
      toast.error("Aksi Tidak Valid", {
        description: "Tidak ada karyawan yang dipilih untuk diupdate.",
      });
      return;
    }

    const normalizedGender = formData.gender as "M" | "F";
    let formattedBirthDate = null;

    if (formData.birth_date) {
      const date = new Date(formData.birth_date);
      if (!isNaN(date.getTime())) {
        formattedBirthDate = date.toISOString().split("T")[0];
      } else {
        toast.error("Input Tidak Valid", {
          description: "Format tanggal lahir tidak benar.",
        });
        return;
      }
    }

    try {
      const payload: Partial<EmployeePayload> = {
        ...formData,
        user_id: editingEmployee.user_id,
        gender: normalizedGender,
        birth_date: formattedBirthDate || undefined,
        contract_type: formData.contract_type === "" ? undefined : formData.contract_type,
        status: formData.status === "" ? undefined : (formData.status as "Aktif" | "Tidak Aktif"),
      };

      await axiosInstance.put(`/employees/${editingEmployee.id}`, payload);

      toast.success("Berhasil!", {
        description: `Data untuk ${editingEmployee.first_name} telah berhasil diupdate.`,
      });

      setIsEditSheetOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const validationErrors = error.response.data.errors;
        if (validationErrors && typeof validationErrors === "object") {
          const errorMessages = Object.entries(validationErrors)
            .map(([field, messages]) => `- ${field}: ${(messages as string[]).join(", ")}`)
            .join("\n");

          toast.error("Validasi Gagal", {
            description: (
              <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
                <code className="text-white">{errorMessages}</code>
              </pre>
            ),
          });
        } else {
          const errorMsg = error.response.data.message || "Terjadi kesalahan saat mengupdate karyawan.";
          toast.error("Gagal Mengupdate Karyawan", {
            description: errorMsg,
          });
        }
      } else if (error instanceof Error) {
        console.error("Error updating employee:", error.message);
        toast.error("Terjadi Kesalahan", {
          description: error.message,
        });
      } else {
        console.error("Error updating employee:", error);
        toast.error("Terjadi Kesalahan", {
          description: "Unknown error occurred.",
        });
      }
    }
  };
  const handleOpenEditSheet = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditSheetOpen(true);
  };
  const confirmDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
  };
  const executeDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    try {
      await axiosInstance.delete(`/employees/${employeeToDelete.id}`);
      fetchEmployees();
      setEmployeeToDelete(null);
    } catch (err: unknown) {
      console.error("Error deleting employee:", err);
      alert("Gagal menghapus karyawan");
    }
  };
  const handleDownloadPDF = async (employee: Employee) => {
    try {
      const res = await axiosInstance.get(`/employees/${employee.id}/download-pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${employee.first_name}-${employee.last_name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Gagal download PDF:", err);
      alert("Gagal mendownload PDF");
    }
  };

  const filteredEmployees = employees.filter((emp) => `${emp.first_name || ""} ${emp.last_name || ""}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    const getInitials = (firstName: string, lastName: string) => {
        const first = firstName ? firstName.charAt(0) : '';
        const last = lastName ? lastName.charAt(0) : '';
        return `${first}${last}`.toUpperCase();
    };

    if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
        <div className="flex-1 min-h-screen bg-gray-50">
          <SiteHeader />

          <section className="flex flex-col md:flex-row justify-between items-center gap-4 px-10 py-4">
            <h2 className="font-semibold text-lg whitespace-nowrap">Informasi Seluruh Karyawan</h2>
            <div className="flex gap-3 flex-1">
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-3 py-1 border rounded text-xs h-8 focus:outline-none focus:border-[#1E3A5F] flex-1 min-w-0" style={{ minHeight: "2rem" }} />
              <button onClick={() => setIsFilterActive(!isFilterActive)} className="px-3 py-1 rounded border-none bg-transparent text-[#1E3A5F] flex items-center group hover:text-[#2563eb] text-xs h-8" style={{ minHeight: "2rem" }}>
                <Filter size={12} className="mr-1 transition-colors group-hover:text-[#2563eb]" /> Filter
              </button>
              <button
                className="px-3 py-1 border border-[#1E3A5F] text-[#1E3A5F] rounded hover:bg-[#1E3A5F] hover:text-white transition text-xs h-8 flex items-center"
                style={{ minHeight: "2rem" }}
                onClick={() => { /* Logika Export PDF Anda */ }}
              >
                <Upload size={12} className="mr-1" /> Export PDF
              </button>
              <label className="px-3 py-1 border border-[#1E3A5F] text-[#1E3A5F] rounded hover:bg-[#1E3A5F] hover:text-white transition text-xs h-8 flex items-center cursor-pointer" style={{ minHeight: "2rem" }}>
                <Download size={12} className="mr-1" /> Import
                <input type="file" className="hidden" />
              </label>

              <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
                <SheetTrigger asChild>
                  <button type="button" className="px-3 py-1 bg-[#1E3A5F] text-white rounded transition flex items-center border border-transparent hover:bg-white hover:text-[#1E3A5F] hover:border-[#1E3A5F] text-xs h-8" style={{ minHeight: "2rem" }}>
                    <Plus size={12} className="mr-1" /> Tambah Data
                  </button>
                </SheetTrigger>
                <SheetContent className="p-0 sm:max-w-3xl overflow-y-auto">
                  <SheetHeader className="p-6 pb-4 sticky top-0 bg-background z-10 border-b">
                    <SheetTitle>Tambah Data Karyawan Baru</SheetTitle>
                  </SheetHeader>
                  <div className="p-6 pt-2">
                    <EmployeeForm onSubmit={handleCreateSubmit} onCancel={() => setIsCreateSheetOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </section>

          {/* --- 2. IMPLEMENTASI SKELETON DI SINI --- */}
          <section className="px-6 pb-6 overflow-x-auto">
            {loading ? (
              // Tampilkan skeleton jika loading
              <EmployeeTableSkeleton />
            ) : (
              // Tampilkan tabel jika sudah selesai loading
              <>
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                        <TableHead style={{ width: 40, minWidth: 40, maxWidth: 40 }} className="text-center whitespace-nowrap">
                            No
                        </TableHead>
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
                    ) : (
                      currentEmployees.map((emp, i) => (
                        <TableRow key={emp.id} className="border-b-[6px] border-white">
                            <TableCell style={{ width: 40, minWidth: 40, maxWidth: 40 }} className="text-center whitespace-nowrap">
                                {(indexOfFirstItem + i + 1).toString()}
                            </TableCell>
                            <TableCell className="p-2 align-middle">
                                <div className="flex justify-center items-center">
                                    {emp.avatar ? (
                                        <Image
                                            src={emp.avatar}
                                            alt={`Avatar ${emp.first_name}`}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.first_name)}+${encodeURIComponent(emp.last_name)}&background=random&color=fff`;
                                            }}
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-500">
                                            {getInitials(emp.first_name, emp.last_name)}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                            <TableCell className="text-center">
                                <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold justify-center`}
                                    style={{
                                        minWidth: 90,
                                        width: 90,
                                        display: "inline-flex",
                                        background: emp.gender === "M" ? "#DBEAFE" : "#FCE7F3",
                                        color: emp.gender === "M" ? "#1D4ED8" : "#BE185D",
                                    }}
                                >
                                    {emp.gender === "M" ? "Laki-Laki" : "Perempuan"}
                                </span>
                            </TableCell>
                            <TableCell>{emp.mobile_number || emp.phone}</TableCell>
                            <TableCell>{emp.branch}</TableCell>
                            <TableCell>{emp.position}</TableCell>
                            <TableCell>{emp.grade}</TableCell>
                            <TableCell className="text-center">
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${emp.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>{emp.status}</span>
                            </TableCell>
                            <TableCell className="flex gap-2 justify-center">
                                <button type="button" onClick={() => handleDownloadPDF(emp)} className="p-1 rounded bg-blue-100 hover:bg-blue-200 transition" title="Download">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <path d="M12 18v-6" />
                                        <path d="M9 15l3 3 3-3" />
                                    </svg>
                                </button>

                                <button type="button" onClick={() => handleOpenEditSheet(emp)} className="p-1 rounded bg-yellow-100 hover:bg-yellow-200 transition" title="Edit">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                    </svg>
                                </button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <button type="button" onClick={() => confirmDeleteEmployee(emp)} className="p-1 rounded-md bg-red-100 hover:bg-red-200 transition" title="Delete">
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <polyline points="3 6 5 6 21 6" />
                                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                                          <line x1="10" y1="11" x2="10" y2="17" />
                                          <line x1="14" y1="11" x2="14" y2="17" />
                                      </svg>
                                    </button>
                                  </AlertDialogTrigger>
                                  {employeeToDelete && (
                                    <AlertDialogContent className="shadow-[0_0_0_6px_rgba(239,68,68,0.10),0_4px_24px_0_rgba(239,68,68,0.18)]">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Data karyawan{" "}
                                          <strong style={{ color: "red" }}>
                                            {employeeToDelete.first_name} {employeeToDelete.last_name}
                                          </strong>{" "}
                                          akan dihapus secara permanen.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setEmployeeToDelete(null)}>Batal</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={executeDeleteEmployee}>
                                          Hapus
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  )}
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Menampilkan</span>
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(value) => {
                                setItemsPerPage(Number(value));
                                setCurrentPage(1);
                            }}
                        >
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
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1 border rounded-l text-gray-600 hover:bg-gray-100 disabled:opacity-50">
                            Previous
                        </button>
                        {totalPages > 1 &&
                            Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                <button key={pageNumber} onClick={() => setCurrentPage(pageNumber)} className={`px-3 py-1 border ${currentPage === pageNumber ? "bg-[#1E3A5F] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                                    {pageNumber}
                                </button>
                            ))}
                        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1 border rounded-r text-gray-600 hover:bg-gray-100 disabled:opacity-50">
                            Next
                        </button>
                    </nav>
                </div>
              </>
            )}
          </section>

          <Sheet
            open={isEditSheetOpen}
            onOpenChange={(open) => {
              setIsEditSheetOpen(open);
              if (!open) {
                setEditingEmployee(null);
              }
            }}
          >
            <SheetContent className="p-0 sm:max-w-3xl overflow-y-auto">
              <SheetHeader className="p-6 pb-4 sticky top-0 bg-background z-10 border-b">
                <SheetTitle>Edit Data Karyawan</SheetTitle>
              </SheetHeader>
              <div className="p-6 pt-2">
                {editingEmployee && (
                  <EmployeeForm
                    onSubmit={handleEditSubmit}
                    onCancel={() => {
                      setIsEditSheetOpen(false);
                      setEditingEmployee(null);
                    }}
                    initialData={{
                      id: editingEmployee.id,
                      first_name: editingEmployee.first_name,
                      last_name: editingEmployee.last_name,
                      gender: editingEmployee.gender,
                      email: editingEmployee.email ?? "",
                      mobile_number: editingEmployee.mobile_number ?? "",
                      nik: editingEmployee.nik ?? "",
                      birth_place: editingEmployee.birth_place ?? "",
                      birth_date: editingEmployee.birth_date ?? "",
                      education: editingEmployee.education ?? "",
                      position: editingEmployee.position ?? "",
                      grade: editingEmployee.grade ?? "",
                      branch: editingEmployee.branch ?? "",
                      contract_type: editingEmployee.contract_type ?? "",
                      bank: editingEmployee.bank ?? "",
                      bank_account_number: editingEmployee.bank_account_number ?? "",
                      bank_account_name: editingEmployee.bank_account_name ?? "",
                      sp_type: editingEmployee.sp_type ?? "",
                      status: editingEmployee.status ?? "",
                      avatar: editingEmployee.avatar ?? "",
                    }}
                  />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </SidebarProvider>
  );
}
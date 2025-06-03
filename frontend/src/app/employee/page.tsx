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

// Hapus import yang tidak digunakan lagi:
// import { Card, CardContent } from "../../components/ui/card";
// import { Bell, UserCircle2, ImageIcon, CalendarIcon } from "lucide-react";
// import { Toggle } from "../../components/ui/toggle";
// import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../../components/ui/sheet";
// import { Label } from "../../components/ui/label";
// import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
// import RealAddEmployeeForm from "../../components/ui/AddEmployeeForm"; // Ini digunakan jika Anda tetap pakai Sheet untuk Add/Edit

// Hapus import axios dan axiosInstance karena tidak ada backend
// import axiosInstance from "../../lib/axios";
// import axios from "axios";


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

// Data mock karyawan
const mockEmployees: Employee[] = [
  {
    id: "1a2b3c4d-5e6f-7890-1234-567890abcdef",
    first_name: "Noah",
    last_name: "White",
    gender: "M",
    mobile_number: "081961186366",
    nik: "1234567890123456",
    position: "Intern",
    branch: "Palembang",
    status: "Aktif",
    birth_date: "1995-06-15",
    grade: "Management",
    contract_type: "Kontrak",
    bank: "BCA",
    bank_account_number: "1234567890",
    bank_account_name: "Noah White",
  },
  {
    id: "f1e2d3c4-b5a6-9870-6543-210fedcba987",
    first_name: "Jane",
    last_name: "Doe",
    gender: "F",
    mobile_number: "081234567890",
    nik: "9876543210987654",
    position: "HR Staff",
    branch: "Jakarta",
    status: "Aktif",
    birth_date: "1990-03-20",
    grade: "Junior",
    contract_type: "Tetap",
    bank: "Mandiri",
    bank_account_number: "0987654321",
    bank_account_name: "Jane Doe",
  },
  {
    id: "c9b8a7d6-e5f4-3210-9876-543210fedcba",
    first_name: "John",
    last_name: "Smith",
    gender: "M",
    mobile_number: "085678901234",
    nik: "1122334455667788",
    position: "Software Engineer",
    branch: "Bandung",
    status: "Tidak Aktif",
    birth_date: "1988-07-01",
    grade: "Senior",
    contract_type: "Tetap",
    bank: "BCA",
    bank_account_number: "1122334455",
    bank_account_name: "John Smith",
  },
];


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
      // Simulasi panggilan API dengan delay
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay 1 detik
      
      // Menggunakan data mock
      setEmployees(mockEmployees); 
      console.log("Mock data loaded for employees:", mockEmployees);

    } catch (err: any) {
      console.error("Fetch error (mock data):", err);
      setError(`Gagal memuat data karyawan (mock): ${err.message}`);
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
    // Fungsi ini akan dipanggil oleh AddEmployeeForm jika Anda tetap menggunakan sheet.
    // Sekarang, hanya simulasi penambahan data.
    console.log('Simulating Add Employee:', formData);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi delay
    const newEmployee: Employee = {
      id: crypto.randomUUID(), // Generate UUID untuk ID mock
      ...formData,
      status: formData.status || "Aktif",
      gender: formData.gender === "Laki-Laki" ? "M" : formData.gender === "Perempuan" ? "F" : formData.gender, // Normalize gender
    };
    setEmployees((prev) => [...prev, newEmployee]);
    console.log('Employee added to mock data.');
    // setIsAddSheetOpen(false); // Jika Anda tetap pakai sheet
    // fetchEmployees(); // Muat ulang data mock
  };

  const handleOpenEditSheet = (employee: Employee) => {
    setEditingEmployee(employee);
    // Navigasi ke halaman edit
    router.push(`/employee/edit/${employee.id}`);
    console.log("Navigating to /employee/edit/", employee.id);
  };
  
  const handleActualUpdateEmployee = async (formData: any) => {
    // Fungsi ini akan dipanggil oleh form edit.
    // Sekarang, hanya simulasi update data.
    if (!editingEmployee) return;
    console.log("Simulating Update Employee:", editingEmployee.id, formData);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi delay
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === editingEmployee.id ? { ...emp, ...formData } : emp
      )
    );
    console.log("Employee updated in mock data.");
    setEditingEmployee(null);
    // setIsEditSheetOpen(false); // Jika Anda tetap pakai sheet
    // fetchEmployees(); // Muat ulang data mock
  };

  const confirmDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee);
    console.log("Confirming delete for employee:", employee.first_name);
  };

  const executeDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    console.log("Simulating Delete Employee:", employeeToDelete.id);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi delay
    setEmployees((prev) => prev.filter((emp) => emp.id !== employeeToDelete.id));
    console.log("Employee deleted from mock data.");
    setEmployeeToDelete(null); // Tutup dialog
    // fetchEmployees(); // Muat ulang data mock
  };

  const handleDownloadPDF = (employee: Employee) => {
    console.log("Simulating Download PDF for:", employee.first_name);
    // Logika PDF Anda tetap seperti yang Anda buat, karena tidak melibatkan backend
    const pdfContent = `%PDF-1.7 ... (Nama: ${employee.first_name} ${employee.last_name}) ... (Nomor Telepon: ${employee.mobile_number || employee.phone}) ...`;
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${employee.first_name}-${employee.last_name}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
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
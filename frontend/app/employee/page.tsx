"use client";

import {
  SidebarInset,
  SidebarProvider,
} from "../../components/ui/sidebar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Filter,
  Download,
  Upload,
  Plus,
  Bell,
  UserCircle2,
  ImageIcon,
  CalendarIcon,
} from "lucide-react";
import { Toggle } from "../../components/ui/toggle";
import { SiteHeader } from "../../components/ui/site-header";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../../components/ui/sheet";
import { AppSidebar } from "../../components/ui/app-sidebar";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { SectionCardsEmployee } from "../../components/ui/section-card-employee";
import { data } from "jquery";
import { ChartAreaInteractive } from "../../components/ui/chart-area-interactive";
import { DataTable } from "../../components/ui/data-table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/alert-dialog";
import { useState } from "react";

export default function EmployeeDatabase() {
  // Mock data generator functions

  // generateAvatar: show image if url provided, else fallback to initials
  // Avatar generator: icon user tanpa outline, warna random, icon sedikit transparan
  const generateAvatar = (name: string, imageUrl?: string) => {
    // Fallback: initials with pastel bg and profile icon (simple user icon, no outline)
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    const bgColor = `hsl(${h}, 70%, 80%)`;

    return (
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs relative overflow-hidden bg-[hsl(var(--avatar-bg))] text-[#1E3A5F]"
        title={name}
        style={{ ["--avatar-bg" as any]: `${h},70%,80%` }}
      >
        {/* Simple user icon, no outline, sedikit transparan */}
        <svg width={24} height={24} viewBox="0 0 24 24" fill="#000" style={{ opacity: 0.3 }}>
          <circle cx="12" cy="8" r="4" />
          <ellipse cx="12" cy="17" rx="7" ry="5" />
        </svg>
      </div>
    );
  };

  const getRandomFirstName = () => {
    const firstNames = [
      "Juanita", "Shane", "Miles", "Flores", "Henry", "Marvin", "Black", "Ralph", "Timothy", "Johnny",
      "Emily", "David", "Sophia", "William", "Olivia", "James", "Ava", "Benjamin", "Isabella", "Ethan",
      "Charlotte", "Lucas", "Amelia", "Noah", "Harper", "Logan", "Mia", "Liam", "Evelyn", "Daniel",
      "Grace", "Matthew", "Victoria", "Joseph", "Elizabeth", "Samuel", "Sofia", "Sebastian", "Chloe", "Jacob",
      "Abigail", "Julian", "Madison", "Eli", "Avery", "Lincoln", "Hannah", "Carter", "Ellie", "Owen"
    ];
    return firstNames[Math.floor(Math.random() * firstNames.length)];
  };

  const getRandomLastName = () => {
    const lastNames = [
      "Doe", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez",
      "Martinez", "Hernandez", "Lopez", "Gonzalez", "Perez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore",
      "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis",
      "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
      "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Evans", "Davis"
    ];
    return lastNames[Math.floor(Math.random() * lastNames.length)];
  };

  const getRandomGender = () => {
    return Math.random() < 0.5 ? "Laki-Laki" : "Perempuan";
  };

  const getRandomPhone = () => {
    const prefix = ["0812", "0813", "0814", "0815", "0816", "0817", "0818", "0819"];
    return `${prefix[Math.floor(Math.random() * prefix.length)]}${Math.floor(10000000 + Math.random() * 90000000)}`;
  };

  const getRandomBranch = () => {
    const branches = ["Malang", "Jakarta", "Surabaya", "Bandung", "Yogyakarta", "Semarang", "Medan", "Palembang", "Denpasar", "Balikpapan"];
    return branches[Math.floor(Math.random() * branches.length)];
  };

  const getRandomPosition = () => {
    const positions = ["CEO", "Manager", "Supervisor", "Staff", "Intern", "HR", "Accountant", "Developer", "Designer", "Sales"];
    return positions[Math.floor(Math.random() * positions.length)];
  };

  const getRandomGrade = () => {
    const grades = ["Management", "Executive", "Professional", "Support", "Operational"];
    return grades[Math.floor(Math.random() * grades.length)];
  };
  // Helper to randomly set employee status as active or not
  const getRandomStatus = () => (Math.random() < 0.5 ? "active" : "inactive");
  
  // Generate 50 mock employees
  const generateMockEmployees = () => {
    const employees = [];
    for (let i = 1; i <= 100; i++) {
      const firstName = getRandomFirstName();
      const lastName = getRandomLastName();
      employees.push({
        id: i,
        avatarUrl: undefined, // Simpan url jika ada, undefined jika tidak ada
        firstName,
        lastName,
        gender: getRandomGender(),
        phone: getRandomPhone(),
        branch: getRandomBranch(),
        position: getRandomPosition(),
        grade: getRandomGrade(),
        status: getRandomStatus(),
      });
    }
    return employees;
  }

  const [employees, setEmployees] = useState(generateMockEmployees());

  const [isFilterActive, setIsFilterActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const currentMonthYear = new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default: 10 items per page
  
  // Calculate pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Initialize employees with mock data
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  // Total pages
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  
  // Dummy add employee function
  const handleAddEmployee = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEmployee = Object.fromEntries(formData);
    console.log("New Employee:", newEmployee);
    setIsSheetOpen(false);
  };

  const handleDownloadPDF = (employee) => {
  const pdfContent = `%PDF-1.7
    1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
    2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
    3 0 obj<</Type/Page/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/MediaBox[0 0 612 792]/Contents 5 0 R>>endobj
    4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
    5 0 obj<</Length 115>>stream
    BT
    /F1 16 Tf
    100 700 Td
    (Informasi Karyawan)Tj
    /F1 12 Tf
    100 680 Td
    (Nama: ${employee.firstName} ${employee.lastName})Tj
    100 660 Td
    (Jenis Kelamin: ${employee.gender})Tj
    100 640 Td
    (Nomor Telepon: ${employee.phone})Tj
    100 620 Td
    (Cabang: ${employee.branch})Tj
    100 600 Td
    (Jabatan: ${employee.position})Tj
    ET
    endstream
    endobj
    xref
    0 6
    0000000000 65535 f 
    0000000015 00000 n 
    0000000076 00000 n 
    0000000177 00000 n 
    0000000385 00000 n 
    0000000444 00000 n 
    trailer<</Size 6/Root 1 0 R>>
    startxref
    549
    %%EOF`;

      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${employee.firstName}-${employee.lastName}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
  };

  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const handleDeleteEmployee = (id) => {
  if (!id) return;
  const updatedEmployees = employees.filter(emp => emp.id !== id);
  setEmployees(updatedEmployees);
  setEmployeeToDelete(null); // Reset after deletion
  };

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  // Handle edit employee
  const handleEditEmployee = (employee) => {
    setEditingEmployee({ ...employee });
    setIsEditSheetOpen(true);
  };

  // Simulate update
  const handleUpdateEmployee = (updatedEmployee) => {
    const updatedList = employees.map(emp =>
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    );
    setEmployees(updatedList);
    setIsEditSheetOpen(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-col h-full bg-white">
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
                <button
                className="px-3 py-1 border border-[#1E3A5F] text-[#1E3A5F] rounded hover:bg-[#1E3A5F] hover:text-white transition text-xs h-8 flex items-center"
                style={{ minHeight: "2rem" }}
                onClick={() => {
                  import("jspdf").then(jsPDFModule => {
                  const jsPDF = jsPDFModule.default;
                  import("jspdf-autotable").then(() => {
                    const doc = new jsPDF();
                    // Table columns
                    const columns = [
                    "No",
                    "Nama",
                    "Jenis Kelamin",
                    "Nomor Telepon",
                    "Cabang",
                    "Jabatan",
                    "Grade",
                    "Status"
                    ];
                    // Table rows
                    const rows = currentEmployees.map((emp, i) => [
                    indexOfFirstItem + i + 1,
                    `${emp.firstName} ${emp.lastName}`,
                    emp.gender,
                    emp.phone,
                    emp.branch,
                    emp.position,
                    emp.grade,
                    emp.status === "active" ? "Aktif" : "Tidak Aktif"
                    ]);
                    // @ts-ignore
                    doc.autoTable({
                    head: [columns],
                    body: rows,
                    styles: { font: "helvetica", fontSize: 10 },
                    headStyles: { fillColor: [30, 58, 95] }
                    });
                    doc.save("employee-table.pdf");
                  });
                  });
                }}
                >
                <Upload size={12} className="mr-1" /> Export PDF
                </button>
              <label
                className="px-3 py-1 border border-[#1E3A5F] text-[#1E3A5F] rounded hover:bg-[#1E3A5F] hover:text-white transition text-xs h-8 flex items-center cursor-pointer"
                style={{ minHeight: "2rem" }}
              >
                <Download size={12} className="mr-1" /> Import
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    // Simple CSV/Excel import using SheetJS (xlsx)
                    const XLSX = await import("xlsx");
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      const data = evt.target?.result;
                      if (!data) return;
                      const workbook = XLSX.read(data, { type: "binary" });
                      const sheetName = workbook.SheetNames[0];
                      const worksheet = workbook.Sheets[sheetName];
                      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                      // Do something with imported data, e.g. log or set state
                      console.log("Imported data:", json);
                      alert("Import berhasil! Lihat console untuk data.");
                    };
                    reader.readAsBinaryString(file);
                    // Reset input so same file can be selected again
                    e.target.value = "";
                  }}
                />
              </label>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <button
                className="px-3 py-1 bg-[#1E3A5F] text-white rounded transition flex items-center border border-transparent hover:bg-white hover:text-[#1E3A5F] hover:border-[#1E3A5F] text-xs h-8"
                style={{ minHeight: "2rem" }}
                >
                <Plus size={12} className="mr-1" /> Tambah Data
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="!w-[85vw] max-w-none p-6 overflow-y-auto"
                style={{ width: "85vw", maxWidth: "none" }}
              >
                <SheetHeader>
                <SheetTitle className="text-lg font-semibold">Tambah Karyawan</SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground">
                  Silahkan isi data karyawan baru di bawah ini.
                </SheetDescription>
                </SheetHeader>
                <AddEmployeeForm onSubmit={handleAddEmployee} onCancel={() => setIsSheetOpen(false)} />
              </SheetContent>
              </Sheet>
            </div>
            </section>

          {/* Table */}
          <section className="px-6 pb-6 overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                    <TableHead
                      style={{ width: 40, minWidth: 40, maxWidth: 40 }}
                      className="text-center whitespace-nowrap"
                    >
                      <div className="text-center w-full">No</div>
                    </TableHead>
                    <TableHead className="w-[4%] text-center">
                      <div className="text-center w-full">Avatar</div>
                    </TableHead>
                    <TableHead className="w-[16%]">
                      <div className="w-full">Nama</div>
                    </TableHead>
                    <TableHead className="w-[10%] text-center">
                      <div className="text-center w-full">Jenis Kelamin</div>
                    </TableHead>
                    <TableHead className="w-[10%]">
                      <div className="w-full">Nomor Telepon</div>
                    </TableHead>
                    <TableHead className="w-[13%]">
                      <div className="w-full">Cabang</div>
                    </TableHead>
                    <TableHead className="w-[13%]">
                      <div className="w-full">Jabatan</div>
                    </TableHead>
                    <TableHead className="w-[13%]">
                      <div className="w-full">Grade</div>
                    </TableHead>
                    <TableHead className="w-[8%] text-center">
                      <div className="text-center w-full">Status</div>
                    </TableHead>
                    <TableHead className="w-[12%] text-center">
                      <div className="text-center w-full">Action</div>
                    </TableHead>
                </TableRow>
              </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        Tidak ada data ditemukan
                      </TableCell>
                    </TableRow>
                  ) : currentEmployees.map((emp, i) => (
                    <TableRow key={emp.id} className="border-b-[6px] border-white">
                      <TableCell
                        style={{ width: 40, minWidth: 40, maxWidth: 40 }}
                        className="text-center whitespace-nowrap"
                      >
                        {indexOfFirstItem + i + 1}
                      </TableCell>
                      <TableCell className="text-center">
                        {generateAvatar(`${emp.firstName} ${emp.lastName}`, emp.avatarUrl)}
                      </TableCell>
                      <TableCell>{emp.firstName} {emp.lastName}</TableCell>
                        <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold justify-center`}
                          style={{
                          minWidth: 90,
                          width: 90,
                          display: "inline-flex",
                          background:
                            emp.gender === "Laki-Laki"
                            ? "#DBEAFE"
                            : "#FCE7F3",
                          color:
                            emp.gender === "Laki-Laki"
                            ? "#1D4ED8"
                            : "#BE185D",
                          }}
                        >
                          {emp.gender === "Laki-Laki" ? (
                          // Male icon (simple SVG)
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" className="inline align-middle">
                            <circle cx="10" cy="14" r="6" />
                            <path d="M19 5v5M19 5h-5M19 5l-7 7" />
                          </svg>
                          ) : (
                          // Female icon (simple SVG)
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" className="inline align-middle">
                            <circle cx="12" cy="8" r="5" />
                            <line x1="12" y1="13" x2="12" y2="21" />
                            <line x1="9" y1="18" x2="15" y2="18" />
                          </svg>
                          )}
                          {emp.gender}
                        </span>
                        </TableCell>
                      <TableCell>{emp.phone}</TableCell>
                      <TableCell>{emp.branch}</TableCell>
                      <TableCell>{emp.position}</TableCell>
                      <TableCell>{emp.grade}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                            emp.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {emp.status === "active" ? "Aktif" : "Tidak Aktif"}
                        </span>
                      </TableCell>
                      <TableCell className="flex gap-2 justify-center">
                        {/* Download Button */}
                        <button
                          onClick={() => handleDownloadPDF(emp)}
                          className="p-1 rounded bg-blue-100 hover:bg-blue-200 transition"
                          title="Download"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <path d="M12 18v-6" />
                            <path d="M9 15l3 3 3-3" />
                          </svg>
                        </button>

                        {/* Edit Button */}
                        {/* Edit Button with Sheet */}
                        <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                          <SheetTrigger asChild>
                            <button
                              onClick={() => handleEditEmployee(emp)}
                              className="p-1 rounded bg-yellow-100 hover:bg-yellow-200 transition"
                              title="Edit"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                              </svg>
                            </button>
                          </SheetTrigger>
                          <SheetContent
                            side="right"
                            className="!w-[85vw] max-w-none p-6 overflow-y-auto"
                            style={{ width: "85vw", maxWidth: "none" }}
                          >
                            <SheetHeader>
                              <SheetTitle className="text-lg font-semibold">Edit Karyawan</SheetTitle>
                              <SheetDescription className="text-sm text-muted-foreground">
                                Ubah data karyawan {editingEmployee?.firstName} {editingEmployee?.lastName}
                              </SheetDescription>
                            </SheetHeader>
                            <AddEmployeeForm
                              initialData={editingEmployee}
                              onSubmit={(formData) => handleUpdateEmployee(formData)}
                              onCancel={() => setIsEditSheetOpen(false)}
                            />
                          </SheetContent>
                        </Sheet>

                        {/* Delete Button with AlertDialog Trigger */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => setEmployeeToDelete(emp)}
                              className="p-1 rounded-md bg-red-100 hover:bg-red-200 transition"
                              title="Delete"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </button>
                          </AlertDialogTrigger>
                            <AlertDialogContent className="shadow-[0_0_0_6px_rgba(239,68,68,0.10),0_4px_24px_0_rgba(239,68,68,0.18)]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                              <AlertDialogDescription>
                              Data karyawan <strong style={{ color: "red" }}>{employeeToDelete?.firstName} {employeeToDelete?.lastName}</strong> akan dihapus secara permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setEmployeeToDelete(null)}>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => handleDeleteEmployee(employeeToDelete?.id)}
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
              {/* Items per page dropdown */}
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Menampilkan</span>
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                    <SelectTrigger id="items-per-page">
                      {itemsPerPage}
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
                Menampilkan {indexOfFirstItem + 1} sampai {Math.min(indexOfLastItem, filteredEmployees.length)} dari {filteredEmployees.length} karyawan
                </div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">

                {/* Previous button */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3 py-1 border rounded-l text-gray-600 hover:bg-gray-100"
                >
                  Previous
                </button>

                {/* Page numbers: only 1 before and 1 after current page, with ellipsis if needed */}
                {totalPages > 1 && (() => {
                  const pageNumbers = [];
                  const showLeftEllipsis = currentPage > 3;
                  const showRightEllipsis = currentPage < totalPages - 2;

                  // Always show first page
                  if (currentPage > 1) {
                  pageNumbers.push(
                    <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className={`px-3 py-1 border ${currentPage === 1 ? 'bg-[#1E3A5F] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                    1
                    </button>
                  );
                  }

                  // Only show ellipsis if currentPage > 3
                  if (showLeftEllipsis) {
                  pageNumbers.push(
                    <span key="start-ellipsis" className="px-2 py-1 text-gray-400">...</span>
                  );
                  }

                  // Show previous page if not first and not second
                  if (currentPage - 1 > 1) {
                  pageNumbers.push(
                    <button
                    key={currentPage - 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3 py-1 border text-gray-600 hover:bg-gray-100"
                    >
                    {currentPage - 1}
                    </button>
                  );
                  }

                  // Show current page
                  pageNumbers.push(
                  <button
                    key={currentPage}
                    className="px-3 py-1 border bg-[#1E3A5F] text-white"
                    disabled
                  >
                    {currentPage}
                  </button>
                  );

                  // Show next page if not last and not second last
                  if (currentPage + 1 < totalPages) {
                  pageNumbers.push(
                    <button
                    key={currentPage + 1}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3 py-1 border text-gray-600 hover:bg-gray-100"
                    >
                    {currentPage + 1}
                    </button>
                  );
                  }

                  // Only show ellipsis if currentPage < totalPages - 2
                  if (showRightEllipsis) {
                  pageNumbers.push(
                    <span key="end-ellipsis" className="px-2 py-1 text-gray-400">...</span>
                  );
                  }

                  // Always show last page
                  if (currentPage < totalPages) {
                  pageNumbers.push(
                    <button
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-1 border ${currentPage === totalPages ? 'bg-[#1E3A5F] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                    {totalPages}
                    </button>
                  );
                  }

                  return pageNumbers;
                })()}

                {/* Next button */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-1 border rounded-r text-gray-600 hover:bg-gray-100"
                >
                  Next
                </button>
              </nav>
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// ✨ Add Employee Form Component
function AddEmployeeForm({ onSubmit, onCancel, initialData = null }) {
  const genderOptions = [
  { value: "male", label: "Laki-laki" },
  { value: "female", label: "Perempuan" },
  ];

  const pendidikanOptions = [
    { value: "sma", label: "SMA/SMK" },
    { value: "d3", label: "D3" },
    { value: "s1", label: "S1" },
    { value: "s2", label: "S2" },
    { value: "s3", label: "S3" },
  ];

  const kontrakOptions = [
    { value: "tetap", label: "Tetap" },
    { value: "kontrak", label: "Kontrak" },
    { value: "lepas", label: "Lepas" },
  ];

  const gradeOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
  ];

  const bankOptions = [
    { value: "bca", label: "BCA" },
    { value: "bni", label: "BNI" },
    { value: "bri", label: "BRI" },
    { value: "mandiri", label: "Mandiri" },
    { value: "cimb", label: "CIMB Niaga" },
  ];

  const spOptions = [
    { value: "sp1", label: "SP 1" },
    { value: "sp2", label: "SP 2" },
    { value: "sp3", label: "SP 3" },
  ];

  const [form, setForm] = useState(
    initialData
      ? {
          firstName: initialData.firstName || "",
          lastName: initialData.lastName || "",
          mobilePhone: initialData.mobilePhone || "",
          nik: initialData.nik || "",
          gender: initialData.gender || "",
          pendidikan: initialData.pendidikan || "",
          tempatLahir: initialData.tempatLahir || "",
          tanggalLahir: initialData.tanggalLahir || "",
          jabatan: initialData.jabatan || "",
          cabang: initialData.cabang || "",
          kontrak: initialData.kontrak || "",
          grade: initialData.grade || "",
          bank: initialData.bank || "",
          noRekening: initialData.noRekening || "",
          atasNama: initialData.atasNama || "",
          tipeSp: initialData.tipeSp || "",
          avatar: initialData.avatar || "",
        }
      : {
          firstName: "",
          lastName: "",
          mobilePhone: "",
          nik: "",
          gender: "",
          pendidikan: "",
          tempatLahir: "",
          tanggalLahir: null,
          jabatan: "",
          cabang: "",
          kontrak: "",
          grade: "",
          bank: "",
          noRekening: "",
          atasNama: "",
          tipeSp: "",
          avatar: "",
        }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, tanggalLahir: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log(form);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-2">
      <div className="flex items-center mb-4 gap-4">
        <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
          {form.avatar ? (
        <img
          src={form.avatar}
          alt="Avatar Preview"
          className="object-cover w-full h-full"
        />
          ) : (
        <ImageIcon size={48} className="text-gray-400" />
          )}
        </div>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            setForm((prev) => ({
          ...prev,
          avatar: ev.target?.result as string,
            }));
          };
          reader.readAsDataURL(file);
        }
          }}
        />
        <Button
          variant="outline"
          type="button"
          onClick={() => document.getElementById("avatar-upload")?.click()}
        >
          Upload Avatar
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" placeholder="Enter the first name" value={form.firstName} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" placeholder="Enter the last name" value={form.lastName} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="mobilePhone">Mobile Number</Label>
          <Input id="mobilePhone" name="mobilePhone" placeholder="Enter the Mobile Number" value={form.mobilePhone} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="nik">NIK</Label>
          <Input id="nik" name="nik" placeholder="Enter the NIK" value={form.nik} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={form.gender}
            onValueChange={(value) => setForm((f) => ({ ...f, gender: value }))}
          >
            <SelectTrigger id="gender">
              {form.gender
                ? genderOptions.find((opt) => opt.value === form.gender)?.label
                : "-Pilih Gender-"}
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="pendidikan">Pendidikan Terakhir</Label>
          <Select
            value={form.pendidikan}
            onValueChange={(value) => setForm((f) => ({ ...f, pendidikan: value }))}
          >
            <SelectTrigger id="pendidikan">
              {form.pendidikan
          ? pendidikanOptions.find((opt) => opt.value === form.pendidikan)?.label
          : "-Pilih Pendidikan Terakhir-"}
            </SelectTrigger>
            <SelectContent>
              {pendidikanOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tempatLahir">Tempat Lahir</Label>
          <Input id="tempatLahir" name="tempatLahir" placeholder="Masukan Tempat Lahir" value={form.tempatLahir} onChange={handleChange} required />
        </div>
        <div>
        <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
        <div className="relative">
          <Input
            id="tanggalLahir"
            name="tanggalLahir"
            type="date"
            value={form.tanggalLahir || ""}
            onChange={(e) => handleDateChange(e.target.value)}
            className="pl-3"
            placeholder="dd/mm/yyyy"
            required
            autoComplete="off"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="jabatan">Jabatan</Label>
        <Input id="jabatan" name="jabatan" placeholder="Enter your jabatan" value={form.jabatan} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="cabang">Cabang</Label>
        <Input id="cabang" name="cabang" placeholder="Enter the cabang" value={form.cabang} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="kontrak">Tipe Kontrak</Label>
        <RadioGroup
          id="kontrak"
          name="kontrak"
          value={form.kontrak}
          onValueChange={(value) => setForm((f) => ({ ...f, kontrak: value }))}
          className="flex gap-4 mt-2"
        >
          {kontrakOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} />
              <span>{opt.label}</span>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <Label htmlFor="grade">Grade</Label>
        <Input id="grade" name="grade" placeholder="Masukan Grade Anda" value={form.grade} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="bank">Bank</Label>
        <Select
          value={form.bank}
          onValueChange={(value) => setForm((f) => ({ ...f, bank: value }))}
        >
          <SelectTrigger id="bank">
        {form.bank
          ? bankOptions.find((opt) => opt.value === form.bank)?.label
          : "-Pilih Bank-"}
          </SelectTrigger>
          <SelectContent>
        {bankOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="noRekening">Nomor Rekening</Label>
        <Input id="noRekening" name="noRekening" placeholder="Masukan Nomor Rekening" value={form.noRekening} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="atasNama">Atas Nama Rekening</Label>
        <Input id="atasNama" name="atasNama" placeholder="Masukan A/N Rekening" value={form.atasNama} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="tipeSp">Tipe SP</Label>
        <Select
          value={form.tipeSp}
          onValueChange={(value) => setForm((f) => ({ ...f, tipeSp: value }))}
        >
          <SelectTrigger id="tipeSp">
        {form.tipeSp
          ? spOptions.find((opt) => opt.value === form.tipeSp)?.label
          : "-Pilih SP-"}
          </SelectTrigger>
          <SelectContent>
        {spOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
          </SelectContent>
        </Select>
      </div>
    </div>
    <div className="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
    </form>
  );
}
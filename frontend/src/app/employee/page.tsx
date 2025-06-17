"use client";

import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Filter, Download, Upload, Plus, Eye } from "lucide-react";
import { SiteHeader } from "../../components/ui/site-header";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../../components/ui/alert-dialog";
import { AppSidebar } from "../../components/ui/app-sidebar";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/ui/select";
// import { SectionCardsEmployee } from "../../components/employee/section-card-employee"; // This seems unused, commenting out.

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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

// New imports for export/import functionality
import * as XLSX from "xlsx"; // For Excel/CSV export
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // For table formatting in PDF
import Papa from "papaparse"; // Corrected import for ParseResult

// TypeScript: add autoTable to jsPDF instance type
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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

export default function DatabaseKaryawan() {
  const [daftarKaryawan, setDaftarKaryawan] = useState<Employee[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [kesalahan, setKesalahan] = useState<string | null>(null);

  const [kataKunci, setKataKunci] = useState("");

  const [sheetBuatTerbuka, setSheetBuatTerbuka] = useState(false);
  const [karyawanUntukDihapus, setKaryawanUntukDihapus] = useState<Employee | null>(null);
  const [sheetLihatTerbuka, setSheetLihatTerbuka] = useState(false);
  const [karyawanDilihat, setKaryawanDilihat] = useState<Employee | null>(null);
  const [modeEdit, setModeEdit] = useState(false);

  const [halamanSaatIni, setHalamanSaatIni] = useState(1);
  const [itemPerHalaman, setItemPerHalaman] = useState(10);

  const [dialogFilterTerbuka, setDialogFilterTerbuka] = useState(false);
  const [filterGender, setFilterGender] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterCabang, setFilterCabang] = useState<string[]>([]);
  const [genderKustom, setGenderKustom] = useState("");
  const [statusKustom, setStatusKustom] = useState("");
  const [cabangKustom, setCabangKustom] = useState("");

  const [dialogEksporTerbuka, setDialogEksporTerbuka] = useState(false);

  const ambilKaryawan = async () => {
    setMemuat(true);
    setKesalahan(null);
    try {
      // Simulasi loading agar skeleton terlihat
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const res = await axiosInstance.get("/employees");
      if (Array.isArray(res.data)) {
        const mappedEmployees = res.data.map((emp) => ({
          ...emp,
          phone: emp.mobile_number || "",
          avatarUrl: emp.avatar || undefined, // This property is not part of Employee interface, but was in original code. Keeping for consistency.
        }));
        setDaftarKaryawan(mappedEmployees);
      } else {
        setKesalahan("Format data tidak valid dari API.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setKesalahan(`Gagal memuat data karyawan: ${err.message}`);
      } else {
        setKesalahan("Gagal memuat data karyawan: Unknown error");
      }
    } finally {
      setMemuat(false);
    }
  };

  useEffect(() => {
    ambilKaryawan();
  }, []);

  const submitBuat = async (formData: EmployeeFormData) => {
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

      setSheetBuatTerbuka(false);
      ambilKaryawan();
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

  const submitEdit = async (formData: EmployeeFormData) => {
    if (!karyawanDilihat) {
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
        user_id: karyawanDilihat.user_id,
        gender: normalizedGender,
        birth_date: formattedBirthDate || undefined,
        contract_type: formData.contract_type === "" ? undefined : formData.contract_type,
        status: formData.status === "" ? undefined : (formData.status as "Aktif" | "Tidak Aktif"),
      };

      await axiosInstance.put(`/employees/${karyawanDilihat.id}`, payload);

      toast.success("Berhasil!", {
        description: `Data untuk ${karyawanDilihat.first_name} telah berhasil diupdate.`,
      });

      setSheetLihatTerbuka(false);
      setModeEdit(false);
      ambilKaryawan();
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

  const bukaSheetLihat = (karyawan: Employee) => {
    setKaryawanDilihat(karyawan);
    setSheetLihatTerbuka(true);
    setModeEdit(false); // Reset ke mode view setiap buka sheet
  };

  const konfirmasiHapusKaryawan = (karyawan: Employee) => {
    setKaryawanUntukDihapus(karyawan);
  };

  const eksekusiHapusKaryawan = async () => {
    if (!karyawanUntukDihapus) return;
    try {
      await axiosInstance.delete(`/employees/${karyawanUntukDihapus.id}`);
      ambilKaryawan();
      setKaryawanUntukDihapus(null);
      toast.success("Berhasil!", {
        description: "Karyawan telah berhasil dihapus.",
      });
    } catch (err: unknown) {
      console.error("Error deleting employee:", err);
      toast.error("Gagal Menghapus Karyawan", {
        description: "Terjadi kesalahan saat menghapus karyawan.",
      });
    }
  };

  // Fungsi untuk ekspor PDF massal via backend
  const handleExportPDF = async () => {
    try {
      // Ganti endpoint sesuai kebutuhan backend Anda
      const res = await axiosInstance.get("/employees/download-pdf", {
        responseType: "blob",
        params: {
          // Jika ingin filter, bisa tambahkan parameter di sini
        },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Data_Karyawan_${new Date().toISOString().split("T")[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Berhasil!", { description: "Data karyawan berhasil diexport ke PDF." });
    } catch (err) {
      console.error("Gagal export PDF:", err);
      toast.error("Gagal Export PDF", { description: "Terjadi kesalahan saat export PDF." });
    }
  };

  // Old handleDownloadPDF, replaced by the new handleExportPDF for mass export
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

  const eksporData = (format: "xlsx" | "csv" | "pdf") => {
    const dataUntukEkspor = daftarKaryawan.map((emp) => ({
      "No. Karyawan": emp.user_id || "",
      "Nama Depan": emp.first_name,
      "Nama Belakang": emp.last_name,
      "Jenis Kelamin": emp.gender === "M" ? "Laki-Laki" : "Perempuan",
      "Nomor Telepon": emp.mobile_number || emp.phone || "",
      NIK: emp.nik || "",
      "Tempat Lahir": emp.birth_place || "",
      "Tanggal Lahir": emp.birth_date || "",
      Pendidikan: emp.education || "",
      Posisi: emp.position,
      Grade: emp.grade,
      Cabang: emp.branch,
      "Tipe Kontrak": emp.contract_type || "",
      Bank: emp.bank || "",
      "Nomor Rekening": emp.bank_account_number || "",
      "Nama Rekening": emp.bank_account_name || "",
      "Tipe SP": emp.sp_type || "",
      Status: emp.status,
      Email: emp.email || "",
    }));

    const filename = `Data_Karyawan_${new Date().toISOString().split("T")[0]}`;

    if (format === "xlsx") {
      const ws = XLSX.utils.json_to_sheet(dataUntukEkspor);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Employees");
      XLSX.writeFile(wb, `${filename}.xlsx`);
      toast.success("Berhasil!", { description: "Data karyawan berhasil diexport ke Excel." });
    } else if (format === "csv") {
      const csv = Papa.unparse(dataUntukEkspor);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Berhasil!", { description: "Data karyawan berhasil diexport ke CSV." });
    } else if (format === "pdf") {
      if (dataUntukEkspor.length === 0) {
        toast.error("Tidak ada data untuk diexport.");
        return;
      }
      const doc = new jsPDF();
      const headers = Object.keys(dataUntukEkspor[0]);
      const body = dataUntukEkspor.map((row) => Object.values(row));
      doc.autoTable({
        head: [headers],
        body: body,
        startY: 20,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [30, 58, 95] },
        margin: { top: 10, left: 10, right: 10, bottom: 10 },
      });
      doc.save(`${filename}.pdf`);
      toast.success("Berhasil!", { description: "Data karyawan berhasil diexport ke PDF." });
      setDialogEksporTerbuka(false);
      return;
    }
    setDialogEksporTerbuka(false); // Close the dialog after export
  };

  // --- NEW IMPORT FUNCTIONALITY ---
  const imporCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true, // Assuming the first row is headers
        skipEmptyLines: true,
        complete: async (results: { data: any[]; errors: any[]; meta: any }) => {
          const importedData = results.data as any[];
          const errors: string[] = [];
          // const successCount = 0; // This variable was declared but not used.

          for (const row of importedData) {
            // Basic validation and mapping for EmployeePayload
            const payload: EmployeePayload = {
              first_name: row["Nama Depan"] || "",
              last_name: row["Nama Belakang"] || "",
              gender: row["Jenis Kelamin"] === "Laki-Laki" ? "M" : "F", // Assuming "Laki-Laki" or "Perempuan"
              user_id: row["No. Karyawan"] || undefined,
              mobile_number: row["Nomor Telepon"] || undefined,
              nik: row["NIK"] || undefined,
              birth_place: row["Tempat Lahir"] || undefined,
              birth_date: row["Tanggal Lahir"] || undefined, // You might need date parsing logic here
              education: row["Pendidikan"] || undefined,
              position: row["Posisi"] || undefined,
              grade: row["Grade"] || undefined,
              branch: row["Cabang"] || undefined,
              contract_type: (row["Tipe Kontrak"] as "Tetap" | "Kontrak" | "Lepas") || undefined,
              bank: row["Bank"] || undefined,
              bank_account_number: row["Nomor Rekening"] || undefined,
              bank_account_name: row["Nama Rekening"] || undefined,
              sp_type: row["Tipe SP"] || undefined,
              status: (row["Status"] as "Aktif" | "Tidak Aktif") || undefined,
              // avatar is not typically imported via CSV
            };

            // Minimal validation before sending to API
            if (!payload.first_name || !payload.last_name || !payload.gender || !payload.position || !payload.branch || !payload.grade || !payload.status) {
              errors.push(`Baris ${importedData.indexOf(row) + 2}: Data penting tidak lengkap. Lewati.`);
              continue;
            }

            try {
              await axiosInstance.post("/employees", payload);
              // successCount++; // Increment if needed for a summary
            } catch (apiError: any) {
              const errorMsg = apiError.response?.data?.message || apiError.message || "Unknown error";
              errors.push(`Baris ${importedData.indexOf(row) + 2}: Gagal menambahkan karyawan - ${errorMsg}`);
            }
          }

          if (errors.length > 0) {
            toast.error("Import Sebagian Berhasil / Gagal", {
              description: `Beberapa data mungkin tidak diimpor. Detail: ${errors.join(", ")}`,
              duration: 5000,
            });
          } else {
            toast.success("Import Berhasil!", {
              description: "Semua data karyawan dari CSV berhasil ditambahkan.",
            });
          }
          ambilKaryawan(); // Refresh data after import attempt
          event.target.value = ""; // Clear file input
        },
        error: (err: any) => {
          toast.error("Gagal Membaca CSV", {
            description: `Terjadi kesalahan saat membaca file CSV: ${err.message}`,
          });
        },
      });
    }
  };

  // Ubah filter logic agar support array dan custom value
  const karyawanTersaring = daftarKaryawan.filter((emp) => {
    // Search by name, NIK, or phone number
    const search = kataKunci.toLowerCase();
    const matchName = `${emp.first_name || ""} ${emp.last_name || ""}`.toLowerCase().includes(search);
    const matchNik = (emp.nik || "").toLowerCase().includes(search);
    const matchPhone = (emp.mobile_number || emp.phone || "").toLowerCase().includes(search);

    const matchSearch = !kataKunci ? true : matchName || matchNik || matchPhone;

    const matchGender = filterGender.length === 0 ? true : filterGender.some((g) => emp.gender && g.toLowerCase() === emp.gender.toLowerCase()) || (genderKustom && emp.gender?.toLowerCase() === genderKustom.toLowerCase());

    const matchStatus = filterStatus.length === 0 ? true : filterStatus.some((s) => emp.status && s.toLowerCase() === emp.status.toLowerCase()) || (statusKustom && emp.status?.toLowerCase() === statusKustom.toLowerCase());

    const matchBranch = filterCabang.length === 0 ? true : filterCabang.some((b) => emp.branch && b.toLowerCase() === emp.branch.toLowerCase()) || (cabangKustom && emp.branch?.toLowerCase() === cabangKustom.toLowerCase());

    return matchSearch && matchGender && matchStatus && matchBranch;
  });

  const indexAkhir = halamanSaatIni * itemPerHalaman;
  const indexAwal = indexAkhir - itemPerHalaman;
  const karyawanSaatIni = karyawanTersaring.slice(indexAwal, indexAkhir);
  const totalHalaman = Math.ceil(karyawanTersaring.length / itemPerHalaman);

  const ambilInisial = (firstName: string, lastName: string) => {
    const first = firstName ? firstName.charAt(0) : "";
    const last = lastName ? lastName.charAt(0) : "";
    return `${first}${last}`.toUpperCase();
  };

  // Helper function to render filter tags
  const renderFilterTags = (
    title: string,
    options: string[],
    selectedFilters: string[],
    setFilters: React.Dispatch<React.SetStateAction<string[]>>,
    customValue: string,
    setCustomValue: React.Dispatch<React.SetStateAction<string>>,
    displayMap?: { [key: string]: string } // Optional map for display names
  ) => (
    <div>
      <div className="font-semibold text-xs mb-1">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`px-3 py-1 rounded-full text-xs transition-colors ${selectedFilters.includes(option) ? "bg-[#1E3A5F] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            onClick={() => {
              setFilters((prev) => (prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]));
              if (customValue.toLowerCase() === option.toLowerCase()) {
                setCustomValue("");
              }
            }}
          >
            {displayMap ? displayMap[option] : option}
          </button>
        ))}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`Custom ${title.toLowerCase()}`}
            value={customValue}
            onChange={(e) => {
              const newCustomValue = e.target.value;
              setCustomValue(newCustomValue);
              // Add to filter if not empty and not already selected as a predefined option
              if (newCustomValue && !options.map((o) => o.toLowerCase()).includes(newCustomValue.toLowerCase()) && !selectedFilters.includes(newCustomValue)) {
                setFilters((prev) => [...prev, newCustomValue]);
              } else if (!newCustomValue) {
                // If custom input is cleared, remove its old value from filters
                setFilters((prev) => prev.filter((v) => v.toLowerCase() !== customValue.toLowerCase()));
              }
            }}
            className="border px-3 py-1 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
            style={{ minWidth: "120px" }}
          />
        </div>
      </div>
    </div>
  );

  if (kesalahan) return <div className="p-4 text-red-500">{kesalahan}</div>;

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar variant="inset" />
        <SidebarInset className="flex-1 flex flex-col">
          {/* Jadikan SiteHeader sticky */}
          <div className="sticky top-0 z-30 bg-white">
            <SiteHeader />
          </div>
          {/* Konten utama scrollable */}
          <div className="flex-1 min-h-0">
            <main className="p-2 sm:p-4">
              <section className="flex flex-col gap-4 py-2 md:gap-6 md:py-0">
                <div className="bg-white rounded-xl border shadow px-1 sm:px-2 py-2 sm:py-4 flex flex-col gap-2 w-full">
                  <div className="flex-1 overflow-auto">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                      {/* ...konten employee di sini... */}
                      <section
                        className="
                          flex flex-col gap-4 px-2 sm:px-4 py-2 sm:py-4
                          lg:flex-row lg:justify-between lg:items-center lg:gap-4 lg:px-10
                        "
                      >
                        <h2
                          className="
                            font-semibold text-base sm:text-lg whitespace-nowrap text-center
                            lg:text-left
                          "
                        >
                          Informasi Seluruh Karyawan
                        </h2>
                        <div
                          className="
                            flex flex-col sm:flex-row sm:gap-3 sm:items-center sm:w-auto sm:flex-1 w-full gap-3
                          "
                          style={{ flexWrap: "wrap" }}
                        >
                          {/* Search dan Filter sebaris */}
                          <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto sm:flex-1 sm:items-center">
                            <input type="text" placeholder="Search..." value={kataKunci} onChange={(e) => setKataKunci(e.target.value)} className="px-3 py-1 border rounded text-xs h-8 focus:outline-none focus:border-[#1E3A5F] w-full min-w-0 sm:w-auto" style={{ minHeight: "2rem" }} />
                            <Dialog open={dialogFilterTerbuka} onOpenChange={setDialogFilterTerbuka}>
                              <DialogTrigger asChild>
                                <button className="px-3 py-1 rounded border-none bg-transparent text-[#1E3A5F] flex items-center group hover:text-[#2563eb] text-xs h-8" style={{ minHeight: "2rem" }}>
                                  <Filter size={12} className="mr-1 transition-colors group-hover:text-[#2563eb]" /> Filter
                                </button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Filter Data Karyawan</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-4 py-2">
                                  {/* Gender Filter */}
                                  {renderFilterTags(
                                    "Jenis Kelamin",
                                    ["M", "F"], // Internal values
                                    filterGender,
                                    setFilterGender,
                                    genderKustom,
                                    setGenderKustom,
                                    { M: "Laki-Laki", F: "Perempuan" } // Display map for user-friendly labels
                                  )}

                                  {/* Status Filter */}
                                  {renderFilterTags("Status", ["Aktif", "Tidak Aktif"], filterStatus, setFilterStatus, statusKustom, setStatusKustom)}

                                  {/* Branch Filter */}
                                  {renderFilterTags(
                                    "Cabang",
                                    [...new Set(daftarKaryawan.map((emp) => emp.branch).filter(Boolean))] as string[], // Extract unique non-empty branches
                                    filterCabang,
                                    setFilterCabang,
                                    cabangKustom,
                                    setCabangKustom
                                  )}
                                </div>
                                <DialogFooter>
                                  <button
                                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs"
                                    onClick={() => {
                                      setFilterGender([]);
                                      setFilterStatus([]);
                                      setFilterCabang([]);
                                      setGenderKustom("");
                                      setStatusKustom("");
                                      setCabangKustom("");
                                    }}
                                    type="button"
                                  >
                                    Reset
                                  </button>
                                  <DialogClose asChild>
                                    <button className="px-3 py-1 rounded bg-[#1E3A5F] text-white text-xs" type="button">
                                      Terapkan
                                    </button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          {/* Export, Import, Tambah Data sebaris */}
                          <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto sm:items-center sm:justify-end justify-start">
                            <Dialog open={dialogEksporTerbuka} onOpenChange={setDialogEksporTerbuka}>
                              <DialogTrigger asChild>
                                <button className="px-3 py-1 border border-[#1E3A5F] text-[#1E3A5F] rounded hover:bg-[#1E3A5F] hover:text-white transition text-xs h-8 flex items-center" style={{ minHeight: "2rem" }} onClick={() => setDialogEksporTerbuka(true)}>
                                  <Upload size={12} className="mr-1" /> Export
                                </button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Pilih Format Export</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-2 py-4">
                                  <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" onClick={() => eksporData("xlsx")}>
                                    Export ke Excel (XLSX)
                                  </button>
                                  <button className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition" onClick={() => eksporData("csv")}>
                                    Export ke CSV
                                  </button>
                                  <button className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition" onClick={() => eksporData("pdf")}>
                                    Export ke PDF
                                  </button>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs" type="button">
                                      Batal
                                    </button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <label className="px-3 py-1 border border-[#1E3A5F] text-[#1E3A5F] rounded hover:bg-[#1E3A5F] hover:text-white transition text-xs h-8 flex items-center cursor-pointer" style={{ minHeight: "2rem" }}>
                              <Download size={12} className="mr-1" /> Import
                              <input type="file" className="hidden" accept=".csv" onChange={imporCSV} />
                            </label>
                            <Sheet open={sheetBuatTerbuka} onOpenChange={setSheetBuatTerbuka}>
                              <SheetTrigger asChild>
                                <button type="button" className="px-3 py-1 bg-[#1E3A5F] text-white rounded transition flex items-center border border-transparent hover:bg-white hover:text-[#1E3A3F] hover:border-[#1E3A5F] text-xs h-8" style={{ minHeight: "2rem" }}>
                                  <Plus size={12} className="mr-1" /> Tambah Data
                                </button>
                              </SheetTrigger>
                              <SheetContent className="p-0 sm:max-w-3xl overflow-y-auto">
                                <SheetHeader className="p-6 pb-4 sticky top-0 bg-background z-10 border-b">
                                  <SheetTitle>Tambah Data Karyawan Baru</SheetTitle>
                                </SheetHeader>
                                <div className="p-6 pt-2">
                                  <EmployeeForm onSubmit={submitBuat} onCancel={() => setSheetBuatTerbuka(false)} />
                                </div>
                              </SheetContent>
                            </Sheet>
                          </div>
                        </div>
                      </section>

                      {/* --- 2. IMPLEMENTASI SKELETON DI SINI --- */}
                      <section className="px-1 sm:px-6 pb-4 sm:pb-6 overflow-x-auto">
                        {memuat ? (
                          // Tampilkan skeleton jika loading
                          <EmployeeTableSkeleton />
                        ) : (
                          // Tampilkan tabel jika sudah selesai loading
                          <>
                            {/* Tampilkan pesan jika hasil filter kosong */}
                            {karyawanTersaring.length === 0 ? (
                              <div className="w-full text-center py-12 text-gray-500 font-semibold">Tidak ada data karyawan ditemukan.</div>
                            ) : (
                              <div className="w-full overflow-x-auto">
                                <Table className="min-w-[900px] w-full">
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead style={{ width: 40, minWidth: 40, maxWidth: 40 }} className="text-center whitespace-nowrap">
                                        No
                                      </TableHead>
                                      <TableHead className="min-w-[60px] w-[4%] text-center">Avatar</TableHead>
                                      <TableHead className="min-w-[120px] w-[16%]">Nama</TableHead>
                                      <TableHead className="min-w-[100px] w-[10%] text-center">Jenis Kelamin</TableHead>
                                      <TableHead className="min-w-[120px] w-[10%]">Nomor Telepon</TableHead>
                                      <TableHead className="min-w-[120px] w-[13%]">Cabang</TableHead>
                                      <TableHead className="min-w-[120px] w-[13%]">Jabatan</TableHead>
                                      <TableHead className="min-w-[80px] w-[13%]">Grade</TableHead>
                                      <TableHead className="min-w-[80px] w-[8%] text-center">Status</TableHead>
                                      <TableHead className="min-w-[80px] w-[8%] text-center">Detail</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {karyawanSaatIni.length === 0 ? (
                                      <TableRow>
                                        <TableCell colSpan={10} className="text-center py-8">
                                          Tidak ada data karyawan ditemukan.
                                        </TableCell>
                                      </TableRow>
                                    ) : (
                                      karyawanSaatIni.map((emp, i) => (
                                        <TableRow key={emp.id} className="border-b-[6px] border-white">
                                          <TableCell style={{ width: 40, minWidth: 40, maxWidth: 40 }} className="text-center whitespace-nowrap">
                                            {(indexAwal + i + 1).toString()}
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
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-500">{ambilInisial(emp.first_name, emp.last_name)}</div>
                                              )}
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            {emp.first_name} {emp.last_name}
                                          </TableCell>
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
                                          <TableCell className="text-center">
                                            <button
                                              type="button"
                                              className="px-3 py-1 rounded transition text-xs cursor-pointer"
                                              style={{
                                                backgroundColor: "white",
                                                border: "1.5px solid #1E3A5F", // outline berkeley blue
                                                minWidth: "64px",
                                                fontSize: "0.75rem", // kecilin font
                                                outline: "none",
                                              }}
                                              onClick={() => bukaSheetLihat(emp)}
                                            >
                                              View
                                            </button>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-sm text-gray-700">Menampilkan</span>
                                <Select
                                  value={itemPerHalaman.toString()}
                                  onValueChange={(value) => {
                                    setItemPerHalaman(Number(value));
                                    setHalamanSaatIni(1);
                                  }}
                                >
                                  <SelectTrigger id="items-per-page" className="w-auto min-w-[60px]">
                                    <SelectValue placeholder={itemPerHalaman.toString()} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="text-sm text-gray-700 w-full sm:w-auto text-center sm:text-left">
                                Menampilkan {karyawanTersaring.length > 0 ? indexAwal + 1 : 0} sampai {Math.min(indexAkhir, karyawanTersaring.length)} dari {karyawanTersaring.length} karyawan
                              </div>
                              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px w-full sm:w-auto justify-center sm:justify-start">
                                <button disabled={halamanSaatIni === 1} onClick={() => setHalamanSaatIni(halamanSaatIni - 1)} className="px-3 py-1 border rounded-l text-gray-600 hover:bg-gray-100 disabled:opacity-50">
                                  Previous
                                </button>
                                {totalHalaman > 1 &&
                                  Array.from({ length: totalHalaman }, (_, i) => i + 1).map((pageNumber) => (
                                    <button key={pageNumber} onClick={() => setHalamanSaatIni(pageNumber)} className={`px-3 py-1 border ${halamanSaatIni === pageNumber ? "bg-[#1E3A5F] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                                      {pageNumber}
                                    </button>
                                  ))}
                                <button disabled={halamanSaatIni === totalHalaman || totalHalaman === 0} onClick={() => setHalamanSaatIni(halamanSaatIni + 1)} className="px-3 py-1 border rounded-r text-gray-600 hover:bg-gray-100 disabled:opacity-50">
                                  Next
                                </button>
                              </nav>
                            </div>
                          </>
                        )}
                      </section>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </SidebarInset>
      </div>

      {/* Tambahkan Sheet untuk View */}
      <Sheet
        open={sheetLihatTerbuka}
        onOpenChange={(open) => {
          setSheetLihatTerbuka(open);
          if (!open) {
            setKaryawanDilihat(null);
            setModeEdit(false); // Reset mode saat sheet ditutup
          }
        }}
      >
        <SheetContent className="p-0 sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="p-6 pb-4 sticky top-0 bg-background z-10 border-b flex flex-row items-center justify-between">
            <SheetTitle>{modeEdit ? "Edit Data Karyawan" : "Detail Data Karyawan"}</SheetTitle>
            {karyawanDilihat && (
              <div className="flex gap-2 absolute right-6 top-6">
                {/* Tombol Edit/Cancel Edit */}
                {!modeEdit ? (
                  // Ganti tombol Edit data dengan AlertDialog konfirmasi
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button type="button" className="px-2 py-1 rounded border border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white text-xs">
                        Edit data
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Edit Data</AlertDialogTitle>
                        <AlertDialogDescription>Apakah Anda yakin ingin mengubah data karyawan ini?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => setModeEdit(true)} className="bg-[#1E3A5F] text-white hover:bg-[#2563eb]">
                          Setuju
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <button type="button" className="px-2 py-1 rounded border border-gray-400 text-gray-600 hover:bg-gray-200 text-xs" onClick={() => setModeEdit(false)}>
                    Batal Edit
                  </button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button type="button" className="px-2 py-1 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs" onClick={() => konfirmasiHapusKaryawan(karyawanDilihat)}>
                      Hapus data
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Data Karyawan</AlertDialogTitle>
                      <AlertDialogDescription>Apakah Anda yakin ingin menghapus data karyawan ini? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          setSheetLihatTerbuka(false);
                          eksekusiHapusKaryawan();
                        }}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {/* Reusing the PDF download button for individual view, linking to the old behavior if needed.
                        For a unified experience, you might remove this and direct all downloads through the main "Export" button. */}
                <button type="button" className="px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white text-xs" onClick={() => handleDownloadPDF(karyawanDilihat)}>
                  Download PDF
                </button>
              </div>
            )}
          </SheetHeader>
          <div className="p-6 pt-2">
            {karyawanDilihat && (
              <EmployeeForm
                initialData={{
                  id: karyawanDilihat.id,
                  first_name: karyawanDilihat.first_name,
                  last_name: karyawanDilihat.last_name,
                  gender: karyawanDilihat.gender,
                  email: karyawanDilihat.email ?? "",
                  mobile_number: karyawanDilihat.mobile_number ?? "",
                  nik: karyawanDilihat.nik ?? "",
                  birth_place: karyawanDilihat.birth_place ?? "",
                  birth_date: karyawanDilihat.birth_date ?? "",
                  education: karyawanDilihat.education ?? "",
                  position: karyawanDilihat.position ?? "",
                  grade: karyawanDilihat.grade ?? "",
                  branch: karyawanDilihat.branch ?? "",
                  contract_type: karyawanDilihat.contract_type ?? "",
                  bank: karyawanDilihat.bank ?? "",
                  bank_account_number: karyawanDilihat.bank_account_number ?? "",
                  bank_account_name: karyawanDilihat.bank_account_name ?? "",
                  sp_type: karyawanDilihat.sp_type ?? "",
                  status: karyawanDilihat.status ?? "",
                  avatar: karyawanDilihat.avatar ?? "",
                }}
                onCancel={() => {
                  setSheetLihatTerbuka(false);
                  setKaryawanDilihat(null);
                  setModeEdit(false);
                }}
                onSubmit={async (formData: EmployeeFormData) => {
                  if (modeEdit) {
                    await submitEdit(formData);
                  }
                }}
                readOnly={!modeEdit}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialog Filter (This is the section that was modified) */}
      <Dialog open={dialogFilterTerbuka} onOpenChange={setDialogFilterTerbuka}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Data Karyawan</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            {/* Gender Filter */}
            {renderFilterTags(
              "Jenis Kelamin",
              ["M", "F"], // Internal values
              filterGender,
              setFilterGender,
              genderKustom,
              setGenderKustom,
              { M: "Laki-Laki", F: "Perempuan" } // Display map for user-friendly labels
            )}

            {/* Status Filter */}
            {renderFilterTags("Status", ["Aktif", "Tidak Aktif"], filterStatus, setFilterStatus, statusKustom, setStatusKustom)}

            {/* Branch Filter */}
            {renderFilterTags(
              "Cabang",
              [...new Set(daftarKaryawan.map((emp) => emp.branch).filter(Boolean))] as string[], // Extract unique non-empty branches
              filterCabang,
              setFilterCabang,
              cabangKustom,
              setCabangKustom
            )}
          </div>
          <DialogFooter>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs"
              onClick={() => {
                setFilterGender([]);
                setFilterStatus([]);
                setFilterCabang([]);
                setGenderKustom("");
                setStatusKustom("");
                setCabangKustom("");
              }}
              type="button"
            >
              Reset
            </button>
            <DialogClose asChild>
              <button className="px-3 py-1 rounded bg-[#1E3A5F] text-white text-xs" type="button">
                Terapkan
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

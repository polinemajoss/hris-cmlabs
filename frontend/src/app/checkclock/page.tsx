"use client";

import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/ui/app-sidebar";
import { SiteHeader } from "../../components/ui/site-header";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import AddCheckclockSheet from "../../components/checkclock/CheckclockSheet";
import AttendanceDetailsSheet from "../../components/ui/AttendanceDetailsSheet";
import { CheckclockTableSkeleton } from "@/components/skeletons/CheckclockTableSkeleton";

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
}

interface Attendance {
  name: string;
  jabatan: ReactNode;
  clockIn: ReactNode;
  clockOut: ReactNode;
  workHours: ReactNode;
  approve: boolean;
  id: string;
  employee_id: string;
  type: string;
  attendance_time: string;
  approval_status: "Pending" | "Approved" | "Rejected";
  status: string | null;
  employee: Employee;
  address_detail?: string;
  latitude?: string;
  longitude?: string;
  photo_proof?: string;
}

type CheckclockData = {
  name: string;
  jabatan: string;
  date: string;
  clockIn: string;
  clockOut: string;
  workHours: string;
  approve: boolean;
  status: string;
};

import React, { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import CheckclockSheet from "../../components/checkclock/CheckclockSheet";
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@radix-ui/react-alert-dialog";

export default function CheckclockPage() {
  type AttendanceDetailsData = CheckclockData & {
    id: string;
    location: string;
    address: string;
    lat: string;
    long: string;
    proof: string;
  };
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk UI tidak berubah
  const [selectedDetail, setSelectedDetail] = useState<AttendanceDetailsData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  

  const fetchAttendances = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/attendances");
      setAttendances(response.data.data || []);
    } catch (err) {
      setError("Gagal memuat data absensi.");
      toast.error("Gagal memuat data absensi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  const handleAddAttendance = async (formData: FormData): Promise<boolean> => {
    try {
      // Endpoint '/attendances' ini sudah kita buat di backend sebelumnya
      await axiosInstance.post('/attendances', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Absensi berhasil ditambahkan!');
      fetchAttendances(); // Muat ulang data tabel setelah berhasil
      return true; // Kembalikan true untuk menandakan sukses
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan.';
      // Jika ada error validasi, tampilkan detailnya
      if (error.response?.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat().join('\n');
          toast.error(errorMessage, { description: errors });
      } else {
          toast.error('Gagal Menambah Absensi', { description: errorMessage });
      }
      console.error(error);
      return false; // Kembalikan false untuk menandakan gagal
    }
  };

  const handleViewDetails = (row: Attendance) => {
    const detail: AttendanceDetailsData = {
      id: row.id,
      name: `${row.employee.first_name} ${row.employee.last_name}`,
      jabatan: row.employee.position,
      date: new Date(row.attendance_time).toLocaleDateString("id-ID"),
      clockIn: new Date(row.attendance_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      clockOut: "-", // Data ini perlu dihitung atau diambil dari record lain
      workHours: "-", // Data ini perlu dihitung
      approve: row.approval_status === "Approved",
      status: row.status || "N/A",
      location: "Kantor Pusat", // Ganti dengan data lokasi jika ada
      address: row.address_detail || "Tidak ada data",
      lat: row.latitude || "Tidak ada data",
      long: row.longitude || "Tidak ada data",
      proof: row.photo_proof || "",
    };
    setSelectedDetail(detail);
    setIsDetailOpen(true);
  };

  const filteredData = attendances.filter((row) => {
    const fullName = `${row.employee.first_name} ${row.employee.last_name}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) || row.employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? row.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async () => {
    if (!selectedDetail) return;
    try {
      await axiosInstance.post(`/api/attendances/${selectedDetail.id}/approve`);
      toast.success("Absensi berhasil di-approve!");
      fetchAttendances(); // Muat ulang data
      setIsDetailOpen(false); // Tutup sheet detail
    } catch (error: unknown) {
      toast.error("Gagal melakukan approval.");
      console.error(error);
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

  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
        <div className="flex-1 min-h-screen bg-gray-50">
          <div className="w-full">
            <SiteHeader />
          </div>
          <main className="p-4">
            <section className="flex flex-col gap-4 py-4 md:gap-6 md:py-0">
              <div className="bg-white rounded-xl border shadow px-8 py-6 flex flex-col gap-2 w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h2 className="font-semibold text-lg whitespace-nowrap">Checkclock Overview</h2>
                  <div className="flex gap-3 flex-1">
                    <input type="text" placeholder="Search Employee" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-3 py-1 border rounded text-xs h-8 focus:outline-none focus:border-[#1E3A5F] flex-1 min-w-0" style={{ minHeight: "2rem" }} />
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-1 border rounded text-xs h-8 focus:outline-none focus:border-[#1E3A5F]" style={{ minHeight: "2rem" }}>
                      <option value="">All Status</option>
                      <option value="Waiting Approval">Waiting Approval</option>
                      <option value="On Time">On Time</option>
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                    </select>
                    <AddCheckclockSheet onAddAttendance={handleAddAttendance} />
                  </div>
                </div>

                <div className="overflow-x-auto mt-4">
                  {loading ? (
                    // Tampilkan skeleton jika loading
                    <CheckclockTableSkeleton />
                  ) : error ? (
                    // Tampilkan pesan error jika ada masalah
                    <div className="text-center py-10 text-red-500">{error}</div>
                  ) : (
                    // Tampilkan tabel jika data sudah siap
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Karyawan</TableHead>
                          <TableHead>Jabatan</TableHead>
                          <TableHead>Waktu Kehadiran</TableHead>
                          <TableHead>Tipe</TableHead>
                          <TableHead>Persetujuan</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Rincian</TableHead>
                          {/* <TableHead className="w-[12%] text-center">Action</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.length > 0 ? (
                          filteredData.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell>{`${row.employee.first_name} ${row.employee.last_name}`}</TableCell>
                              <TableCell>{row.employee.position}</TableCell>
                              <TableCell>{new Date(row.attendance_time).toLocaleString("id-ID")}</TableCell>
                              <TableCell>{row.type}</TableCell>
                              <TableCell>
                                <span className={row.approval_status === "Approved" ? "text-green-600" : "text-gray-500"}>{row.approval_status}</span>
                              </TableCell>
                              <TableCell>
                                <span className="px-2 py-1 rounded text-xs border">{row.status || "N/A"}</span>
                              </TableCell>
                              <TableCell>
                                <button className="border px-3 py-1 rounded" onClick={() => handleViewDetails(row)}>View</button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center">Tidak ada data absensi ditemukan.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>

                {/* Attendance Details Sheet */}
                <AttendanceDetailsSheet
                  data={
                    selectedDetail
                      ? {
                          id: selectedDetail.id,
                          name: selectedDetail.name,
                          jabatan: selectedDetail.jabatan,
                          date: selectedDetail.date,
                          clockIn: selectedDetail.clockIn,
                          clockOut: selectedDetail.clockOut,
                          workHours: selectedDetail.workHours,
                          approve: selectedDetail.approve,
                          status: selectedDetail.status || "N/A",
                          location: selectedDetail.location || "N/A",
                          address: selectedDetail.address || "N/A",
                          lat: selectedDetail.lat || "N/A",
                          long: selectedDetail.long || "N/A",
                          proof: selectedDetail.proof || "",
                        }
                      : null
                  }
                  isOpen={isDetailOpen}
                  onClose={() => setIsDetailOpen(false)}
                  onApprove={handleApprove}
                />
                {/* Pagination, dst */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <select className="border rounded px-2 py-1">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                  <div>Showing 1 to 10 out of {filteredData.length} records</div>
                  <div className="flex space-x-1">
                    <button className="px-2 py-1 border rounded hover:bg-gray-100">&lt;</button>
                    <button className="px-2 py-1 border rounded bg-gray-200">1</button>
                    <button className="px-2 py-1 border rounded hover:bg-gray-100">2</button>
                    <button className="px-2 py-1 border rounded hover:bg-gray-100">3</button>
                    <button className="px-2 py-1 border rounded hover:bg-gray-100">&gt;</button>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}



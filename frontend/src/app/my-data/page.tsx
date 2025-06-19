// frontend/src/components/employee/EmployeeProfilePage.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/ui/app-sidebar";
import { SiteHeader } from "../../components/ui/site-header";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmployeeTableSkeleton } from "@/components/skeletons/EmployeeTableSkeleton"; // Untuk loading
import { RefreshCw } from "lucide-react"; // Untuk ikon refresh
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AvatarUploader } from "@/components/ui/AvatarUploader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";

// Interface Employee ini harus konsisten dengan yang ada di page.tsx dan EmployeeAdminDashboard.tsx
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

export default function EmployeeProfilePage() {
  const { user, loading: authLoading } = useAuth(); // Menggunakan user dari AuthContext
  const [myProfileData, setMyProfileData] = useState<Employee | null>(null);
  const [memuat, setMemuat] = useState(true);
  const [kesalahan, setKesalahan] = useState<string | null>(null);
  const [isEditingOwnProfile, setIsEditingOwnProfile] = useState(false); // State untuk mode edit profil sendiri
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false); // Tambahkan state untuk dirty flag di komponen utama

  const fetchMyProfileData = useCallback(async () => {
    setMemuat(true);
    setKesalahan(null);
    try {
      // IDEALNYA: Backend Anda memiliki endpoint khusus untuk mengambil profil karyawan yang sedang login.
      // Contoh endpoint: GET /api/employees/my-profile
      // Jika tidak ada, Anda bisa memfilter dari daftar semua karyawan jika endpoint GET /employees?user_id={id} tersedia.
      const res = await axiosInstance.get(`/employees`, {
        params: {
          user_id: user?.id, // Mengirim user_id dari user yang login sebagai parameter filter
        },
      });

      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        // Asumsi backend Anda akan memfilter berdasarkan user_id dan mengembalikan array
        // Kita cari profil yang user_id-nya cocok dengan user yang login.
        const foundProfile = res.data.find((emp: Employee) => emp.user_id === user?.id);
        if (foundProfile) {
          setMyProfileData(foundProfile);
        } else {
          setKesalahan("Data profil Anda tidak ditemukan. Pastikan Anda memiliki data karyawan terkait.");
        }
      } else {
        setKesalahan("Data profil Anda tidak ditemukan. Pastikan Anda memiliki data karyawan terkait.");
      }
    } catch (err: unknown) {
      // Lebih spesifik untuk error Axios
      if (axios.isAxiosError(err)) {
        setKesalahan(`Gagal memuat data profil Anda: ${err.response?.data?.message || err.message}`);
      } else if (err instanceof Error) {
        setKesalahan(`Gagal memuat data profil Anda: ${err.message}`);
      } else {
        setKesalahan("Gagal memuat data profil Anda: Unknown error");
      }
      console.error("Error fetching my profile:", err);
    } finally {
      setMemuat(false);
    }
  }, [user?.id]); // Dependensi pada user.id

  useEffect(() => {
    // Hanya fetch data jika autentikasi sudah selesai dan user.id tersedia
    if (!authLoading && user?.id) {
      fetchMyProfileData();
    }
  }, [authLoading, user?.id, fetchMyProfileData]); // Dependensi pada user.id dan fetchMyProfileData

  const handleSubmitMyProfile = async (formData: Employee) => {
    if (!myProfileData?.id) {
      toast.error("Aksi Tidak Valid", { description: "Profil Anda tidak dapat diupdate karena ID tidak ditemukan." });
      return;
    }

    try {
      // Asumsi endpoint PUT /employees/{id} mengizinkan karyawan mengupdate profilnya sendiri via Policy/otorisasi
      // Penting: Pastikan formData memiliki semua data yang diperlukan backend untuk update,
      // termasuk user_id jika itu digunakan di backend untuk identifikasi.
      const payload = {
        ...formData,
        user_id: user?.id, // Pastikan user_id dari user yang login disertakan
      };

      await axiosInstance.put(`/employees/${myProfileData.id}`, payload); // Gunakan ID profil yang sedang diedit
      toast.success("Profil Anda berhasil diperbarui!");
      setMyProfileData(formData as Employee); // Perbarui state dengan data terbaru
      setIsEditingOwnProfile(false); // Keluar dari mode edit
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Gagal memperbarui profil Anda.";
      toast.error("Gagal Memperbarui Profil", { description: errorMsg });
      console.error("Error updating my own profile:", error);
    }
  };

  // Skeleton khusus untuk halaman profil karyawan, menyesuaikan struktur form profil
  function EmployeeProfileSkeleton() {
    return (
      <div className="flex h-screen">
        <div className="w-64 bg-gray-100 animate-pulse" />
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-gray-100 animate-pulse" />
          <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center">
            <section className="bg-white rounded-xl border shadow p-6 w-full max-w-2xl relative">
              {/* Tombol Edit Profil Skeleton */}
              <div className="absolute top-6 right-6">
                <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse" /> {/* Judul */}
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-gray-200 animate-pulse" />
                </div>
                {/* Field skeletons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" /> {/* Nama Depan */}
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" /> {/* Nama Belakang */}
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" /> {/* Gender */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* Email */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* Mobile Number */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* NIK */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* Birth Place */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* Birth Date */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* Education */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* Position */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* Grade */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* Branch */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* Contract Type */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* Bank */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* Bank Account Number */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* Bank Account Name */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* SP Type */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" /> {/* Status */}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // Ganti SimpleProfileForm dengan form lengkap seperti EmployeeForm, tanpa import dari file lain
  function MyEmployeeForm({
    onSubmit,
    onCancel,
    initialData,
    isEditMode = false,
    readOnly = false,
    onDirtyChange, // tambahkan prop ini
  }: {
    onSubmit: (formData: any) => void;
    onCancel: () => void;
    initialData?: any | null;
    isEditMode?: boolean;
    readOnly?: boolean;
    onDirtyChange?: (dirty: boolean) => void; // tambahkan prop ini
  }) {
    const genderOptions = [
      { value: "M", label: "Laki-laki" },
      { value: "F", label: "Perempuan" },
    ];
    const pendidikanOptions = [
      { value: "SMA/SMK", label: "SMA/SMK" },
      { value: "D3", label: "D3" },
      { value: "S1", label: "S1" },
      { value: "S2", label: "S2" },
      { value: "S3", label: "S3" },
    ];
    const kontrakOptions = [
      { value: "Tetap", label: "Tetap" },
      { value: "Kontrak", label: "Kontrak" },
      { value: "Lepas", label: "Lepas" },
    ];
    const bankOptions = [
      { value: "BCA", label: "BCA" },
      { value: "BNI", label: "BNI" },
      { value: "BRI", label: "BRI" },
      { value: "Mandiri", label: "Mandiri" },
      { value: "CIMB Niaga", label: "CIMB Niaga" },
    ];
    const spOptions = [
      { value: "SP 1", label: "SP 1" },
      { value: "SP 2", label: "SP 2" },
      { value: "SP 3", label: "SP 3" },
      { value: "Tidak Ada", label: "Tidak Ada SP" },
    ];
    const statusOptions = [
      { value: "Aktif", label: "Aktif" },
      { value: "Tidak Aktif", label: "Tidak Aktif" },
    ];

    const [form, setForm] = useState<any>(() => {
      return (
        initialData || {
          email: user?.email || "",
          first_name: "",
          last_name: "",
          mobile_number: "",
          nik: "",
          gender: "",
          education: "",
          birth_place: "",
          birth_date: null,
          position: "",
          branch: "",
          contract_type: "Kontrak",
          grade: "",
          bank: "",
          bank_account_number: "",
          bank_account_name: "",
          sp_type: "",
          status: "Aktif",
          avatar: "",
        }
      );
    });

    // Tambahkan state untuk dirty check
    const [isDirty, setIsDirty] = useState(false);

    // Cek perubahan form dibanding initialData
    useEffect(() => {
      if (!initialData) {
        if (isDirty) {
          setIsDirty(false);
          onDirtyChange && onDirtyChange(false);
        }
        return;
      }
      // Bandingkan field yang relevan
      const isChanged =
        JSON.stringify({
          ...initialData,
          email: user?.email || initialData.email || "",
        }) !== JSON.stringify(form);
      if (isDirty !== isChanged) {
        setIsDirty(isChanged);
        onDirtyChange && onDirtyChange(isChanged);
      }
    }, [form, initialData, user?.email, onDirtyChange]); // dirty check

    // Only update form state from initialData if the id changes
    useEffect(() => {
      if (initialData && initialData.id !== form.id) {
        setForm({
          ...initialData,
          email: user?.email || initialData.email || "",
        });
      } else if (!initialData && user?.email && form.email !== user.email) {
        setForm((prev: any) => ({
          ...prev,
          email: user.email,
        }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData, user?.email]); // do NOT depend on form here

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: Date | undefined) => {
      const formattedBirthDate = date ? date.toISOString().split("T")[0] : null;
      setForm((prev: any) => ({ ...prev, birth_date: formattedBirthDate }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(form);
    };

    const [isUploading, setIsUploading] = useState(false);

    // Ubah handleAvatarUpload agar menerima file, bukan event
    const handleAvatarUpload = async (file: File) => {
      if (!file) {
        setForm((prev: any) => ({ ...prev, avatar: "" }));
        return;
      }
      setIsUploading(true);
      setTimeout(() => {
        setForm((prev: any) => ({ ...prev, avatar: URL.createObjectURL(file) }));
        setIsUploading(false);
      }, 1000);
    };

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialData && initialData.birth_date ? new Date(initialData.birth_date) : undefined);

    useEffect(() => {
      if (form.birth_date) {
        const date = new Date(form.birth_date);
        if (!isNaN(date.getTime())) {
          setSelectedDate(date);
        } else {
          setSelectedDate(undefined);
        }
      } else {
        setSelectedDate(undefined);
      }
    }, [form.birth_date]);

    return (
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Bagian Avatar */}
        <div className="col-span-2 flex justify-center">
          <AvatarUploader
            onFileSelect={(file) => {
              if (!readOnly) {
                if (file) {
                  handleAvatarUpload(file);
                } else {
                  setForm((prev: any) => ({ ...prev, avatar: "" }));
                }
              }
            }}
            initialImageUrl={form.avatar}
            readOnly={readOnly} // <-- tambahkan prop ini jika AvatarUploader mendukung
            canEdit={!readOnly} // <-- jika AvatarUploader mendukung prop custom untuk kontrol edit/hapus
          />
          {isUploading && <p className="text-xs text-blue-600 mt-2">Mengupload avatar...</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name" className="mb-1">
              Nama Depan
            </Label>
            <Input id="first_name" name="first_name" placeholder="Masukkan nama depan" value={form.first_name} onChange={handleChange} required readOnly={readOnly} disabled={readOnly} />
          </div>
          <div>
            <Label htmlFor="last_name" className="mb-1">
              Nama Belakang
            </Label>
            <Input id="last_name" name="last_name" placeholder="Masukkan nama belakang" value={form.last_name} onChange={handleChange} required readOnly={readOnly} disabled={readOnly} />
          </div>
          <div>
            <Label htmlFor="mobile_number" className="mb-1">
              Nomor Telepon
            </Label>
            <Input id="mobile_number" name="mobile_number" placeholder="Masukkan nomor ponsel" value={form.mobile_number} onChange={handleChange} required readOnly={readOnly} disabled={readOnly} />
          </div>
          <div>
            <Label htmlFor="email" className="mb-1">
              Email
            </Label>
            <Input id="email" name="email" type="email" placeholder="contoh@perusahaan.com" value={user?.email || form.email || ""} readOnly disabled />
          </div>
          <div>
            <Label htmlFor="nik" className="mb-1">
              NIK
            </Label>
            <Input id="nik" name="nik" placeholder="Masukkan NIK" value={form.nik} onChange={handleChange} required readOnly={readOnly} disabled={readOnly} />
          </div>
          <div>
            <Label htmlFor="gender" className="mb-1">
              Jenis Kelamin
            </Label>
            <Select value={form.gender} onValueChange={(value) => handleSelectChange("gender", value)} disabled={readOnly}>
              <SelectTrigger id="gender" className="w-full min-w-0">
                <SelectValue placeholder="Pilih Jenis Kelamin" />
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
            <Label htmlFor="education" className="mb-1">
              Pendidikan Terakhir
            </Label>
            <Select value={form.education} onValueChange={(value) => handleSelectChange("education", value)} disabled={readOnly}>
              <SelectTrigger id="education" className="w-full min-w-0">
                <SelectValue placeholder="Pilih Pendidikan Terakhir" />
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
            <Label htmlFor="birth_place" className="mb-1">
              Tempat Lahir
            </Label>
            <Input id="birth_place" name="birth_place" placeholder="Masukkan tempat lahir" value={form.birth_place} onChange={handleChange} required readOnly={readOnly} disabled={readOnly} />
          </div>
          <div>
            <Label htmlFor="birth_date" className="mb-1">
              Tanggal Lahir
            </Label>
            <Input id="birth_date" type="date" name="birth_date" value={form.birth_date || ""} onChange={handleChange} disabled={readOnly} />
          </div>
          <div>
            <Label htmlFor="position" className="mb-1">
              Jabatan
            </Label>
            <Input id="position" name="position" placeholder="Masukkan posisi/jabatan" value={form.position} onChange={handleChange} required readOnly disabled />
          </div>
          <div>
            <Label htmlFor="branch" className="mb-1">
              Cabang
            </Label>
            <Input id="branch" name="branch" placeholder="Masukkan cabang" value={form.branch} onChange={handleChange} required readOnly disabled />
          </div>
          <div>
            <Label htmlFor="contract_type" className="mb-1">
              Tipe Kontrak
            </Label>
            <Select value={form.contract_type} onValueChange={(value) => handleSelectChange("contract_type", value)} disabled={readOnly}>
              <SelectTrigger id="contract_type" className="w-full min-w-0">
                <SelectValue placeholder="Pilih Tipe Kontrak" />
              </SelectTrigger>
              <SelectContent>
                {kontrakOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="grade" className="mb-1">
              Grade
            </Label>
            <Input id="grade" name="grade" placeholder="Masukkan grade" value={form.grade} onChange={handleChange} required readOnly disabled />
          </div>
          <div>
            <Label htmlFor="bank" className="mb-1">
              Bank
            </Label>
            <Select value={form.bank} onValueChange={(value) => handleSelectChange("bank", value)} disabled={readOnly}>
              <SelectTrigger id="bank" className="w-full min-w-0">
                <SelectValue placeholder="Pilih bank" />
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
            <Label htmlFor="bank_account_number" className="mb-1">
              Nomor Rekening
            </Label>
            <Input id="bank_account_number" name="bank_account_number" placeholder="Masukkan nomor rekening" value={form.bank_account_number} onChange={handleChange} required readOnly={readOnly} disabled={readOnly} />
          </div>
          <div>
            <Label htmlFor="bank_account_name" className="mb-1">
              Atas Nama Rekening
            </Label>
            <Input id="bank_account_name" name="bank_account_name" placeholder="Masukkan nama pemilik rekening" value={form.bank_account_name} onChange={handleChange} required readOnly={readOnly} disabled={readOnly} />
          </div>
          <div>
            <Label htmlFor="sp_type" className="mb-1">
              Tipe SP
            </Label>
            <Select value={form.sp_type} onValueChange={(value) => handleSelectChange("sp_type", value)} disabled>
              <SelectTrigger id="sp_type" className="w-full min-w-0">
                <SelectValue placeholder="Pilih tipe SP" />
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
          <div>
            <Label htmlFor="status" className="mb-1">
              Status Karyawan
            </Label>
            <Select value={form.status} onValueChange={(value) => handleSelectChange("status", value)} disabled>
              <SelectTrigger id="status" className="w-full min-w-0">
                <SelectValue placeholder="Pilih status karyawan" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
    );
  } // <-- Add this closing brace for MyEmployeeForm

  // Tangani loading dari AuthContext atau loading data profil
  if (authLoading || memuat) {
    return <EmployeeProfileSkeleton />; // Ganti skeleton dengan yang lebih spesifik
  }

  // Tampilkan error jika gagal memuat data profil
  if (kesalahan) {
    return (
      <div className="p-4 text-red-500 flex flex-col items-center justify-center h-screen">
        <p>{kesalahan}</p>
        <Button onClick={fetchMyProfileData} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" /> Coba Lagi
        </Button>
      </div>
    );
  }

  // Jika data profil belum tersedia setelah loading selesai (misal, user_id tidak punya employee record)
  if (!myProfileData) {
    return <div className="p-4 text-gray-500 flex items-center justify-center h-screen">Data profil karyawan Anda tidak tersedia. Silakan hubungi HR.</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar variant="inset" />
        <SidebarInset className="flex-1 flex flex-col">
          <div className="sticky top-0 z-30 bg-white">
            <SiteHeader />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <main className="p-4 sm:p-4">
              <section className="bg-white rounded-xl border shadow p-6 relative">
                <h2 className="font-semibold text-lg mb-4">Profil Anda</h2>
                {/* Tombol Edit Profil di pojok kanan atas */}
                {!isEditingOwnProfile && (
                  <>
                    <Button className="absolute top-6 right-6 h-8 px-3 py-1 text-xs border border-primary text-primary bg-white hover:secondary cursor-pointer" variant="outline" onClick={() => setShowEditDialog(true)}>
                      Edit Profil
                    </Button>
                    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Konfirmasi Edit Profil</DialogTitle>
                          <DialogDescription>Apakah Anda yakin ingin mengedit profil Anda?</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                              Batal
                            </Button>
                          </DialogClose>
                          <Button
                            onClick={() => {
                              setShowEditDialog(false);
                              setIsEditingOwnProfile(true);
                            }}
                          >
                            Ya, Edit Profil
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
                {/* Saat edit, hanya tampilkan tombol Batal di pojok kanan atas */}
                {isEditingOwnProfile && (
                  <Button type="button" variant="outline" onClick={() => setIsEditingOwnProfile(false)} className="absolute top-6 right-6 h-8 px-3 py-1 text-xs">
                    Batal Edit
                  </Button>
                )}
                {/* Ganti dengan MyEmployeeForm */}
                {myProfileData && (
                  <>
                    <MyEmployeeForm
                      initialData={myProfileData}
                      onSubmit={handleSubmitMyProfile}
                      onCancel={() => setIsEditingOwnProfile(false)}
                      readOnly={!isEditingOwnProfile}
                      isEditMode={isEditingOwnProfile}
                      onDirtyChange={setIsFormDirty} // <-- tambahkan ini
                    />
                    {/* Tombol Simpan Perubahan di bawah form, hanya saat edit */}
                    {isEditingOwnProfile && (
                      <div>
                        <Button
                          type="submit"
                          form="" // biar submit form terdekat
                          onClick={() => {
                            const form = document.querySelector("form");
                            if (form) form.requestSubmit();
                          }}
                          className="w-full flex mt-8"
                          disabled={!isFormDirty}
                        >
                          Simpan Perubahan
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </section>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

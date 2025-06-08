// File: components/ui/EmployeeForm.tsx
"use client";

import imageCompression from "browser-image-compression";
import React, { useEffect, useState, useRef } from "react";
import { ChevronDownIcon, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AvatarUploader } from '../ui/AvatarUploader';
import { DatePicker } from "../ui/date-picker";


// Definisikan interface EmployeeFormData (tanpa user_id)
// Tetap ekspor EmployeeFormData jika dibutuhkan di luar (seperti di EditEmployeePage)
export interface EmployeeFormData {
  email: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  nik: string;
  gender: "M" | "F" | "";
  education: string;
  birth_place: string;
  birth_date: string | null;
  position: string;
  branch: string;
  contract_type: "Tetap" | "Kontrak" | "Lepas" | "";
  grade: string;
  bank: string;
  bank_account_number: string;
  bank_account_name: string;
  sp_type: string;
  status?: "Aktif" | "Tidak Aktif" | "";
  avatar?: string;
}
interface InitialEmployeeData extends EmployeeFormData {
  id: string; // atau tipe ID yang sesuai
}

interface EmployeeFormProps {
  onSubmit: (formData: EmployeeFormData) => void;
  onCancel: () => void;
  initialData?: InitialEmployeeData | null;
}

const EmployeeForm = ({ onSubmit, onCancel, initialData = null }: EmployeeFormProps) => {
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

  const gradeOptions = [
    { value: "Management", label: "Management" },
    { value: "Executive", label: "Executive" },
    { value: "Professional", label: "Professional" },
    { value: "Support", label: "Support" },
    { value: "Operational", label: "Operational" },
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

  const [form, setForm] = useState<EmployeeFormData>(
    initialData
      ? {
          ...initialData,
          status: initialData.status || "Aktif",
        }
      : {
          email: "",
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

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref untuk input file

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof EmployeeFormData, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value as any })); // Type assertion if value type is constrained
  };

  const handleDateChange = (dateString: string) => {
    setForm((prev) => ({ ...prev, birth_date: dateString }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) {
      setForm(prev => ({ ...prev, avatar: '' }));
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file); // Pastikan key-nya 'avatar'

    setIsUploading(true);
    try {
      // (PERUBAHAN) Hapus objek headers dari pemanggilan axios.post
      const response = await axiosInstance.post('/upload-avatar', formData);
      
      // Simpan URL yang dikembalikan oleh server ke dalam state form
      setForm(prev => ({ ...prev, avatar: response.data.url }));
      toast.success('Avatar berhasil diupload!');
    } catch (err: any) {
      // Tampilkan pesan error yang lebih spesifik dari backend jika ada
      const errorMsg = err.response?.data?.errors?.avatar?.[0] || 'Gagal mengupload avatar.';
      toast.error('Upload Gagal', { description: errorMsg });
      console.error(err);
    } finally {
      setIsUploading(false);
    }
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleAvatarUpload(e.target.files[0]);
    }
  };

  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Bagian Avatar */}
      <div className="col-span-2">
        <AvatarUploader 
          onFileSelect={(file) => { 
            if (file) { 
              handleAvatarUpload(file); 
            } else { 
              setForm(prev => ({ ...prev, avatar: '' })); 
            } 
          }}
          initialImageUrl={form.avatar}
        />
        {isUploading && <p className="text-xs text-blue-600 mt-2">Mengupload avatar...</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name" className="mb-1">Nama Depan</Label>
            <Input id="first_name" name="first_name" placeholder="Masukkan nama depan" value={form.first_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="last_name" className="mb-1">Nama Belakang</Label>
            <Input id="last_name" name="last_name" placeholder="Masukkan nama belakang" value={form.last_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="mobile_number" className="mb-1">Nomor Ponsel</Label>
            <Input id="mobile_number" name="mobile_number" placeholder="Masukkan nomor ponsel" value={form.mobile_number} onChange={handleChange} required />
          </div>
            {!initialData && (
              <div>
                <Label htmlFor="email" className="mb-1">Email untuk Akun Baru</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contoh@perusahaan.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          <div>
            <Label htmlFor="nik" className="mb-1">NIK</Label>
            <Input id="nik" name="nik" placeholder="Masukkan NIK" value={form.nik} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="gender" className="mb-1">Jenis Kelamin</Label>
            <Select
              value={form.gender}
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
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
            <Label htmlFor="education" className="mb-1">Pendidikan Terakhir</Label>
            <Select value={form.education} onValueChange={(value) => handleSelectChange("education", value)}>
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
            <Label htmlFor="birth_place" className="mb-1">Tempat Lahir</Label>
            <Input id="birth_place" name="birth_place" placeholder="Masukkan tempat lahir" value={form.birth_place} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="birth_date" className="mb-1">Tanggal Lahir</Label>
            <DatePicker 
              value={selectedDate} 
              onChange={setSelectedDate} 
            />
          </div>
          <div>
            <Label htmlFor="position" className="mb-1">Jabatan</Label>
            <Input id="position" name="position" placeholder="Masukkan posisi/jabatan" value={form.position} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="branch" className="mb-1">Cabang</Label>
            <Input id="branch" name="branch" placeholder="Masukkan cabang" value={form.branch} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="contract_type" className="mb-1">Tipe Kontrak</Label>
            <RadioGroup id="contract_type" value={form.contract_type} onValueChange={(value) => handleSelectChange("contract_type", value)} className="flex gap-4 mt-2">
              {kontrakOptions.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.value} id={`contract_type-${opt.value}`} />
                  <Label htmlFor={`contract_type-${opt.value}`}>{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="grade" className="mb-1">Grade</Label>
            <Input id="grade" name="grade" placeholder="Masukkan grade" value={form.grade} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="bank" className="mb-1">Bank</Label>
            <Select value={form.bank} onValueChange={(value) => handleSelectChange("bank", value)}>
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
            <Label htmlFor="bank_account_number" className="mb-1">Nomor Rekening</Label>
            <Input id="bank_account_number" name="bank_account_number" placeholder="Masukkan nomor rekening" value={form.bank_account_number} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="bank_account_name" className="mb-1">Atas Nama Rekening</Label>
            <Input id="bank_account_name" name="bank_account_name" placeholder="Masukkan nama pemilik rekening" value={form.bank_account_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="sp_type" className="mb-1">Tipe SP</Label>
            <Select value={form.sp_type} onValueChange={(value) => handleSelectChange("sp_type", value)}>
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
            <Label htmlFor="status" className="mb-1">Status Karyawan</Label>
            <Select
              value={form.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
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
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isUploading}>
          {initialData ? "Simpan Perubahan" : "Tambah Karyawan"}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;

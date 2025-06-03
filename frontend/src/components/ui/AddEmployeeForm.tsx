"use client";

import { useEffect, useState } from "react";
// Hapus import useAuth karena tidak ada backend
// import { useAuth } from "../../lib/authContext"; // <-- KOMENTARI/HAPUS BARIS INI
import { ImageIcon } from "lucide-react";
import { Button } from "./button";

import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./select";
import { RadioGroup, RadioGroupItem } from "./radio-group";

// Definisikan interface EmployeeFormData (tanpa user_id)
interface EmployeeFormData {
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

// Interface untuk initialData (jika ini digunakan untuk mode edit)
// Tambahkan 'id' karena initialData bisa jadi data employee lengkap dengan ID
interface InitialEmployeeData extends EmployeeFormData {
    id: string;
}

// Perbarui prop initialData agar tipe datanya lebih spesifik
// PERBAIKAN DI SINI: Definisikan tipe untuk onSubmit, onCancel, dan initialData
function AddEmployeeForm({ onSubmit, onCancel, initialData = null }: {
    onSubmit: (formData: EmployeeFormData) => void;
    onCancel: () => void;
    initialData?: InitialEmployeeData | null;
}) {
  // Hapus penggunaan useAuth karena tidak ada backend
  // const { user } = useAuth(); // <-- HAPUS/KOMENTARI BARIS INI

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

  // Inisialisasi form tanpa user_id dari backend, dan pastikan tipe awal sesuai EmployeeFormData
  const [form, setForm] = useState<EmployeeFormData>(
    initialData
      ? {
          // user_id: initialData.user_id, // <-- HAPUS BARIS INI
          first_name: initialData.first_name || "",
          last_name: initialData.last_name || "",
          mobile_number: initialData.mobile_number || "",
          nik: initialData.nik || "",
          gender: initialData.gender || "M",
          education: initialData.education || "",
          birth_place: initialData.birth_place || "",
          birth_date: initialData.birth_date || null,
          position: initialData.position || "",
          branch: initialData.branch || "",
          contract_type: initialData.contract_type || "Kontrak",
          grade: initialData.grade || "",
          bank: initialData.bank || "",
          bank_account_number: initialData.bank_account_number || "",
          bank_account_name: initialData.bank_account_name || "",
          sp_type: initialData.sp_type || "",
          status: initialData.status || "Aktif",
          avatar: initialData.avatar || "",
        }
      : {
          first_name: "",
          last_name: "",
          mobile_number: "",
          nik: "",
          gender: "M",
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

  // Hapus useEffect yang bergantung pada `user` atau `user_id`
  // useEffect(() => {
  //   if (user && !form.user_id) {
  //     setForm((prev) => ({ ...prev, user_id: user.id }));
  //   }
  // }, [user, form.user_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof EmployeeFormData, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (dateString: string) => {
    setForm((prev) => ({ ...prev, birth_date: dateString }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
      {/* ... Isi form Anda ... */}
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
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" name="first_name" placeholder="Enter the first name" value={form.first_name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" name="last_name" placeholder="Enter the last name" value={form.last_name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="mobile_number">Mobile Number</Label>
          <Input id="mobile_number" name="mobile_number" placeholder="Enter the Mobile Number" value={form.mobile_number} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="nik">NIK</Label>
          <Input id="nik" name="nik" placeholder="Enter the NIK" value={form.nik} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={form.gender}
            onValueChange={(value: "M" | "F" | "") => handleSelectChange("gender", value)}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="-Pilih Gender-" />
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
          <Label htmlFor="education">Pendidikan Terakhir</Label>
          <Select
            value={form.education}
            onValueChange={(value) => handleSelectChange("education", value)}
          >
            <SelectTrigger id="education">
              <SelectValue placeholder="-Pilih Pendidikan Terakhir-" />
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
          <Label htmlFor="birth_place">Tempat Lahir</Label>
          <Input id="birth_place" name="birth_place" placeholder="Masukan Tempat Lahir" value={form.birth_place} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="birth_date">Tanggal Lahir</Label>
          <div className="relative">
            <Input
              id="birth_date"
              name="birth_date"
              type="date"
              value={form.birth_date || ""}
              onChange={(e) => handleDateChange(e.target.value)}
              className="pl-3"
              placeholder="dd/mm/yyyy"
              required
              autoComplete="off"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="position">Jabatan</Label>
          <Input id="position" name="position" placeholder="Enter your position" value={form.position} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="branch">Cabang</Label>
          <Input id="branch" name="branch" placeholder="Enter the branch" value={form.branch} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="contract_type">Tipe Kontrak</Label>
          <RadioGroup
            id="contract_type"
            value={form.contract_type}
            onValueChange={(value: "Tetap" | "Kontrak" | "Lepas" | "") => handleSelectChange("contract_type", value)}
            className="flex gap-4 mt-2"
          >
            {kontrakOptions.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} id={`contract_type-${opt.value}`} />
                <Label htmlFor={`contract_type-${opt.value}`}>{opt.label}</Label>
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
            onValueChange={(value) => handleSelectChange("bank", value)}
          >
            <SelectTrigger id="bank">
              <SelectValue placeholder="-Pilih Bank-" />
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
          <Label htmlFor="bank_account_number">Nomor Rekening</Label>
          <Input id="bank_account_number" name="bank_account_number" placeholder="Masukan Nomor Rekening" value={form.bank_account_number} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="bank_account_name">Atas Nama Rekening</Label>
          <Input id="bank_account_name" name="bank_account_name" placeholder="Masukan A/N Rekening" value={form.bank_account_name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="sp_type">Tipe SP</Label>
          <Select
            value={form.sp_type}
            onValueChange={(value) => handleSelectChange("sp_type", value)}
          >
            <SelectTrigger id="sp_type">
              <SelectValue placeholder="-Pilih SP-" />
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
          <Label htmlFor="status">Status Karyawan</Label>
          <Select
            value={form.status}
            onValueChange={(value: "Aktif" | "Tidak Aktif" | "") => handleSelectChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="-Pilih Status-" />
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
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export default AddEmployeeForm;
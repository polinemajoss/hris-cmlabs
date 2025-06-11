"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetTrigger } from "../ui/sheet";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Plus } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useState, useEffect } from "react";
import { EmployeeCombobox } from '../ui/EmployeeCombobox'; // <-- TAMBAHKAN IMPORT INI
import { LocationCombobox } from "../ui/LocationCombobox";
import dynamic from 'next/dynamic';
import { ImageUploader } from '../ui/ImageUploader';

interface AddCheckclockSheetProps {
  onAddAttendance: (formData: FormData) => Promise<boolean>;
}

interface EmployeeOption {
  id: string;
  first_name: string;
  last_name: string;
}

export default function CheckclockSheet({ onAddAttendance }: AddCheckclockSheetProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [type, setType] = useState<string>("");
  const [photoProof, setPhotoProof] = useState<File | null>(null);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [locationName, setLocationName] = useState(""); // Add this line for locationName state

  useEffect(() => {
    if (isOpen) {
      const fetchEmployees = async () => {
        try {
          const response = await axiosInstance.get('/employees');
          const employeeData = Array.isArray(response.data) 
            ? response.data 
            : (response.data.data || []);
          setEmployees(employeeData);
        } catch (error) {
          console.error('Gagal memuat daftar karyawan:', error);
        }
      };
      fetchEmployees();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !type) {
      alert("Karyawan dan Tipe Absensi harus diisi.");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("employee_id", employeeId);
    formData.append("type", type);
    formData.append("attendance_time", new Date().toISOString().slice(0, 19).replace("T", " "));
    if (photoProof) {
      formData.append("photo_proof", photoProof);
    }
    formData.append("address_detail", address);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("location_name", locationName);

    const success = await onAddAttendance(formData);
    setIsSubmitting(false);

    if (success) {
      setIsOpen(false); // Tutup sheet jika sukses
    }
  };

  const LocationPicker = dynamic(() => import('../ui/LocationPicker'), { 
      ssr: false,
      loading: () => <p>Memuat Peta...</p>
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="px-3 py-1 bg-[#1E3A5F] text-white rounded transition flex items-center border border-transparent hover:bg-white hover:text-[#1E3A5F] hover:border-[#1E3A5F] text-xs h-8" style={{ minHeight: "2rem" }}>
          <Plus size={12} className="mr-1" /> Tambah Data
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="!w-[85vw] max-w-none p-6 overflow-y-auto" style={{ width: "85vw", maxWidth: "none" }}>
        <SheetHeader>
          <SheetTitle>Add Checkclock</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Kiri: Karyawan, Absensi, Upload */}
          <div className="flex flex-col gap-10">
            <div>
              <Label htmlFor="karyawan">Karyawan</Label>
              <EmployeeCombobox
                employees={employees}
                value={employeeId}
                onSelect={setEmployeeId} // Langsung terhubung ke state 'employeeId'
                placeholder="Pilih Karyawan"
                searchText="Cari nama karyawan..."
                emptyText="Karyawan tidak ditemukan."
              />
            </div>
            <div>
              <Label htmlFor="tipe">Tipe Absensi</Label>
              <Select value={type} onValueChange={(value) => setType(value)} required>
                <SelectTrigger id="tipe" className="w-full mt-1">
                  <SelectValue placeholder={type ? undefined : "Pilih Tipe Absensi"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masuk">Masuk (Clock In)</SelectItem>
                  <SelectItem value="Pulang">Pulang (Clock Out)</SelectItem>
                  <SelectItem value="Sakit">Izin Sakit (Sick Leave)</SelectItem>
                  <SelectItem value="Cuti Tahunan">Cuti Tahunan (Annual Leave)</SelectItem>
                  <SelectItem value="Absen">Absen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ImageUploader onFileSelect={setPhotoProof} />
          </div>
          {/* Kanan: Lokasi, Map, Alamat */}
          <div className="flex flex-col gap-10">
            <div>
                <Label htmlFor="lokasi">Lokasi</Label>
                <LocationCombobox
                    value={locationName}
                    onSelect={setLocationName}
                />
            </div>
            
            <LocationPicker
                onLocationSelect={({ lat, lng }) => {
                    setLatitude(lat.toString());
                    setLongitude(lng.toString());
                }}
            />

            <div className="flex-1">
                <Label>Detail Alamat (Opsional)</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Contoh: Dekat Pintu Masuk Utama" className="mt-1" />
            </div>
            <div className="flex gap-2">
                <div className="flex-1">
                <Label>Latitude</Label>
                <Input value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Latitude dari peta" className="mt-1" readOnly />
                </div>
                <div className="flex-1">
                <Label>Longitude</Label>
                <Input value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Longitude dari peta" className="mt-1" readOnly />
                </div>
            </div>
          </div>
          {/* Tombol Save/Cancel sticky kanan bawah card */}
          <div className="absolute right-10 bottom-20 flex gap-5">
            <SheetClose asChild>
              <Button type="button" variant="outline" size="sm" className="h-8 px-3 text-sm">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" size="sm" className="h-8 px-3 text-sm">
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

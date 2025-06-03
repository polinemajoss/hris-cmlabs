// hris-cmlabs/frontend/src/components/ui/AddCheckclockSheet.tsx
"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Plus } from "lucide-react";

// --- Definisikan tipe untuk data formulir yang benar-benar diisi oleh form ---
export interface AddCheckclockFormData { // <-- Export interface ini
  name: string;
  jabatan: string;
  date?: string; // Tanggal bisa diisi di form atau di-generate di page.tsx
  clockIn: string;
  clockOut: string;
  workHours?: string; // Bisa dihitung di page.tsx
  location: string;
  address: string;
  lat: string;
  long: string;
  proof: string;
  // Hapus 'approve' dan 'status' dari sini, karena form ini tidak menginputnya secara langsung
  // dan akan ditambahkan di page.tsx setelah submit
}

// Definisikan interface untuk props komponen AddCheckclockSheet
interface AddCheckclockSheetProps {
  onSubmit: (formData: AddCheckclockFormData) => void;
}

export default function AddCheckclockSheet({ onSubmit }: AddCheckclockSheetProps) {
  const [formData, setFormData] = useState<AddCheckclockFormData>({
    name: '',
    jabatan: '',
    date: '', // Default value untuk date
    clockIn: '',
    clockOut: '',
    location: '',
    address: '',
    lat: '',
    long: '',
    proof: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form setelah submit
    setFormData({
      name: '',
      jabatan: '',
      date: '',
      clockIn: '',
      clockOut: '',
      location: '',
      address: '',
      lat: '',
      long: '',
      proof: '',
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="px-3 py-1 bg-[#1E3A5F] text-white rounded transition flex items-center border border-transparent hover:bg-white hover:text-[#1E3A5F] hover:border-[#1E3A5F] text-xs h-8"
          style={{ minHeight: "2rem" }}>
          <Plus size={12} className="mr-1" /> Add Checkclock
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Checkclock</SheetTitle>
          <SheetDescription>
            Fill in the details for the new checkclock entry.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Input fields */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jabatan" className="text-right">Jabatan</Label>
            <Input id="jabatan" name="jabatan" value={formData.jabatan} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" name="date" type="date" value={formData.date || ''} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clockIn" className="text-right">Clock In</Label>
            <Input id="clockIn" name="clockIn" type="time" value={formData.clockIn} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clockOut" className="text-right">Clock Out</Label>
            <Input id="clockOut" name="clockOut" type="time" value={formData.clockOut} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">Location</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Address</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lat" className="text-right">Latitude</Label>
            <Input id="lat" name="lat" value={formData.lat} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="long" className="text-right">Longitude</Label>
            <Input id="long" name="long" value={formData.long} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="proof" className="text-right">Proof URL</Label>
            <Input id="proof" name="proof" value={formData.proof} onChange={handleChange} className="col-span-3" />
          </div>
          
          <SheetFooter className="mt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit">Add Checkclock</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
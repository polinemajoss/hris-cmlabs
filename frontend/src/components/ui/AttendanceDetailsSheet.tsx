// hris-cmlabs/frontend/src/components/ui/AttendanceDetailsSheet.tsx
// (Ini adalah asumsi isi file Anda, sesuaikan dengan yang ada di project Anda)
"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { Button } from "./button";

// Definisikan tipe untuk props AttendanceDetailsSheet
interface AttendanceDetailsProps {
  // Ini harus cocok dengan interface CheckclockEntry dari page.tsx
  data: {
    name: string;
    jabatan: string;
    date: string;
    clockIn: string;
    clockOut: string;
    workHours: string;
    approve: boolean;
    status: string;
    location: string; // <-- Tambahkan properti ini
    address: string;  // <-- Tambahkan properti ini
    lat: string;      // <-- Tambahkan properti ini
    long: string;     // <-- Tambahkan properti ini
    proof: string;    // <-- Tambahkan properti ini
  } | null; // Bisa null jika tidak ada data yang dipilih
  isOpen: boolean;
  onClose: () => void;
}

export default function AttendanceDetailsSheet({ data, isOpen, onClose }: AttendanceDetailsProps) {
  if (!data) return null; // Jangan render jika tidak ada data

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Attendance Details for {data.name}</SheetTitle>
          <SheetDescription>
            Detailed information about this employee's checkclock.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-gray-500">Employee Name:</span>
            <span className="font-medium">{data.name}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-gray-500">Jabatan:</span>
            <span className="font-medium">{data.jabatan}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-gray-500">Date:</span>
            <span className="font-medium">{data.date}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-gray-500">Clock In:</span>
            <span className="font-medium">{data.clockIn}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-gray-500">Clock Out:</span>
            <span className="font-medium">{data.clockOut}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-gray-500">Work Hours:</span>
            <span className="font-medium">{data.workHours}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-gray-500">Status:</span>
            <span className="font-medium">{data.status}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-gray-500">Location:</span>
            <span className="font-medium">{data.location}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-gray-500">Address:</span>
            <span className="font-medium">{data.address}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-gray-500">Lat/Long:</span>
            <span className="font-medium">{data.lat}, {data.long}</span>
          </div>
          {data.proof && (
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="text-gray-500">Proof:</span>
              <img src={data.proof} alt="Proof" className="w-full h-auto object-cover rounded-md" />
            </div>
          )}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={onClose}>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
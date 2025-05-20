'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose, SheetTrigger } from './sheet';
import { Input } from './input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select';
import { Button } from './button';
import { Label } from './label';

export default function AddCheckclockSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-gray-800 text-white px-4 py-1.5 rounded-lg font-semibold">+ Tambah Data</Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="!w-[85vw] max-w-none p-6 overflow-y-auto"
        style={{ width: "85vw", maxWidth: "none" }}
      >
        <SheetHeader>
          <SheetTitle>Add Checkclock</SheetTitle>
        </SheetHeader>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Kiri: Karyawan, Absensi, Upload */}
          <div className="flex flex-col gap-10">
            <div>
              <Label htmlFor="karyawan">Karyawan</Label>
              <Select>
                <SelectTrigger id="karyawan" className="w-full mt-1">
                  <SelectValue placeholder="Pilih Karyawan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="juanita">Juanita</SelectItem>
                  <SelectItem value="shane">Shane</SelectItem>
                  <SelectItem value="miles">Miles</SelectItem>
                  {/* Tambahkan data karyawan lain */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tipe">Tipe Absensi</Label>
              <Select>
                <SelectTrigger id="tipe" className="w-full mt-1">
                  <SelectValue placeholder="Pilih Tipe Absensi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clockin">Clock In</SelectItem>
                  <SelectItem value="clockout">Clock Out</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Upload Bukti Pendukung</Label>
              <div className="border rounded-lg bg-gray-50 flex flex-col items-center justify-center py-10">
                <span className="text-3xl mb-2">🖼️</span>
                <span>Drag n Drop here<br />or <span className="text-blue-600 underline cursor-pointer">Browse</span></span>
              </div>
              <Button variant="default" className="w-full mt-8">
                Upload Now
              </Button>
            </div>
          </div>
          {/* Kanan: Lokasi, Map, Alamat */}
          <div className="flex flex-col gap-10">
            <div>
              <Label htmlFor="lokasi">Lokasi</Label>
              <Select>
                <SelectTrigger id="lokasi" className="w-full mt-1">
                  <SelectValue placeholder="Pilih Lokasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="malang">Malang</SelectItem>
                  {/* Tambahkan lokasi lain */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="rounded-lg border overflow-hidden w-full h-40 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">[Map Here]</span>
              </div>
            </div>
            <div>
              <Label>Detail Alamat</Label>
              <Input placeholder="Kota Malang, Jawa Timur" className="mt-1" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label>Lat</Label>
                <Input placeholder="Lat Lokasi" className="mt-1" />
              </div>
              <div className="flex-1">
                <Label>Long</Label>
                <Input placeholder="Long Lokasi" className="mt-1" />
              </div>
            </div>
          </div>
          {/* Tombol Save/Cancel sticky kanan bawah card */}
            <div className="absolute right-10 bottom-20 flex gap-5">
              <SheetClose asChild>
                <Button variant="outline" size="sm" className="h-8 px-3 text-sm">Cancel</Button>
              </SheetClose>
              <Button type="submit" size="sm" className="h-8 px-3 text-sm">Save</Button>
            </div>
        </form>
        
      </SheetContent>
    </Sheet>
  );
}
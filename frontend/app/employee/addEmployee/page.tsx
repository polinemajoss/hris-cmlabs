"use client";

import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { Calendar } from "../../../components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { SidebarProvider, SidebarInset } from "../../../components/ui/sidebar";
import { AppSidebar } from "../../../components/ui/app-sidebar";
import { SiteHeader } from "../../../components/ui/site-header";
import { Card } from "../../../components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";


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

export default function AddEmployee() {
  const [form, setForm] = useState({
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
  });

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
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-[#f7f7f7]">
          <SiteHeader />
          <main className="flex-1 flex flex-col items-center justify-start py-10">
            <Card className="w-full max-w-4xl p-8 rounded-lg shadow bg-white">
              <h2 className="text-xl font-semibold mb-6">Add New Employee</h2>
              <div className="flex items-center mb-8 gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                  {/* Placeholder avatar */}
                  <ImageIcon size={48} className="text-gray-400"></ImageIcon>
                </div>
                <Button variant="outline" type="button">Upload Avatar</Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
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
                    <Select value={form.gender} onValueChange={(value) => setForm((f) => ({ ...f, gender: value }))}>
                      <SelectTrigger id="gender">-Choose Gender-</SelectTrigger>
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
                    <Select value={form.pendidikan} onValueChange={(value) => setForm((f) => ({ ...f, pendidikan: value }))}>
                      <SelectTrigger id="pendidikan">-Pilih Pendidikan Terakhir-</SelectTrigger>
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
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                      tabIndex={-1}
                    >
                      <CalendarIcon size={18} />
                    </button>
                    <Input
                      id="tanggalLahir"
                      name="tanggalLahir"
                      type="text"
                      value={form.tanggalLahir || ""}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="pl-10"
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
                      className="flex gap-4"
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
                    <Select value={form.bank} onValueChange={(value) => setForm((f) => ({ ...f, bank: value }))}>
                      <SelectTrigger id="bank">-Pilih Bank-</SelectTrigger>
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
                    <Select value={form.tipeSp} onValueChange={(value) => setForm((f) => ({ ...f, tipeSp: value }))}>
                      <SelectTrigger id="tipeSp">-Pilih SP-</SelectTrigger>
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
                  <Button type="button" variant="outline">Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
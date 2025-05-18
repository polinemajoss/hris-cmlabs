"use client";

import { useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "../../components/ui/sidebar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Filter,
  Download,
  Upload,
  Plus,
  Bell,
  UserCircle2,
  ImageIcon,
  CalendarIcon,
} from "lucide-react";
import { Toggle } from "../../components/ui/toggle";
import { SiteHeader } from "../../components/ui/site-header";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../../components/ui/sheet";
import { AppSidebar } from "../../components/ui/app-sidebar";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";

export default function EmployeeDatabase() {
  const [employees] = useState([
    {
      id: 1,
      firstName: "Juanita",
      lastName: "Doe",
      gender: "Perempuan",
      phone: "081280331011",
      branch: "Malang",
      position: "CEO",
      grade: "Management",
      status: "active",
    },
    {
      id: 2,
      firstName: "Shane",
      lastName: "Smith",
      gender: "Laki-Laki",
      phone: "081280331012",
      branch: "Jakarta",
      position: "OB",
      grade: "Staff",
      status: "active",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const currentMonthYear = new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dummy add employee function
  const handleAddEmployee = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEmployee = Object.fromEntries(formData);
    console.log("New Employee:", newEmployee);
    setIsSheetOpen(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-col h-full bg-white">
          <SiteHeader />
          {/* Summary Cards */}
          <section className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-6 mb-8">
              <Card className="w-full">
                <CardContent className="py-4 px-6">
                  <h3 className="text-sm text-muted-foreground">Periode</h3>
                  <p className="text-lg font-semibold">{currentMonthYear}</p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardContent className="py-4 px-6">
                  <h3 className="text-sm text-muted-foreground">Total Employee</h3>
                  <p className="text-lg font-semibold">208</p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardContent className="py-4 px-6">
                  <h3 className="text-sm text-muted-foreground">Total New Hire</h3>
                  <p className="text-lg font-semibold">20</p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardContent className="py-4 px-6">
                  <h3 className="text-sm text-muted-foreground">Full Time Employee</h3>
                  <p className="text-lg font-semibold">20</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Table Controls */}
          <section className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4">
            <h2 className="font-semibold text-lg whitespace-nowrap">All Employees Information</h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded focus:outline-none focus:border-[#1E3A5F]"
              />
              <button className="px-4 py-2 border border-[#1E3A5F] text-[#1E3A5F] rounded hover:bg-[#1E3A5F] hover:text-white transition">
                <Filter size={12} className="mr-1" /> Filter
              </button>
              <button className="px-4 py-2 border border-[#1E3A5F] text-[#1E3A5F] rounded hover:bg-[#1E3A5F] hover:text-white transition">
                <Download size={12} className="mr-1" /> Export
              </button>
                <button className="px-4 py-2 border border-[#1E3A5F] text-[#1E3A5F] rounded hover:bg-[#1E3A5F] hover:text-white transition">
                <Upload size={12} className="mr-1" /> Import
                </button>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <button
                  className="px-4 py-2 border border-[#1E3A5F] text-[#1E3A5F] rounded hover:bg-[#1E3A5F] hover:text-white transition flex items-center"
                  >
                  <Plus size={12} className="mr-1" /> Tambah Data
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="!w-[85vw] max-w-none p-6 overflow-y-auto"
                  style={{ width: "85vw", maxWidth: "none" }}
                >
                  <SheetHeader>
                    <h1 className="font-bold text-2xl mb-6">Add new Employee</h1>
                  </SheetHeader>
                  <AddEmployeeForm onSubmit={handleAddEmployee} onCancel={() => setIsSheetOpen(false)} />
                </SheetContent>
                </Sheet>
            </div>
          </section>

          {/* Table */}
          <section className="px-6 pb-6 overflow-x-auto">
            <Table className="min-w-full">
              <TableCaption>A list of your recent employees.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Nomor Telepon</TableHead>
                  <TableHead>Cabang</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      Tidak ada data ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((emp, i) => (
                    <TableRow key={emp.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <div className="w-8 h-8 rounded-full bg-gray-300" />
                      </TableCell>
                      <TableCell>{emp.firstName} {emp.lastName}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          emp.gender === 'Laki-Laki' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                        }`}>
                          {emp.gender}
                        </span>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{emp.branch}</TableCell>
                      <TableCell>{emp.position}</TableCell>
                      <TableCell>{emp.grade}</TableCell>
                      <TableCell>
                        <Toggle defaultChecked={emp.status === 'active'} />
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <button className="p-1 rounded hover:bg-gray-100" title="View">👁️</button>
                        <button className="p-1 rounded hover:bg-gray-100" title="Edit">✏️</button>
                        <button className="p-1 rounded hover:bg-gray-100" title="Delete">❌</button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing 1 to 10 out of {filteredEmployees.length} records
              </div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="px-3 py-1 border rounded-l text-gray-600 hover:bg-gray-100">Previous</button>
                <button className="px-3 py-1 border bg-[#1E3A5F] text-white">1</button>
                <button className="px-3 py-1 border text-gray-600 hover:bg-gray-100">2</button>
                <button className="px-3 py-1 border rounded-r text-gray-600 hover:bg-gray-100">Next</button>
              </nav>
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// ✨ Add Employee Form Component
function AddEmployeeForm({ onSubmit, onCancel }) {
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
    avatar: "", // Added avatar property
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
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="flex items-center mb-8 gap-4">
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
          <Select
            value={form.gender}
            onValueChange={(value) => setForm((f) => ({ ...f, gender: value }))}
          >
            <SelectTrigger id="gender">
              {form.gender
                ? genderOptions.find((opt) => opt.value === form.gender)?.label
                : "-Pilih Gender-"}
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
          <Label htmlFor="pendidikan">Pendidikan Terakhir</Label>
          <Select
            value={form.pendidikan}
            onValueChange={(value) => setForm((f) => ({ ...f, pendidikan: value }))}
          >
            <SelectTrigger id="pendidikan">
              {form.pendidikan
          ? pendidikanOptions.find((opt) => opt.value === form.pendidikan)?.label
          : "-Pilih Pendidikan Terakhir-"}
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
          <Label htmlFor="tempatLahir">Tempat Lahir</Label>
          <Input id="tempatLahir" name="tempatLahir" placeholder="Masukan Tempat Lahir" value={form.tempatLahir} onChange={handleChange} required />
        </div>
        <div>
        <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
        <div className="relative">
          <Input
            id="tanggalLahir"
            name="tanggalLahir"
            type="date"
            value={form.tanggalLahir || ""}
            onChange={(e) => handleDateChange(e.target.value)}
            className="pl-3"
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
          className="flex gap-4 mt-2"
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
        <Select
          value={form.bank}
          onValueChange={(value) => setForm((f) => ({ ...f, bank: value }))}
        >
          <SelectTrigger id="bank">
        {form.bank
          ? bankOptions.find((opt) => opt.value === form.bank)?.label
          : "-Pilih Bank-"}
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
        <Label htmlFor="noRekening">Nomor Rekening</Label>
        <Input id="noRekening" name="noRekening" placeholder="Masukan Nomor Rekening" value={form.noRekening} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="atasNama">Atas Nama Rekening</Label>
        <Input id="atasNama" name="atasNama" placeholder="Masukan A/N Rekening" value={form.atasNama} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="tipeSp">Tipe SP</Label>
        <Select
          value={form.tipeSp}
          onValueChange={(value) => setForm((f) => ({ ...f, tipeSp: value }))}
        >
          <SelectTrigger id="tipeSp">
        {form.tipeSp
          ? spOptions.find((opt) => opt.value === form.tipeSp)?.label
          : "-Pilih SP-"}
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
    </div>
    <div className="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline">Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
    </form>
  );
}
"use client";

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

// Import komponen UI yang Anda gunakan
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { SiteHeader } from '@/components/ui/site-header';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { EmployeeCombobox, EmployeeOption } from '@/components/ui/EmployeeCombobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker'; // Asumsi Anda punya komponen ini

// Definisikan tipe data sesuai backend
interface User {
  name: string;
}
interface Employee {
  id: string;
  position: string;
  user: User;
}
interface Salary {
  id: string;
  amount: number;
  type: string;
  effective_date: string;
  employee: Employee;
}

// Komponen Form terpisah untuk menambah/edit gaji
function SalaryForm({ employees, onSubmit }: { employees: EmployeeOption[], onSubmit: (data: any) => void }) {
  const [employeeId, setEmployeeId] = useState<string | undefined>();
  const [amount, setAmount] = useState<number | string>('');
  const [type, setType] = useState('');
  const [effectiveDate, setEffectiveDate] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      employee_id: employeeId,
      amount: amount,
      type: type,
      effective_date: effectiveDate?.toISOString().split('T')[0]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Karyawan</Label>
        <EmployeeCombobox 
          employees={employees}
          value={employeeId || ''}
          onSelect={setEmployeeId}
        />
      </div>
      <div>
        <Label htmlFor="type">Tipe Gaji</Label>
        <Input id="type" value={type} onChange={(e) => setType(e.target.value)} placeholder="Contoh: Gaji Pokok, Tunjangan" />
      </div>
      <div>
        <Label htmlFor="amount">Jumlah (Rp)</Label>
        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Contoh: 5000000" />
      </div>
      <div>
        <Label>Tanggal Efektif</Label>
        <DatePicker value={effectiveDate} onChange={setEffectiveDate} />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  );
}

// Komponen Halaman Utama
export default function SalaryPage() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/salaries');
      setSalaries(response.data.data || []);
    } catch (error) {
      toast.error('Gagal memuat data gaji.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
        const response = await axiosInstance.get('/employees');
        const employeeData = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setEmployees(employeeData);
    } catch (error) {
        console.error('Gagal memuat daftar karyawan:', error);
    }
  };

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const handleAddSalary = async (data: any) => {
    try {
      await axiosInstance.post('/salaries', data);
      toast.success('Data gaji berhasil disimpan!');
      fetchSalaries(); // Muat ulang data
      setIsSheetOpen(false); // Tutup sheet
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan data.';
      toast.error(errorMsg);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar variant="inset" />
        <SidebarInset className="flex-1 flex flex-col">
          <SiteHeader />
          <main className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50">
            <div className="bg-white rounded-xl border shadow px-8 py-6 w-full">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-semibold text-xl">Manajemen Gaji</h2>
                  <p className="text-sm text-muted-foreground">Kelola gaji pokok dan komponen lainnya untuk setiap karyawan.</p>
                </div>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Tambah Gaji
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="!max-w-md p-0">
                    <SheetHeader className="p-6 pb-4 border-b">
                      <SheetTitle>Tambah Data Gaji Baru</SheetTitle>
                    </SheetHeader>
                    <div className="p-6">
                      <SalaryForm employees={employees} onSubmit={handleAddSalary} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Karyawan</TableHead>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Jumlah Gaji</TableHead>
                      <TableHead>Tanggal Efektif</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">Memuat data...</TableCell>
                      </TableRow>
                    ) : salaries.length > 0 ? (
                      salaries.map((salary) => (
                        <TableRow key={salary.id}>
                          <TableCell className="font-medium">{salary.employee?.user?.name || 'N/A'}</TableCell>
                          <TableCell>{salary.employee?.position || 'N/A'}</TableCell>
                          <TableCell>{salary.type}</TableCell>
                          <TableCell>{formatCurrency(salary.amount)}</TableCell>
                          <TableCell>{new Date(salary.effective_date).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">Belum ada data gaji.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

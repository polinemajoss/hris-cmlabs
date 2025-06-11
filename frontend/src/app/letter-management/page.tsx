'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { SidebarProvider } from '../../components/ui/sidebar';
import { AppSidebar } from '../../components/ui/app-sidebar';
import { SiteHeader } from '../../components/ui/site-header';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import axiosInstance from '@/lib/axios';
import { LetterTableSkeleton } from '@/components/skeletons/LetterTableSkeleton';
import { Button } from '@/components/ui/button'; // <-- 1. Import Button

// Interface untuk data surat dari API
interface Letter {
  id: number;
  title: string;
  type: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

// Interface untuk data paginasi dari API (opsional, jika ada)
interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export default function LetterManagementPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();

  const fetchLetters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const types = searchParams.get('type');
      const search = searchTerm;

      const params = new URLSearchParams();
      if (types) params.append('type', types);
      if (search) params.append('search', search);

      const response = await axiosInstance.get('/letters', { params });
      
      setLetters(response.data.data || []);
      setPagination(response.data.meta || null);

    } catch (err) {
      const errorMsg = "Gagal memuat data surat dari server.";
      setError(errorMsg);
      // Notifikasi toast tetap ada
      toast.error("Gagal Memuat Data", { description: errorMsg });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLetters();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchLetters]);

  const getStatusBadge = (status: Letter['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
        <div className="flex-1 min-h-screen bg-gray-50">
          <SiteHeader />
          <main className="p-8">
            <section className="bg-white rounded-xl border shadow px-8 py-6 flex flex-col gap-6 w-full">
              {/* Header: Judul, Search, dan Tombol Aksi */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="font-semibold text-lg whitespace-nowrap">Manajemen Surat</h2>
                <div className="flex gap-3 flex-1">
                  <input
                    type="text"
                    placeholder="Cari berdasarkan judul surat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 border rounded text-xs h-8 focus:outline-none focus:border-[#1E3A5F] flex-1 min-w-0"
                    style={{ minHeight: '2rem' }}
                  />
                  <button className="px-3 py-1 bg-[#1E3A5F] text-white rounded transition flex items-center border border-transparent hover:bg-white hover:text-[#1E3A5F] hover:border-[#1E3A5F] text-xs h-8" style={{ minHeight: "2rem" }}>
                    <Plus size={14} className="mr-1" /> Buat Surat
                  </button>
                </div>
              </div>

              {/* Konten Utama: Skeleton, Error, atau Tabel Data */}
              {loading ? (
                <LetterTableSkeleton />
              ) : error ? (
                // --- 2. TAMPILAN ERROR BARU DENGAN TOMBOL ---
                <div className="text-center py-10 flex flex-col items-center gap-4">
                    <p className="text-red-500">{error}</p>
                    <Button variant="outline" onClick={fetchLetters}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Coba Lagi
                    </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Judul</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {letters.length > 0 ? (
                        letters.map((letter) => (
                          <TableRow key={letter.id}>
                            <TableCell className="font-medium">{letter.title}</TableCell>
                            <TableCell>{letter.type}</TableCell>
                            <TableCell>{new Date(letter.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</TableCell>
                            <TableCell className="text-center">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(letter.status)}`}>
                                {letter.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex gap-2 justify-center">
                                 <button type="button" className="p-2 rounded-md bg-yellow-100 hover:bg-yellow-200 transition" title="Edit">
                                      <Edit className="h-4 w-4 text-yellow-600" />
                                 </button>
                                 <button type="button" className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition" title="Hapus">
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                 </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10">
                            Tidak ada data surat yang cocok dengan filter atau pencarian Anda.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
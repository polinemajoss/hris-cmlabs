// hris-cmlabs/frontend/src/app/letter/LetterManagementPage.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { SidebarProvider } from '../../components/ui/sidebar';
import { AppSidebar } from '../../components/ui/app-sidebar';
import { SiteHeader } from '../../components/ui/site-header';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner'; // Assuming sonner is configured
import axiosInstance from '@/lib/axios';
import { LetterTableSkeleton } from '@/components/skeletons/LetterTableSkeleton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import LetterForm, { LetterFormData } from '../../components/letter/LetterForm'; // Import the LetterForm component and its type
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Interface untuk data surat dari API
interface Letter {
  id: number;
  title: string;
  type: string;
  date: string; // YYYY-MM-DD format, or whatever format your backend returns
  status: 'Approved' | 'Pending' | 'Rejected';
  content: string;
  recipient: string;
  created_at: string; // Example: Add timestamp if your API provides it
  updated_at: string; // Example: Add timestamp if your API provides it
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

  // State untuk Sheet dan Data Edit/Hapus
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState<LetterFormData | null>(null); // Use LetterFormData here
  const [letterToDelete, setLetterToDelete] = useState<Letter | null>(null); // Use Letter for delete confirmation

  const fetchLetters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const types = searchParams.get('type');
      const search = searchTerm;

      const params = new URLSearchParams();
      if (types) params.append('type', types);
      if (search) params.append('search', search);

      const response = await axiosInstance.get('/letters', { params }); // Sesuaikan endpoint jika berbeda

      // Asumsi response.data adalah objek dengan properti `data` (array surat) dan `meta` (objek paginasi)
      setLetters(response.data.data || []);
      setPagination(response.data.meta || null);
    } catch (err) {
      const errorMsg = 'Gagal memuat data surat dari server.';
      setError(errorMsg);
      toast.error('Gagal Memuat Data', { description: errorMsg });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, searchTerm]);

  useEffect(() => {
    // Debounce search term fetching
    const timer = setTimeout(() => {
      fetchLetters();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchLetters, searchTerm]); // Add searchTerm to dependency array for re-fetching on search change

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

  const handleCreateLetter = async (formData: LetterFormData) => {
    try {
      // Sesuaikan payload jika backend Anda mengharapkan format yang berbeda (misal, tidak butuh 'id')
      const payload = { ...formData };
      delete payload.id; // Ensure id is not sent for creation

      await axiosInstance.post('/letters', payload); // Endpoint POST untuk membuat surat
      toast.success('Berhasil!', { description: 'Surat baru telah berhasil dibuat.' });
      fetchLetters(); // Refresh data setelah berhasil
      setIsCreateSheetOpen(false); // Tutup sheet
    } catch (error: any) { // Tangani error dari axios
      const errorMsg = error.response?.data?.message || 'Terjadi kesalahan saat membuat surat.';
      toast.error('Gagal Membuat Surat', { description: errorMsg });
      console.error('Error creating letter:', error);
    }
  };

  const handleEditLetter = async (formData: LetterFormData) => {
    if (!editingLetter || !formData.id) {
      toast.error('Aksi Tidak Valid', { description: 'Tidak ada surat yang dipilih untuk diupdate.' });
      return;
    }
    try {
      // Sesuaikan payload jika backend Anda mengharapkan format yang berbeda
      const payload = { ...formData };
      await axiosInstance.put(`/letters/${formData.id}`, payload); // Endpoint PUT untuk mengupdate surat
      toast.success('Berhasil!', { description: `Surat "${formData.title}" telah berhasil diupdate.` });
      fetchLetters(); // Refresh data setelah berhasil
      setIsEditSheetOpen(false); // Tutup sheet
      setEditingLetter(null); // Reset state editing
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Terjadi kesalahan saat mengupdate surat.';
      toast.error('Gagal Mengupdate Surat', { description: errorMsg });
      console.error('Error updating letter:', error);
    }
  };

  const handleDeleteLetter = async () => {
    if (!letterToDelete) return; // Pastikan ada surat yang akan dihapus
    try {
      await axiosInstance.delete(`/letters/${letterToDelete.id}`); // Endpoint DELETE untuk menghapus surat
      toast.success('Berhasil!', { description: `Surat "${letterToDelete.title}" telah berhasil dihapus.` });
      fetchLetters(); // Refresh data setelah berhasil
      setLetterToDelete(null); // Reset state delete
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Terjadi kesalahan saat menghapus surat.';
      toast.error('Gagal Menghapus Surat', { description: errorMsg });
      console.error('Error deleting letter:', error);
    }
  };

  const confirmDeleteLetter = (letter: Letter) => {
    setLetterToDelete(letter);
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
                <h2 className="font-semibold text-lg whitespace-nowrap">
                  Manajemen Surat
                </h2>
                <div className="flex gap-3 flex-1">
                  <input
                    type="text"
                    placeholder="Cari berdasarkan judul surat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1 border rounded text-xs h-8 focus:outline-none focus:border-[#1E3A5F] flex-1 min-w-0"
                    style={{ minHeight: '2rem' }}
                  />
                  {/* Tombol Buat Surat - Membuka Sheet */}
                  <SheetTrigger asChild>
                    <button
                      onClick={() => {
                        setEditingLetter(null); // Pastikan form kosong saat membuat baru
                        setIsCreateSheetOpen(true);
                      }}
                      className="px-3 py-1 bg-[#1E3A5F] text-white rounded transition flex items-center border border-transparent hover:bg-white hover:text-[#1E3A5F] hover:border-[#1E3A5F] text-xs h-8"
                      style={{ minHeight: '2rem' }}
                    >
                      <Plus size={14} className="mr-1" /> Buat Surat
                    </button>
                  </SheetTrigger>
                  <SheetContent>
                    <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
                      <SheetContent className="p-6 sm:max-w-md">
                        <SheetHeader>
                          <SheetTitle>Buat Surat Baru</SheetTitle>
                        </SheetHeader>
                        <LetterForm
                          onSubmit={handleCreateLetter}
                          onCancel={() => setIsCreateSheetOpen(false)}
                          initialData={undefined} // Pass null for initialData
                        />
                      </SheetContent>
                    </Sheet>
                  </SheetContent>
                </div>
              </div>

              {/* Konten Utama: Skeleton, Error, atau Tabel Data */}
              {loading ? (
                <LetterTableSkeleton />
              ) : error ? (
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
                        <TableHead className="w-[25%]">Judul</TableHead>
                        <TableHead className="w-[15%]">Tipe</TableHead>
                        <TableHead className="w-[15%]">Penerima</TableHead> {/* New column */}
                        <TableHead className="w-[15%]">Tanggal</TableHead>
                        <TableHead className="text-center w-[15%]">Status</TableHead>
                        <TableHead className="text-center w-[15%]">Action</TableHead>
                        <TableHead className="text-center w-[15%]">Detail</TableHead>

                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {letters.length > 0 ? (
                        letters.map((letter) => (
                          <TableRow key={letter.id}>
                            <TableCell className="font-medium">
                              {letter.title}
                            </TableCell>
                            <TableCell>{letter.type}</TableCell>
                            <TableCell>{letter.recipient}</TableCell> {/* Display recipient */}
                            <TableCell>
                              {new Date(letter.date).toLocaleDateString(
                                'id-ID',
                                { day: 'numeric', month: 'long', year: 'numeric' },
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                  letter.status,
                                )}`}
                              >
                                {letter.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <button
                                onClick={() => {
                                  setEditingLetter({
                                    id: letter.id,
                                    title: letter.title,
                                    type: letter.type,
                                    date: letter.date,
                                    status: letter.status,
                                    content: letter.content,
                                    recipient: letter.recipient,
                                  });
                                  setIsEditSheetOpen(true); // Membuka sheet edit
                                }}
                                className="p-2 rounded-md bg-primary text-neutral-white hover:bg-secondary transition"
                                title="Detail"
                              >
                                Detail
                              </button>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex gap-2 justify-center">
                                {/* Tombol Edit - Membuka Sheet Edit */}
                                <button
                                  onClick={() => {
                                    // Pastikan data yang dikirim ke form sesuai LetterFormData
                                    setEditingLetter({
                                      id: letter.id,
                                      title: letter.title,
                                      type: letter.type,
                                      date: new Date(letter.date).toISOString().split('T')[0], // Format date for input type="date"
                                      status: letter.status,
                                      content: letter.content,
                                      recipient: letter.recipient,
                                    });
                                    setIsEditSheetOpen(true);
                                  }}
                                  className="p-2 rounded-md bg-yellow-100 hover:bg-yellow-200 transition"
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4 text-yellow-600" />
                                </button>

                                {/* AlertDialog untuk Konfirmasi Hapus */}
                                <AlertDialog open={letterToDelete?.id === letter.id} onOpenChange={(open) => !open && setLetterToDelete(null)}>
                                  <AlertDialogTrigger asChild>
                                    <button
                                      onClick={() => confirmDeleteLetter(letter)}
                                      className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition"
                                      title="Hapus"
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </button>
                                  </AlertDialogTrigger>
                                  {letterToDelete && letterToDelete.id === letter.id && (
                                    <AlertDialogContent className="shadow-[0_0_0_6px_rgba(239,68,68,0.10),0_4px_24px_0_rgba(239,68,68,0.18)]">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Data surat "
                                          <strong style={{ color: 'red' }}>{letterToDelete.title}</strong>"
                                          akan dihapus secara permanen.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setLetterToDelete(null)}>Batal</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={handleDeleteLetter}>
                                          Hapus
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  )}
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            Tidak ada data surat yang cocok dengan filter atau
                            pencarian Anda.
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

      {/* Sheet untuk Tambah Data */}
      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
        <SheetContent className="p-6 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Buat Surat Baru</SheetTitle>
          </SheetHeader>
          <LetterForm onSubmit={handleCreateLetter} onCancel={() => setIsCreateSheetOpen(false)} initialData={undefined} /> {/* Pass null for initialData */}
        </SheetContent>
      </Sheet>

      {/* Sheet untuk Edit Data */}
      <Sheet open={isEditSheetOpen} onOpenChange={(open) => {
        setIsEditSheetOpen(open);
        if (!open) {
          setEditingLetter(null); // Reset editingLetter when sheet is closed
        }
      }}>
        <SheetContent className="p-6 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Surat</SheetTitle>
          </SheetHeader>
          {editingLetter && (
            <LetterForm
              onSubmit={handleEditLetter}
              onCancel={() => setIsEditSheetOpen(false)}
              initialData={editingLetter}
            />
          )}
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  );
}
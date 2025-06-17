// hris-cmlabs/frontend/src/app/letter/LetterForm.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have a Textarea component
import { Upload, X, Paperclip } from 'lucide-react';
import { EmployeeCombobox, EmployeeOption } from '../../components/ui/EmployeeCombobox';

export interface LetterFormData {
  id?: number; // Optional for create, required for update
  title: string;
  type: string;
  date: string; // YYYY-MM-DD format
  status: 'Approved' | 'Pending' | 'Rejected';
  content: string;
  recipient: string;
  attachment_url?: string; // Add this property for file URL
}

interface LetterFormProps {
  onSubmit: (data: LetterFormData) => void;
  onCancel: () => void;
  initialData?: LetterFormData; // Data awal untuk mode edit
  onDelete?: () => void; // Tambahkan properti ini
  employees: EmployeeOption[]; // DITAMBAHKAN: Terima daftar karyawan

}

const baseButtonClassName = "px-4 py-2 border rounded transition-colors"; // You can adjust this as needed

// Define available letter types
const letterTypes: string[] = [
  "izin",
  "cuti",
  "sakit",
  "tugas",
  "lainnya"
];

const LetterForm: React.FC<LetterFormProps> = ({ onSubmit, onCancel, onDelete, initialData, employees }) => {
  const [formData, setFormData] = useState<LetterFormData>({
    title: '',
    type: 'Izin',
    date: new Date().toISOString().split('T')[0], // Default today's date
    status: 'Pending',
    content: '',
    recipient: '',
    ...initialData, // Override with initialData if provided
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Effect to update form data if initialData changes (e.g., when editing different letters)
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure date is in YYYY-MM-DD format if coming from a different format
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
      setSelectedFile(null);
    } else {
      // Reset form for new creation
      setFormData({
        title: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        content: '',
        recipient: '',
      });
      setSelectedFile(null);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: keyof LetterFormData, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    // If you want to upload the file immediately and get a URL, handle it here and update formData.attachment_url
    // For now, just clear the previous URL if a new file is selected
    if (file) {
      setFormData({ ...formData, attachment_url: undefined });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Judul Surat</Label>
        <Input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="type">Tipe Surat</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange('type', value)}
            required
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Pilih tipe surat..." />
            </SelectTrigger>
            <SelectContent>
              {letterTypes.map((type: string) => (
                <SelectItem key={type} value={type}>
                  {/* Kapitalisasi huruf pertama untuk tampilan */}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="recipient">Penerima Surat</Label>
        <EmployeeCombobox
            employees={employees}
            value={formData.recipient}
            onSelect={(employeeId) => handleSelectChange('recipient', employeeId)}
          />      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="date">Tanggal</Label>
        <Input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="status">Status</Label>
        <Select onValueChange={(value) => handleSelectChange('status', value as LetterFormData['status'])} value={formData.status}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="content">Konten Surat</Label>
        <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={6} required />
      </div>

      {/* --- BAGIAN UPLOAD FILE BARU --- */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="attachment">Upload Bukti (PDF/Gambar)</Label>
        <Input
          id="attachment"
          type="file"
          className="hidden" // Sembunyikan input asli
          onChange={handleFileChange}
          accept="image/*,application/pdf"
        />
        <label
          htmlFor="attachment"
          className="mt-1 flex items-center justify-center w-full p-4 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
        >
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {selectedFile ? 'Ganti file' : 'Klik untuk memilih file'}
            </p>
          </div>
        </label>

        {/* Tampilkan file yang ada atau yang baru dipilih */}
        {selectedFile ? (
          <div className="mt-2 flex items-center justify-between text-sm p-2 bg-gray-100 rounded-md">
            <span className="truncate">{selectedFile.name}</span>
            <button type="button" onClick={handleRemoveFile}>
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        ) : formData.attachment_url && (
          <div className="mt-2 text-sm">
            <a href={formData.attachment_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
              <Paperclip className="h-4 w-4" />
              Lihat Bukti Terlampir
            </a>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
          {/* Grup Tombol Aksi di Kiri */}
          <div className="flex items-center gap-2">
            {/* Tombol Hapus: HANYA muncul saat mode edit */}
            {initialData && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className={`${baseButtonClassName} bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white`}
              >
                Hapus Surat
              </button>
            )}

            {/* Tombol Submit: SELALU muncul */}
            <button
              type="submit"
              className={`${baseButtonClassName} bg-white text-primary border-primary hover:bg-primary hover:text-white`}
            >
              {initialData ? 'Perbarui Surat' : 'Buat Surat'}
            </button>
          </div>

          {/* Tombol Batal di Kanan */}
          <div>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Batal
            </Button>
          </div>
      </div>
    </form>
  );
};

export default LetterForm;
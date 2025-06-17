// hris-cmlabs/frontend/src/app/letter/LetterForm.tsx
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have a Textarea component

export interface LetterFormData {
  id?: number; // Optional for create, required for update
  title: string;
  type: string;
  date: string; // YYYY-MM-DD format
  status: 'Approved' | 'Pending' | 'Rejected';
  content: string;
  recipient: string;
}

interface LetterFormProps {
  onSubmit: (data: LetterFormData) => void;
  onCancel: () => void;
  initialData?: LetterFormData; // Data awal untuk mode edit
  onDelete?: () => void; // Tambahkan properti ini
}

const baseButtonClassName = "px-4 py-2 border rounded transition-colors font-medium"; // Add your base button classes here

const LetterForm: React.FC<LetterFormProps> = ({ onSubmit, onCancel, onDelete, initialData }) => {
  const [formData, setFormData] = useState<LetterFormData>({
    title: '',
    type: '',
    date: new Date().toISOString().split('T')[0], // Default today's date
    status: 'Pending',
    content: '',
    recipient: '',
    ...initialData, // Override with initialData if provided
  });

  // Effect to update form data if initialData changes (e.g., when editing different letters)
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure date is in YYYY-MM-DD format if coming from a different format
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
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
    }
  }, [initialData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: keyof LetterFormData, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="title">Judul Surat</Label>
        <Input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="type">Tipe Surat</Label>
        <Input type="text" id="type" name="type" value={formData.type} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="recipient">Penerima Surat</Label>
        <Input type="text" id="recipient" name="recipient" value={formData.recipient} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="date">Tanggal</Label>
        <Input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
      </div>
      <div>
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
      <div>
        <Label htmlFor="content">Konten Surat</Label>
        <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={6} required />
      </div>

       <div className="flex justify-between items-center pt-4 border-t">
        {/* Tombol Hapus hanya muncul di mode edit */}
        <div>
          {initialData && onDelete && (
            <div className="flex gap-2"> 
              <Button
                type="button"
                onClick={onDelete}
                className={`${baseButtonClassName} bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white`}
              >
                Hapus Surat
              </Button>
              <Button
                type="submit"
                className={`${baseButtonClassName} bg-white text-primary border-primary hover:bg-primary hover:text-white`}
              >
                {initialData ? 'Perbarui Surat' : 'Buat Surat'}
              </Button>
            </div>
          )}
        </div>

        {/* Tombol Aksi Utama (Batal, Buat/Update) di kanan */}
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Batal
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LetterForm;
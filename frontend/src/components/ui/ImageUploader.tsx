'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import { Button } from './button';
import Image from 'next/image';
import { Label } from './label';

// Definisikan props untuk komponen
interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
}

export function ImageUploader({ onFileSelect }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
    },
    multiple: false,
  });

  const handleRemoveImage = () => {
    setPreview(null);
    onFileSelect(null);
  };

  // Membersihkan object URL untuk menghindari memory leak
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="w-full">
      <Label>Upload Bukti Pendukung</Label>
      <div
        {...getRootProps()}
        className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        ${preview ? 'p-0 border-solid overflow-hidden' : ''}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative w-full h-48">
            <Image
              src={preview}
              alt="Preview"
              layout="fill"
              objectFit="contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 rounded-full"
              onClick={(e) => {
                e.stopPropagation(); // Mencegah dialog file terbuka saat tombol hapus diklik
                handleRemoveImage();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <UploadCloud className="w-10 h-10 mb-2" />
            <p className="text-sm">
              Tarik & lepas gambar di sini, atau{' '}
              <span className="font-semibold text-blue-600">klik untuk memilih</span>
            </p>
            <p className="text-xs mt-1">PNG, JPG, GIF (Maks. 2MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}
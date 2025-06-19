"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { User, Camera, X } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";
import { Label } from "./label";

// Definisikan props untuk komponen AvatarUploader
interface AvatarUploaderProps {
  onFileSelect: (file: File | null) => void;
  initialImageUrl?: string | null;
  readOnly?: boolean;
  canEdit?: boolean;
}

export function AvatarUploader({ onFileSelect, initialImageUrl, readOnly = false, canEdit = true }: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);

  // Efek ini akan memastikan preview diperbarui jika data karyawan (dan avatarnya) berubah
  useEffect(() => {
    setPreview(initialImageUrl || null);
  }, [initialImageUrl]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (readOnly || !canEdit) return;
      const file = acceptedFiles[0];
      if (file) {
        const newPreview = URL.createObjectURL(file);
        // Hapus object URL lama jika ada untuk mencegah memory leak
        if (preview && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
        setPreview(newPreview);
        onFileSelect(file);
      }
    },
    [onFileSelect, preview, readOnly, canEdit]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: false,
    disabled: readOnly || !canEdit,
  });

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (readOnly || !canEdit) return;
    e.stopPropagation(); // Mencegah dialog file terbuka saat tombol hapus diklik

    // Jika preview adalah blob, kita perlu me-revoke object URL-nya
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onFileSelect(null);
  };

  // Membersihkan object URL saat komponen di-unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Label className="text-center">Avatar</Label>
      <div className="mt-2 flex items-center gap-4 justify-center">
        <div
          {...getRootProps()}
          className={`relative h-24 w-24 rounded-full flex items-center justify-center border-2 border-dashed
          cursor-pointer transition-colors overflow-hidden
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
          ${readOnly || !canEdit ? "cursor-not-allowed opacity-60" : ""}`}
          tabIndex={readOnly || !canEdit ? -1 : 0}
          aria-disabled={readOnly || !canEdit}
        >
          <input {...getInputProps()} disabled={readOnly || !canEdit} />
          {preview ? (
            <Image src={preview} alt="Preview Avatar" fill className="object-cover" />
          ) : (
            <div className="text-gray-400">
              <User className="h-10 w-10" />
            </div>
          )}

          {/* Overlay saat hover */}
          {canEdit && !readOnly && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white mb-1" />
              <span className="text-xs text-white text-center">Ganti foto</span>
            </div>
          )}
        </div>
        {/* Tombol Hapus hanya muncul jika ada gambar dan bisa edit */}
        
      </div>
    </div>
  );
}

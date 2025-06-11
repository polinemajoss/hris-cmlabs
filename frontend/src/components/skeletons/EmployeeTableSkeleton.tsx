// app/components/skeletons/EmployeeTableSkeleton.tsx

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function EmployeeTableSkeleton() {
  const skeletonRows = Array.from({ length: 8 });

  return (
    <div className="rounded-md">
      <Table>
        {/* Header Tabel dalam Bahasa Indonesia */}
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: '40px' }}>No</TableHead>
            <TableHead style={{ width: '80px' }} className="text-center">Avatar</TableHead>
            <TableHead style={{ width: '250px' }}>Nama</TableHead>
            <TableHead>Jenis Kelamin</TableHead>
            <TableHead>Nomor Telepon</TableHead>
            <TableHead>Cabang</TableHead>
            <TableHead>Jabatan</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        {/* Body Tabel dengan Skeleton sesuai struktur baru */}
        <TableBody>
          {skeletonRows.map((_, index) => (
            <TableRow key={`skeleton-emp-${index}`}>
              {/* No */}
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>

              {/* Avatar */}
              <TableCell className="flex justify-center">
                <Skeleton className="h-10 w-10 rounded-full" />
              </TableCell>

              {/* Nama */}
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>

              {/* Jenis Kelamin */}
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              
              {/* Nomor Telepon */}
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>

              {/* Cabang */}
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>

              {/* Jabatan */}
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>

              {/* Grade */}
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>

              {/* Status (Badge) */}
              <TableCell className="text-center">
                <Skeleton className="h-6 w-[80px] rounded-md mx-auto" />
              </TableCell>

              {/* Action (Tombol) */}
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
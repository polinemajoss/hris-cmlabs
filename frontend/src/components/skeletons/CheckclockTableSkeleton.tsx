// app/components/skeletons/CheckclockTableSkeleton.tsx

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

export function CheckclockTableSkeleton() {
  const skeletonRows = Array.from({ length: 8 });

  return (
    <div className="rounded-xl bg-white shadow">
      <div className="overflow-x-auto">
        <Table className="w-full">
          {/* Header Tabel dalam Bahasa Indonesia */}
          <TableHeader>
            <TableRow>
              <TableHead>Nama Karyawan</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Waktu Absensi</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Persetujuan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>

          {/* Body Tabel dengan Skeleton */}
          <TableBody>
            {skeletonRows.map((_, index) => (
              <TableRow key={`skeleton-checkclock-${index}`}>
                {/* Nama Karyawan (Avatar + Nama) */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-[180px]" />
                  </div>
                </TableCell>

                {/* Jabatan */}
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" />
                </TableCell>

                {/* Waktu Absensi */}
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>

                {/* Tipe */}
                <TableCell>
                  <Skeleton className="h-6 w-[90px] rounded-md" />
                </TableCell>

                {/* Persetujuan */}
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Skeleton className="h-6 w-[110px] rounded-md" />
                </TableCell>

                {/* Detail (Tombol) */}
                <TableCell>
                  <Skeleton className="h-8 w-[70px] rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
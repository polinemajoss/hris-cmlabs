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
  // Menampilkan 8 baris skeleton sebagai placeholder
  const skeletonRows = Array.from({ length: 8 });

  return (
    <div className="rounded-xl border bg-white shadow">
        <div className="overflow-x-auto">
            <Table className="w-full">
                {/* Header Tabel */}
                <TableHeader>
                    <TableRow>
                        <TableHead>Employee Name</TableHead>
                        <TableHead>Jabatan</TableHead>
                        <TableHead>Attendance Time</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Approval</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Details</TableHead>
                    </TableRow>
                </TableHeader>

                {/* Body Tabel dengan Skeleton */}
                <TableBody>
                {skeletonRows.map((_, index) => (
                    <TableRow key={`skeleton-checkclock-${index}`}>
                    {/* Kolom Employee Name (Avatar + Nama) */}
                    <TableCell>
                        <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-4 w-[180px]" />
                        </div>
                    </TableCell>

                    {/* Kolom Jabatan */}
                    <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                    </TableCell>

                    {/* Kolom Attendance Time */}
                    <TableCell>
                        <Skeleton className="h-4 w-full" />
                    </TableCell>

                    {/* Kolom Tipe (Badge) */}
                    <TableCell>
                        <Skeleton className="h-6 w-[90px] rounded-md" />
                    </TableCell>

                    {/* Kolom Approval */}
                    <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                    </TableCell>

                    {/* Kolom Status (Badge) */}
                    <TableCell>
                        <Skeleton className="h-6 w-[110px] rounded-md" />
                    </TableCell>

                    {/* Kolom Details (Tombol) */}
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
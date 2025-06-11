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
  // Menampilkan 8 baris skeleton sebagai placeholder
  const skeletonRows = Array.from({ length: 8 });

  return (
    <div className="rounded-md border">
      <Table>
        {/* Header Tabel */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">
              <Skeleton className="h-5 w-5" />
            </TableHead>
            <TableHead style={{ width: '300px' }}>Employee</TableHead>
            <TableHead style={{ width: '150px' }}>NIK</TableHead>
            <TableHead style={{ width: '200px' }}>Position</TableHead>
            <TableHead style={{ width: '150px' }}>Branch</TableHead>
            <TableHead style={{ width: '120px' }}>Status</TableHead>
            <TableHead style={{ width: '100px' }} className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* Body Tabel dengan Skeleton */}
        <TableBody>
          {skeletonRows.map((_, index) => (
            <TableRow key={index}>
              {/* Kolom Checkbox */}
              <TableCell>
                <Skeleton className="h-5 w-5" />
              </TableCell>

              {/* Kolom Employee (Avatar + Nama) */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                </div>
              </TableCell>

              {/* Kolom NIK */}
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>

              {/* Kolom Position */}
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>

              {/* Kolom Branch */}
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>

              {/* Kolom Status (Badge) */}
              <TableCell>
                <Skeleton className="h-6 w-[80px] rounded-md" />
              </TableCell>

              {/* Kolom Actions (Tombol) */}
              <TableCell className="text-right">
                <Skeleton className="h-8 w-[80px] rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
// hris-cmlabs/frontend/src/components/AppSidebar.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ClipboardCheckIcon, ClockIcon, LayoutDashboardIcon, UsersIcon, Wallet } from "lucide-react";

import { NavMain } from "./nav-main";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./sidebar";
import axiosInstance from "@/lib/axios";

// Struktur data statis untuk menu
const initialNavData = {
  navMain: [
    { name: "Dashboard", url: "/", icon: LayoutDashboardIcon },
    {
      name: "Employee",
      url: "/employee",
      icon: UsersIcon,
      // Hapus subItems jika Anda tidak ingin grup
      // subItems: [
      //   { name: "Aktif", url: "/employee?status=aktif" },
      //   { name: "Tidak Aktif", url: "/employee?status=tidak-aktif" },
      // ],
    },
    {
      name: "Check Clock",
      url: "/checkclock",
      icon: ClockIcon,
      // Hapus subItems jika Anda tidak ingin grup
      // subItems: [
      //   { name: "Waiting Approval", url: "/checkclock?status=waiting-approval" },
      //   { name: "On Time", url: "/checkclock?status=on-time" },
      //   { name: "Late", url: "/checkclock?status=late" },
      //   { name: "Absent", url: "/checkclock?status=absent" },
      //   { name: "Annual Leave", url: "/checkclock?status=annual-leave" },
      //   { name: "Sick Leave", url: "/checkclock?status=sick-leave" },
      // ],
    },
    {
      name: "Letter Management",
      url: "/letter-management",
      icon: ClipboardCheckIcon,
      // Hapus subItems jika Anda tidak ingin grup
      // subItems: [
      //   { name: "Izin", url: "/letter-management?type=izin" },
      //   { name: "Cuti", url: "/letter-management?type=cuti" },
      //   { name: "Sakit", url: "/letter-management?type=sakit" },
      //   { name: "Tugas", url: "/letter-management?type=tugas" },
      // ],
    },
    { name: "Salary Management", url: "/salary", icon: Wallet },
  ],
};

// Tipe untuk data count dari API
interface SidebarCounts {
  employees?: { status?: { [key: string]: number } }; // Ubah ke optional
  checkclock?: { status?: { [key: string]: number } }; // Ubah ke optional
  letters?: { type?: { [key: string]: number } }; // Ubah ke optional
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navItems, setNavItems] = useState(initialNavData.navMain);

  // Bagian useEffect ini sekarang akan menjadi lebih sederhana
  // karena tidak ada lagi sub-item dengan count
  // Jika Anda masih ingin mengambil data count untuk ditampilkan di halaman utama (bukan sidebar)
  // maka Anda bisa memindahkan logic fetchSidebarCounts ke komponen lain atau tetap di sini
  // tetapi tidak perlu mengupdate navItems berdasarkan counts subItems.

  // Jika Anda masih ingin fetch counts, tetapi tidak lagi untuk subItems di sidebar:
  useEffect(() => {
    const fetchSidebarCounts = async () => {
      try {
        const response = await axiosInstance.get<SidebarCounts>('/sidebar-counts');
        const counts = response.data;
        // Anda bisa menggunakan 'counts' ini untuk menampilkan badge di tempat lain,
        // tetapi tidak lagi untuk subItems di sidebar ini.
        console.log("Counts fetched:", counts);
      } catch (error) {
        console.error("Gagal mengambil data count untuk sidebar:", error);
        // Jika gagal, tidak perlu setNavItems lagi, karena sudah initialData
      }
    };

    fetchSidebarCounts();
  }, []); // [] agar hanya dijalankan sekali

  // Jika Anda benar-benar menghapus subItems, maka bagian `updatedNavItems`
  // di dalam `fetchSidebarCounts` juga perlu dihapus atau dimodifikasi,
  // karena tidak ada lagi `item.subItems` untuk di-loop.
  // Untuk saat ini, saya hanya akan mengomentari `subItems` di `initialNavData`.
  // Jika Anda ingin sepenuhnya menghilangkan logika `counts` di `AppSidebar`,
  // maka hapus seluruh `useEffect` dan `SidebarCounts` interface.
  // Saya akan biarkan `useEffect` di atas untuk menunjukkan bagaimana itu bisa diadaptasi.

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!pl-2">
              <Link href="/" className="flex items-center h-full w-full">
                <img src="/images/hris-logo.png" alt="HRIS LOGO" className="h-15 w-auto max-w-full object-contain" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Sekarang navItems akan selalu sesuai dengan initialNavData yang sudah dimodifikasi */}
        <NavMain items={navItems} />
      </SidebarContent>
    </Sidebar>
  );
}
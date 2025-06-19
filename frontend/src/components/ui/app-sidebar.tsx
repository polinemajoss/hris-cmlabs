// hris-cmlabs/frontend/src/components/AppSidebar.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ClockIcon, LayoutDashboardIcon, Table2Icon, Wallet, UserIcon, CalendarClock, FileTextIcon, FileStackIcon, UsersIcon, Banknote } from "lucide-react";

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./sidebar";
import { useAuth } from "../../contexts/AuthContext"; // pastikan path sesuai struktur project Anda
import { NavSecondary } from "./nav-secondary";

// Struktur data statis untuk menu
const initialNavData = {
  navSecondary: [
    {
      title: "Menu",
      subItems: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboardIcon,
        },
        {
          title: "Data Saya",
          url: "/my-data",
          icon: UserIcon,
        },
        {
          title: "Absensi",
          url: "/checkclock",
          icon: ClockIcon,
        },
        {
          title: "Persuratan",
          url: "/letter",
          icon: FileTextIcon,
        },
        {
          title: "Gaji",
          url: "/salary",
          icon: Banknote,
        },
      ],
    },
    {
      title: "Manajemen",
      subItems: [
        {
          title: "Manajemen Karyawan",
          url: "/employee",
          icon: UsersIcon,
        },
        {
          title: "Manajemen Absensi",
          url: "/checkclock-management",
          icon: CalendarClock,
        },
        {
          title: "Manajemen Persuratan",
          url: "/letter-management",
          icon: FileStackIcon,
        },
        {
          title: "Manajemen Gaji",
          url: "/salary-management",
          icon: Wallet,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const [navSecondary, setNavSecondary] = useState(initialNavData.navSecondary);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = user?.role;
    let filteredSecondary: typeof initialNavData.navSecondary = [];
    if (role === "employee") {
      // Hanya tampilkan bagian "Menu" untuk employee
      filteredSecondary = [initialNavData.navSecondary[0]];
    } else if (role === "manager" || role === "hr_admin") {
      filteredSecondary = initialNavData.navSecondary;
    } else if (role === "superadmin") {
      filteredSecondary = initialNavData.navSecondary;
    }
    setNavSecondary(filteredSecondary);
    setIsLoading(false);
  }, [user?.role]); // Jalankan ulang jika role berubah

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
        {navSecondary.length > 0 && (
          <div>
            <NavSecondary items={navSecondary} />
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

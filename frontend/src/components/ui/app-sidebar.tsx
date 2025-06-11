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
      name: "Employee", url: "/employee", icon: UsersIcon, filterQueryParam: 'status',
      subItems: [
        { name: "Aktif", url: "/employee?status=aktif" },
        { name: "Tidak Aktif", url: "/employee?status=tidak-aktif" },
      ],
    },
    {
      name: "Check Clock", url: "/checkclock", icon: ClockIcon, filterQueryParam: 'status',
      subItems: [
        { name: "Waiting Approval", url: "/checkclock?status=waiting-approval" },
        { name: "On Time", url: "/checkclock?status=on-time" },
        { name: "Late", url: "/checkclock?status=late" },
        { name: "Absent", url: "/checkclock?status=absent" },
        { name: "Annual Leave", url: "/checkclock?status=annual-leave" },
        { name: "Sick Leave", url: "/checkclock?status=sick-leave" },
      ],
    },
    {
      name: "Letter Management", url: "/letter-management", icon: ClipboardCheckIcon, filterQueryParam: 'type',
      subItems: [
        { name: "Izin", url: "/letter-management?type=izin" },
        { name: "Cuti", url: "/letter-management?type=cuti" },
        { name: "Sakit", url: "/letter-management?type=sakit" },
        { name: "Tugas", url: "/letter-management?type=tugas" },
      ],
    },
    { name: "Salary Management", url: "/salary", icon: Wallet },
  ],
};

// Tipe untuk data count dari API
interface SidebarCounts {
  employees: { status: { [key: string]: number } };
  checkclock: { status: { [key: string]: number } };
  letters: { type: { [key: string]: number } };
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navItems, setNavItems] = useState(initialNavData.navMain);

  useEffect(() => {
    const fetchSidebarCounts = async () => {
      try {
        const response = await axiosInstance.get<SidebarCounts>('/sidebar-counts');
        const counts = response.data;

        const updatedNavItems = initialNavData.navMain.map(item => {
          if (!item.subItems) return item;

          const updatedSubItems = item.subItems.map(subItem => {
            let count = 0;
            if (item.name === "Employee") {
              count = counts.employees?.status?.[subItem.name] || 0;
            } else if (item.name === "Check Clock") {
              count = counts.checkclock?.status?.[subItem.name] || 0;
            } else if (item.name === "Letter Management") {
              count = counts.letters?.type?.[subItem.name] || 0;
            }
            return { ...subItem, count };
          });
          return { ...item, subItems: updatedSubItems };
        });
        
        setNavItems(updatedNavItems);
      } catch (error) {
        console.error("Gagal mengambil data count untuk sidebar:", error);
        setNavItems(initialNavData.navMain);
      }
    };

    fetchSidebarCounts();
  }, []);

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
        <NavMain items={navItems} />
      </SidebarContent>
    </Sidebar>
  );
}
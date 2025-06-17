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
    },
    {
      name: "Letter Management",
      url: "/letter-management",
      icon: ClipboardCheckIcon,
    },
    { name: "Salary Management", url: "/salary", icon: Wallet },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navItems, setNavItems] = useState(initialNavData.navMain);
  const [isLoading, setIsLoading] = useState(true);
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
"use client";
import * as React from "react";
import Link from "next/link";
import { ClipboardCheckIcon, ClockIcon, CreditCard, HelpCircleIcon, LayoutDashboardIcon, SettingsIcon, User, UsersIcon, Wallet } from "lucide-react";
import { LetterManagementFilters } from "../filters/letter-management-filters";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../components/ui/sidebar";
import { usePathname } from "next/navigation";

const data = {
  navMain: [
    {
      name: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Employee",
      url: "/employee",
      icon: UsersIcon,
      filterQueryParam: 'status', // Parameter di URL akan menjadi ?status=...
      subItems: [
        { name: "Aktif", url: "/employee?status=aktif", count: 1200 },
        { name: "Tidak Aktif", url: "/employee?status=tidak-aktif", count: 34 },
      ],
    },
    {
      name: "Check Clock",
      url: "/checkclock",
      icon: ClockIcon,
      filterQueryParam: 'status',
      subItems: [
        { name: "Waiting Approval", url: "/checkclock?status=waiting-approval", count: 5 },
        { name: "On Time", url: "/checkclock?status=on-time", count: 280 },
        { name: "Late", url: "/checkclock?status=late", count: 32 },
        { name: "Absent", url: "/checkclock?status=absent", count: 8 },
        { name: "Annual Leave", url: "/checkclock?status=annual-leave", count: 14 },
        { name: "Sick Leave", url: "/checkclock?status=sick-leave", count: 9 },
      ],
    },
    {
      name: "Letter Management",
      url: "/letter-management", 
      icon: ClipboardCheckIcon,
      subItems: [
        { name: "Izin", url: "/letter-management?type=izin", count: 18 },
        { name: "Cuti", url: "/letter-management?type=cuti", count: 7 },
        { name: "Sakit", url: "/letter-management?type=sakit", count: 12 },
        { name: "Lainnya", url: "/letter-management?type=lainnya", count: 5 },
      ],
    },
    {
      name: "Salary Management",
      url: "salary",
      icon: Wallet,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!pl-2">
              <Link href="/" className="flex items-center h-full w-full">
                <img
                  src="/images/hris-logo.png"
                  alt="HRIS LOGO"
                  className="h-15 w-auto max-w-full object-contain"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="ml-4">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        
      </SidebarFooter>
    </Sidebar>
  );
}

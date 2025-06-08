"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowUpCircleIcon, BarChartIcon, Calendar1Icon, CameraIcon, ClipboardCheckIcon, ClipboardListIcon, ClockIcon, DatabaseIcon, FileCodeIcon, FileIcon, FileTextIcon, FolderIcon, GemIcon, HelpCircleIcon, LayoutDashboardIcon, ListIcon, SearchIcon, SettingsIcon, UsersIcon } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../components/ui/sidebar";

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
    },
    {
      name: "Check Clock",
      url: "/checkclock",
      icon: ClockIcon,
    },
    {
      name: "Letter Management",
      url: "#",
      icon: ClipboardCheckIcon,
    },
    {
      name: "Payment",
      url: "/payment",
      icon: GemIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const { user } = useAuth();

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
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  );
}

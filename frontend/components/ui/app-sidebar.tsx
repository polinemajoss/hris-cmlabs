"use client"
import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  Calendar1Icon,
  CameraIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  ClockIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavDocuments } from "./nav-document"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { useAuth } from "../../lib/authContext"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar"

const data = {
  
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Employee",
      url: "/employee",
      icon: UsersIcon,
    },
    {
        title: "Check Clock",
        url: "#",
        icon: ClockIcon,
      },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar1Icon,
      },
    {
        title: "Document",
        url: "#",
        icon: ClipboardCheckIcon,
      },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
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
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, } = useAuth()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                {/* <ArrowUpCircleIcon className="h-5 w-5" /> */}
                <img src="/images/hris-logo.png" alt="HRIS LOGO" className="h-15 w-auto object-contain"/>
                
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {/* {user && (
      <NavUser
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar || "/avatars/default.jpg",
        }}
      />
    )}       */}
      {/* {loading ? (
      <div className="px-4 py-2 text-sm text-muted">Loading user...</div>
    ) : user ? (
      <NavUser
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar || "/avatars/default.jpg",
        }}
      />
    ) : null} */}
    </SidebarFooter>
    </Sidebar>
  )
}

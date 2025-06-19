// hris-cmlabs/frontend/src/components/ui/nav-main.tsx
import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

// Asumsi Anda punya komponen-komponen ini dari sidebar Anda
// Menggunakan nama yang disarankan oleh error TypeScript
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton, // Ini sudah ada dan benar
  SidebarContent as SidebarMenuContentWrapper, // Mengganti SidebarMenuContent, pakai alias agar tidak bentrok dengan SidebarContent global
} from "./sidebar"; // Asumsi sidebar.tsx

// Interface untuk item navigasi yang diteruskan dari AppSidebar
export interface NavItem {
  name: string;
  url: string;
  icon: React.ElementType; // Menggunakan React.ElementType untuk komponen ikon
  filterQueryParam?: string;
  subItems?: { name: string; url: string; count?: number }[];
}

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <SidebarMenu>
      {items.map((item) => (
        <React.Fragment key={item.name}>
          {item.subItems && item.subItems.length > 0 ? (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton className={`flex items-center justify-between w-full pr-2 text-gray-700 ${pathname.startsWith(item.url) ? "bg-accent text-accent-foreground" : ""}`}>
                  <div className="flex items-center gap-2">
                    {/* Icon dihapus */}
                    <span>{item.name}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Submenu */}
              <div className="pl-8">
                {item.subItems.map((sub) => (
                  <SidebarMenuItem key={sub.name}>
                    <SidebarMenuButton asChild>
                      <Link href={sub.url} className={`flex items-center gap-2 text-sm w-full text-left ${pathname === sub.url ? "bg-accent text-accent-foreground" : ""}`}>
                        <span>{sub.name}</span>
                        {typeof sub.count === "number" && <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded">{sub.count}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            </>
          ) : (
            // Ini adalah item menu tunggal (misalnya Dashboard, Salary Management)
            <SidebarMenuItem>
              {/* Menggunakan SidebarMenuButton sebagai link tunggal */}
              <SidebarMenuButton asChild>
                <Link href={item.url} className={`flex items-center gap-2 ${pathname === item.url ? "bg-accent text-accent-foreground" : ""}`}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </React.Fragment>
      ))}
    </SidebarMenu>
  );
}

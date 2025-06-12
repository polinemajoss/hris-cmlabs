// hris-cmlabs/frontend/src/components/ui/nav-main.tsx
import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

// Asumsi Anda punya komponen-komponen ini dari sidebar Anda
// Menggunakan nama yang disarankan oleh error TypeScript
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton, // Ini sudah ada dan benar
  SidebarGroup,       // Mengganti SidebarMenuGroup
  SidebarContent as SidebarMenuContentWrapper, // Mengganti SidebarMenuContent, pakai alias agar tidak bentrok dengan SidebarContent global
} from "./sidebar"; // Asumsi sidebar.tsx

// Interface untuk item navigasi yang diteruskan dari AppSidebar
interface NavItem {
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
  const [openGroups, setOpenGroups] = React.useState<string[]>([]); // Untuk mengelola grup yang terbuka

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    );
  };

  return (
    <SidebarMenu> {/* SidebarMenu adalah wrapper utama */}
      {items.map((item) => (
        <React.Fragment key={item.name}>
          {item.subItems && item.subItems.length > 0 ? (
            // Ini adalah grup menu (misalnya Employee, Check Clock, Letter Management)
            <SidebarGroup> {/* Menggunakan SidebarGroup sesuai petunjuk error */}
              <SidebarMenuButton
                onClick={() => toggleGroup(item.name)}
                className={`flex items-center justify-between w-full pr-2 ${
                  pathname.startsWith(item.url) ? "bg-accent text-accent-foreground" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                {openGroups.includes(item.name) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </SidebarMenuButton>
              {openGroups.includes(item.name) && (
                // Menggunakan SidebarMenuContentWrapper sesuai alias
                <SidebarMenuContentWrapper>
                  {item.subItems.map((subItem) => {
                    const isActive =
                      pathname === subItem.url.split('?')[0] &&
                      (item.filterQueryParam
                        ? searchParams.get(item.filterQueryParam) === subItem.url.split('=')[1]
                        : true);
                    return (
                      <SidebarMenuItem key={subItem.url}>
                        {/* Menggunakan SidebarMenuLink sebagai asChild pada SidebarMenuButton atau membuat wrapper Link */}
                        {/* Jika SidebarMenuLink tidak ada, kita bisa menggunakan SidebarMenuButton sebagai wrapper Link */}
                        <SidebarMenuButton asChild> {/* Menggunakan SidebarMenuButton sebagai link */}
                          <Link
                            href={subItem.url}
                            className={`flex items-center justify-between !pl-10 ${
                              isActive ? "bg-accent text-accent-foreground" : ""
                            }`}
                          >
                            {subItem.name}
                            {typeof subItem.count === 'number' && subItem.count > 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {subItem.count}
                                </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenuContentWrapper>
              )}
            </SidebarGroup>
          ) : (
            // Ini adalah item menu tunggal (misalnya Dashboard, Salary Management)
            <SidebarMenuItem>
              {/* Menggunakan SidebarMenuButton sebagai link tunggal */}
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={`flex items-center gap-2 ${
                    pathname === item.url ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
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
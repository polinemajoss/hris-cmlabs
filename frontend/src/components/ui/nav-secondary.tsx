"use client";

import * as React from "react";
import Link from "next/link";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    subItems?: { title: string; url: string; icon?: React.ElementType }[];
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        {items.map((item) => (
          <div key={item.title} className="mb-2">
            <div className="pb-1 pt-3 text-xs font-medium text-gray-500 select-none">{item.title}</div>
            <SidebarMenu>
              {item.subItems?.map((sub) => (
                <SidebarMenuItem key={sub.title}>
                  <SidebarMenuButton asChild>
                    <Link href={sub.url} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-normal text-gray-900 hover:bg-gray-100 transition">
                      {sub.icon && <sub.icon className="h-4 w-4" />}
                      <span>{sub.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

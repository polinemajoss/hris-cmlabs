"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Definisi tipe data
type NavSubItem = {
  name: string;
  url: string;
  count?: number;
};

type NavItem = {
  name: string;
  url: string;
  icon: React.ElementType;
  subItems?: NavSubItem[];
  filterQueryParam?: string;
};

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultAccordionValue = items
    .find(item => item.subItems && pathname.startsWith(item.url))
    ?.url;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={defaultAccordionValue}
    >
      {items.map((item) =>
        item.subItems ? (
          (() => {
            const queryParam = item.filterQueryParam || 'status';
            const allFilterNames = item.subItems.map(si => si.name.toLowerCase());
            const currentFilters = searchParams.get(queryParam)?.split(',').filter(Boolean) || [];

            const handleFilterChange = (toggledFilter: string) => {
              const lowercasedFilter = toggledFilter.toLowerCase();
              let newFilters: Set<string>;
              const isCurrentlyShowAll = currentFilters.length === 0;

              if (isCurrentlyShowAll) {
                newFilters = new Set(allFilterNames);
                newFilters.delete(lowercasedFilter);
              } else {
                newFilters = new Set(currentFilters);
                if (newFilters.has(lowercasedFilter)) {
                  newFilters.delete(lowercasedFilter);
                } else {
                  newFilters.add(lowercasedFilter);
                }
              }
              
              const newSearch = new URLSearchParams(searchParams);
              
              if (newFilters.size === 0 || newFilters.size === allFilterNames.length) {
                newSearch.delete(queryParam);
              } else {
                newSearch.set(queryParam, Array.from(newFilters).join(','));
              }

              router.push(`${pathname}?${newSearch.toString()}`, { scroll: false });
            };

            const handleShowAll = () => {
                const newSearch = new URLSearchParams(searchParams);
                newSearch.delete(queryParam);
                router.push(`${pathname}?${newSearch.toString()}`, { scroll: false });
            };
            
            const isShowAllActive = currentFilters.length === 0;

            return (
              <AccordionItem key={item.name} value={item.url} className="border-b-0">
                <AccordionTrigger
                  onClick={() => router.push(item.url)}
                  className={cn(/* ... */)}
                >
                  <span>
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-left text-sm font-medium">
                    {item.name}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 p-3 pt-1">
                  {/* Tombol Show All dengan styling baru */}
                  <div
                    onClick={handleShowAll}
                    className={cn(
                        "flex cursor-pointer items-center justify-between rounded-md py-2 px-3 transition-all",
                        "hover:bg-muted",
                        // --- 1. STYLE BARU UNTUK "SHOW ALL" SAAT AKTIF ---
                        isShowAllActive && "bg-muted ring-1 ring-border shadow-sm"
                    )}
                  >
                     <span className={cn(
                        "text-sm font-medium",
                        isShowAllActive ? "text-foreground" : "text-muted-foreground"
                     )}>
                        Show All
                     </span>
                     <Checkbox
                        id="show-all"
                        checked={isShowAllActive}
                     />
                  </div>

                  {/* Render sub-item filter dengan styling baru */}
                  {item.subItems.map((subItem) => {
                    const lowercasedName = subItem.name.toLowerCase();
                    const isFilterActive = isShowAllActive || currentFilters.includes(lowercasedName);

                    return (
                      <div
                        key={subItem.name}
                        onClick={() => handleFilterChange(subItem.name)}
                        className={cn(
                            "flex cursor-pointer items-center justify-between rounded-md py-2 px-3 transition-all",
                            "hover:bg-muted",
                            // --- 2. STYLE BARU UNTUK FILTER LAINNYA SAAT AKTIF ---
                            isFilterActive && "bg-muted ring-1 ring-border shadow-sm"
                        )}
                      >
                        <span className={cn(
                          "text-sm font-medium",
                          isFilterActive ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {subItem.name}
                        </span>
                        <div className="flex items-center gap-3">
                          {subItem.count !== undefined && (
                            <Badge variant="secondary" className="rounded-md">
                              {subItem.count}
                            </Badge>
                          )}
                          <Checkbox
                            id={subItem.name}
                            checked={isFilterActive}
                          />
                        </div>
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          })()
        ) : (
          <SidebarMenuItem key={item.name}>
            <Link href={item.url}>
                <SidebarMenuButton className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === item.url && "text-primary bg-muted"
                )}>
                    <item.icon className="h-4 w-4" />
                    {item.name}
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )
      )}
    </Accordion>
  );
}
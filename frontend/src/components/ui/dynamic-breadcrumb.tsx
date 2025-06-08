// Pastikan ini adalah komponen yang menggunakan usePathname, jadi harus "use client"
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link"; // Diperlukan untuk BreadcrumbLink

// Impor komponen breadcrumb Anda
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"; // Sesuaikan path ini

// Peta untuk nama yang mudah dibaca.
// Key adalah segmen URL, Value adalah nama yang ditampilkan.
// Gunakan string kosong untuk root ("/") jika Anda ingin menampilkannya.
const BREADCRUMB_NAMES: Record<string, string> = {
  "/": "Home",
  "dashboard": "Dashboard",
  "employee": "Employee",
  "checkclock": "Check Clock", // Sesuaikan dengan segmen URL Anda
  "calendar": "Calendar",
  "document": "Document",
  "settings": "Settings",
  "profile": "Profile",
  "products": "Products",
  "edit": "Edit",
  // Tambahkan lebih banyak mapping sesuai dengan rute Anda
  // Contoh: "reports": "Reports",
  // Untuk dynamic segments seperti [id], Anda mungkin perlu logika khusus
  // Atau hanya menampilkan ID-nya jika tidak ada mapping.
};

// Komponen Breadcrumb Dinamis Anda
export function DynamicBreadcrumb() {
  const pathname = usePathname();
  // Memisahkan pathname menjadi segmen-segmen.
  // Filter(Boolean) untuk menghapus string kosong dari awal/akhir atau ganda "//".
  const segments = pathname.split('/').filter(Boolean);

  // Jika Anda memiliki pageTitles di SiteHeader, Anda bisa mengintegrasikannya di sini.
  // const title = pageTitles[pathname] || "Page"; // Dari SiteHeader

  // Membangun daftar breadcrumb
  const breadcrumbs = segments.map((segment, index) => {
    // Membangun URL untuk setiap breadcrumb
    const href = '/' + segments.slice(0, index + 1).join('/');
    // Mendapatkan nama yang ditampilkan dari peta, atau menggunakan segmen itu sendiri
    const name = BREADCRUMB_NAMES[segment] || segment.replace(/-/g, ' '); // Ganti dash dengan spasi

    const isLast = index === segments.length - 1;

    return (
      <React.Fragment key={href}>
        <BreadcrumbItem>
          {isLast ? (
            // Jika ini adalah item terakhir, gunakan BreadcrumbPage
            <BreadcrumbPage>{name}</BreadcrumbPage>
          ) : (
            // Jika bukan item terakhir, gunakan BreadcrumbLink
            <BreadcrumbLink asChild>
              <Link href={href}>{name}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />} {/* Jangan tampilkan separator setelah item terakhir */}
      </React.Fragment>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Tambahkan Home jika tidak ada segmen atau Anda ingin selalu ada */}
        {!pathname.startsWith('/') && ( // Ini akan menangani jika path adalah misal '/dashboard'
            <React.Fragment>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {segments.length > 0 && <BreadcrumbSeparator />}
            </React.Fragment>
        )}
        {pathname === "/" && ( // Jika di halaman utama, tampilkan Home sebagai Page
             <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
             </BreadcrumbItem>
        )}
        {pathname !== "/" && breadcrumbs} {/* Tampilkan breadcrumbs hanya jika bukan di root */}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
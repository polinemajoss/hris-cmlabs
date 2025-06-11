"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Bell,
  User,
  LogOut,
  CreditCard,
  MessageCircleQuestion,
  Settings, 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // 1. Impor useAuth
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "../../components/ui/dropdown-menu";
import { Separator } from "./separator";
import { SidebarTrigger } from "./sidebar";
import { DynamicBreadcrumb } from "./dynamic-breadcrumb";
import { Button } from "./button";
import Link from "next/link";
import { Questrial } from "next/font/google";

// Definisikan tipe untuk user mock
interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

// Data mock user
const mockUser: MockUser = {
  id: "mock-user-123",
  name: "Dev User",
  email: "dev@example.com",
  avatar: "https://via.placeholder.com/150/007bff/ffffff?text=DU", // Contoh avatar placeholder
  role: "Admin",
};

export function SiteHeader() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { user, signOut, loading } = useAuth(); // 2. Ambil data 'user' dan fungsi 'signOut' dari context

  const handleSignOut = async () => {
    // 3. Gunakan fungsi signOut dari context
    await signOut(); 
    // Redirect sudah ditangani di dalam fungsi signOut di AuthContext
  };

  const getAvatarUrl = () => {
    if (user?.avatar) {
      // Jika avatar adalah URL lengkap, gunakan langsung
      if (user.avatar.startsWith('http')) {
        return user.avatar;
      }
      // Jika hanya path, gabungkan dengan URL API
      return `${process.env.NEXT_PUBLIC_API_URL}${user.avatar}`;
    }
    // Jika tidak ada avatar, gunakan placeholder dengan inisial nama
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=random&color=fff`;
  }

  return (
    <header className="flex items-center justify-between px-6 py-2 border-b bg-white">
      {/* Kiri - Judul Halaman dan Sidebar Trigger */}
      <div className="flex-1 flex items-center gap-4 overflow-hidden">
        <SidebarTrigger />
        
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-5"
        />

        {/* Judul Halaman */}
        <div className="relative flex-grow max-w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Kanan - Notifikasi dan Profil */}
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative p-2 rounded hover:bg-gray-100"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
            3
          </span>
        </button>

        {/* Dropdown User */}
        {loading ? (
          // Tampilkan placeholder saat loading
          <div className="flex items-center gap-2 text-gray-400 text-sm animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="flex flex-col gap-1">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-3 w-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : user ? (
          // Tampilkan dropdown jika user sudah login
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="flex items-center gap-2 cursor-pointer">
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src={getAvatarUrl()}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col text-left text-sm leading-tight">
                  <span className="font-medium text-gray-800">{user.name}</span>
                  <span className="text-gray-500 text-xs">{(user as any).role || 'User'}</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <Link href="/account">
                  <DropdownMenuItem className="flex cursor-pointer items-center px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <User className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/setting">
                  <DropdownMenuItem className="flex cursor-pointer items-center px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <Link href="/payment">
                  <DropdownMenuItem className="flex cursor-pointer items-center px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                </Link>
                <Link href="/payment">
                  <DropdownMenuItem className="flex cursor-pointer items-center px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <MessageCircleQuestion className="mr-2 h-4 w-4" />
                    FAQ
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="px-4 py-2 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                <LogOut className="mr-2 h-4 w-4 " />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Tampilkan tombol login jika tidak ada user
          <Button variant="outline" size="sm" onClick={() => router.push('/sign-in')}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Bell,
  User,
  LogOut,
  CreditCard,
  UserCircle, // Menggunakan UserCircle dari lucide-react
} from "lucide-react";
// Hapus import useAuth karena tidak ada backend
// import { useAuth } from "../../lib/authContext";
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
  // const { user, signOut } = useAuth(); // Hapus penggunaan useAuth

  // Gunakan mockUser sebagai ganti user dari context
  const user = mockUser;

  const handleSignOut = async () => {
    // Simulasi sign out, tidak ada panggilan API ke backend
    console.log("Simulating sign out...");
    // Mungkin ada logika untuk menghapus item dari localStorage jika Anda menyimpannya di sana
    // localStorage.removeItem("authToken");
    // localStorage.removeItem("user");
    router.push("/sign-in"); // Arahkan ke halaman sign-in
  };

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
        <DynamicBreadcrumb />
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
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src={user.avatar || "/avatars/default.jpg"} // Gunakan avatar mock atau default
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col text-left text-sm leading-tight">
                  <span className="font-medium text-gray-800">{user.name}</span>
                  <span className="text-gray-500 text-xs">{user.role || "User"}</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <UserCircle className="w-8 h-8" />
            Loading... {/* Ini akan jarang terlihat karena user mock langsung ada */}
          </div>
        )}
      </div>
    </header>
  );
}
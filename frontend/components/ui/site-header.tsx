"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Bell,
  User,
  LogOut,
  CreditCard,
  BellIcon,
  UserCircle
} from "lucide-react";
import { useAuth } from "../../lib/authContext"; // sesuaikan path
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "../../components/ui/dropdown-menu";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/employee": "Employee",
  "/check-clock": "Check Clock",
  "/calendar": "Calendar",
  "/document": "Document",
  // tambahkan rute lain bila diperlukan
};

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { user, signOut } = useAuth();
  const title = pageTitles[pathname] || "Page";

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <header className="flex items-center justify-between px-6 py-2 border-b bg-white">
      {/* Kiri - Judul Halaman */}
      <div className="flex-1 hidden md:flex items-center gap-4 overflow-hidden">
      <h1 className="text-xl font-semibold whitespace-nowrap">{title}</h1>
      <div className="relative flex-grow max-w-full">
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
                  src={user.avatar || "/avatars/default.jpg"}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col text-left text-sm leading-tight">
                  <span className="font-medium text-gray-800">{user.name}</span>
                  <span className="text-gray-500 text-xs">roles user</span>
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
                <DropdownMenuItem>
                  <BellIcon className="mr-2 h-4 w-4" />
                  Notifications
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
            Loading...
          </div>
        )}
      </div>
    </header>
  );
}

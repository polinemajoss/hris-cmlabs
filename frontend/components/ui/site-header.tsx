"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Search,
  UserCircle,
  LogOut,
  CreditCard,
  BellIcon,
  UserCircleIcon
} from "lucide-react";
import { useAuth } from "../../lib/authContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "../../components/ui/dropdown-menu"; // sesuaikan path komponen dropdown-menu

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/employee": "Employee",
  // tambahkan route lain di sini
};

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const title = pageTitles[pathname] || "Page";

  const [search, setSearch] = useState("");
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <header className="w-full h-12 border-b flex items-center px-4 gap-4 bg-white">
      {/* Judul Halaman */}
      <h1 className="text-lg font-semibold flex-shrink-0">{title}</h1>

      {/* Search Box */}
      <div className="flex items-center flex-1 max-w-md">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notification Icon */}
      <button
        aria-label="Notifications"
        className="relative p-2 rounded hover:bg-gray-100"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          3
        </span>
      </button>

      {/* User Info & Dropdown */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src={user.avatar || "/avatars/default.jpg"}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircleIcon className="mr-2 h-4 w-4" />
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
    </header>
  );
}
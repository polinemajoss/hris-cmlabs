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
    <header className="w-full h-15 border-b flex items-center px-6 gap-4 bg-white ">
      <SidebarTrigger className="-ml-1" />
      {/* Judul halaman */}
      <h1 className="text-lg font-semibold flex-shrink-0">{title}</h1>

      {/* Search Box */}
      <div className="flex-1 flex items-center mx-4 min-w-0">
      <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
      <input
        type="search"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
      />
      </div>

      {/* Notification Icon & User */}
      <div className="flex items-center space-x-4 flex-shrink-0">
      <button className="p-2 rounded-md hover:bg-gray-100">
        <Bell size={20} />
      </button>
      <div className="flex items-center space-x-2 cursor-pointer select-none">
        <UserCircle2 size={28} className="text-gray-500" />
        <div className="text-sm">
        <div className="font-semibold">username</div>
        <div className="text-xs text-gray-400">roles user</div>
        </div>
      </div>
      </div>
    </header>
  );
}
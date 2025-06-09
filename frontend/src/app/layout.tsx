import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner"; // Impor Toaster

export const metadata: Metadata = {
  title: "HRIs - CMLABS",
  description: "Aplikasi HRIS untuk CMLABS",
  icons: {
    icon: "/images/hris-logo.png",
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <AuthProvider>
          {children}
          <Toaster richColors /> {/* Tambahkan Toaster di sini */}
        </AuthProvider>
      </body>
    </html>
  );
}

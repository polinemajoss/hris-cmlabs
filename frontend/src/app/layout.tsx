import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; // Import provider
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "HRIS - CMLABS",
  description: "Aplikasi HRIS untuk CMLABS",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* AuthProvider membungkus semua konten halaman */}
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
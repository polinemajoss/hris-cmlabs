import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner"; // Impor Toaster

export const metadata: Metadata = {
  title: "HRIS - CMLABS",
  description: "Aplikasi HRIS untuk CMLABS",
  icons: {
    icon: "/favicon.ico",
    shortcut: '/favicon-16x16.png',
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
      },
      {
        rel: "icon",
        url: "/favicon-16x16.png",
        sizes: "16x16",
      },
    ],
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

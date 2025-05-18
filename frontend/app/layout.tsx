import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/authContext"; // import di sini

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HRIS CMLABS",
  description: "Human Resource Information System CMLABS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className}`}>
        <AuthProvider>
          <div className="max-w">
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // 1. (TAMBAHAN) Impor komponen Checkbox
import Image from "next/image";
import { useState } from "react";
import { CheckCircle2Icon, AlertCircleIcon, Eye, EyeOff } from "lucide-react"; // 2. (TAMBAHAN) Impor ikon mata
import Link from "next/link"; // Pastikan Link diimpor dari next/link
import { toast } from "sonner";
import { useRouter } from "next/navigation"; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SignUpPage() {
  const router = useRouter();

  // state untuk form input
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false); // State untuk checkbox
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State untuk visibilitas password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // 4. (PERUBAHAN) Sederhanakan handler, hanya butuh satu fungsi sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi frontend
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      // PERUBAHAN: Gunakan toast.error
      toast.error("Sign Up Failed", {
        description: "Passwords do not match. Please re-enter your password.",
      });
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the terms of use.");
      // PERUBAHAN: Gunakan toast.error
      toast.error("Terms Not Accepted", {
        description: "You must agree to the terms of use to continue.",
      });
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Endpoint API disesuaikan dengan endpoint pendaftaran umum Anda
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/sign-up`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json" // Pastikan backend menerima JSON
         },
        body: JSON.stringify({ 
          first_name: firstName, 
          last_name: lastName,
          name: `${firstName} ${lastName}`, // Backend Laravel mungkin butuh field 'name'
          email, 
          password,
          password_confirmation: confirmPassword // Backend Laravel sering menggunakan ini
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.errors ? Object.values(data.errors).flat().join(' ') : (data.message || "Sign up failed");
        setError(errorMessage);
        // PERUBAHAN: Gunakan toast.error untuk menampilkan error dari backend
        toast.error("Sign Up Failed", {
          description: errorMessage,
        });
      } else {
        setShowSuccessDialog(true);
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
      // PERUBAHAN: Gunakan toast.error untuk network error
      toast.error("Network Error", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-r from-[#1E3A5F] to-[#7CA5BF] bg-size-200 animate-gradient-xy">
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center">
              <CheckCircle2Icon className="h-16 w-16 text-green-500" />
            </div>
            <AlertDialogTitle className="text-center text-xl font-bold pt-4">
              Pendaftaran Berhasil!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Akun Anda telah berhasil dibuat. Silakan masuk untuk melanjutkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              className="w-full cursor-pointer" 
              style={{ background: "linear-gradient(135deg, #7ca5bf 0%, #1e3a5f 70%)", color: "#fff" }}
              onClick={() => router.push('/sign-in')}
            >
              Lanjut ke Halaman Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Card Sign Up */}
      <Card className="w-[560px] z-10 gap-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <Image src="/images/hris-logo.png" alt="HRIS Logo" width={60} height={50} />
          </CardTitle>
          <CardAction>
             {/* Tombol ini bisa Anda arahkan ke halaman pricing atau biarkan */}
            <Button variant="link" style={{ color: "#1E3A5F" }}>
              Login here!
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {/* 5. (PERUBAHAN) Hapus struktur Tabs, langsung tampilkan form */}
          <form onSubmit={handleSignUp}>
            <Card className="shadow-none border-none">
              <CardHeader className="px-1">
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create your account and streamline your employee management.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 px-1">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                {/* Password */}
                <div className="grid gap-2 relative">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-6 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {/* Confirm Password */}
                <div className="grid gap-2 relative">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input id="signup-confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-6 h-7 w-7" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {/* Terms Checkbox */}
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} />
                  <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree with the terms of use of HRIS
                  </label>
                </div>
                {error && <div className="text-red-500 text-sm pt-2">{error}</div>}
              </CardContent>
              <CardFooter className="flex-col gap-4 px-1">
                <Button type="submit" className="w-full" style={{ background: "linear-gradient(90deg, #7ca5bf 0%, #1e3a5f 100%)", color: "#fff" }} disabled={loading}>
                  {loading ? "Signing Up..." : "SIGN UP"}
                </Button>
                <Button variant="outline" className="w-full" type="button">
                  <Image src="/google-logo.svg" alt="Google Logo" width={15} height={15} className="mr-2" />
                  Sign up with Google
                </Button>
              </CardFooter>
            </Card>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <span className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" passHref>
              <Button variant="link" className="p-0 h-auto align-baseline text-blue-600 hover:text-blue-700">
                Sign in here
              </Button>
            </Link>
          </span>
        </CardFooter>
      </Card>
      
      {/* Animasi background tidak diubah */}
      <style jsx global>{`
        /* ... kode @keyframes dan .animate-gradient-xy Anda ... */
      `}</style>
    </div>
  );
}
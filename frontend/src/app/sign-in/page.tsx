"use client";

import { useRouter } from 'next/navigation'; // Pastikan menggunakan 'next/navigation'
import Link from "next/link";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import Image from "next/image";
import { useState } from "react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "../../components/ui/alert"; // Pastikan modul ini sudah diinstal
import { AlertCircleIcon, CheckCircle2Icon} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/lib/axios';

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [loading, setLoading] = useState(false);

  // State untuk form email/phone
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  // State untuk form ID Employee
  const [companyUsername, setCompanyUsername] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [loadingId, setLoadingId] = useState(false);
  const [errorId, setErrorId] = useState("");
  // State untuk alert
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"default" | "destructive" | null>(null);

  // Fungsi submit untuk email/phone
  const handleSignInEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/sign-in', {
        email: emailOrPhone,
        password: password
      });

      const data = response.data;

      // Logika setelah berhasil login kini ditangani oleh context
      if (data.token && data.user) {
        toast.success("Login Berhasil!");
        // Panggil fungsi signIn dari context. 
        // Fungsi ini akan menyimpan token, set user, dan me-redirect ke dashboard.
        signIn(data.user, data.token); 
      } else {
        toast.error("Login Gagal", { description: "Respons dari server tidak valid." });
      }

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Email atau password salah.";
      toast.error("Login Gagal", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fungsi submit untuk ID Employee
  const handleSignInId = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingId(true);
    setErrorId("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/signin-id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyUsername, employeeId, password: employeePassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorId(data.message || "Sign in failed");
        setAlertMessage(data.message || "Sign in failed");
        setAlertType("destructive");
      } else {
        // Berhasil login, redirect atau simpan token sesuai kebutuhan
        setAlertMessage("Success! You have signed in.");
        setAlertType("default");
      }
    } catch (err) {
      setErrorId("Network error");
      setAlertMessage("Network error");
      setAlertType("destructive");
    } finally {
      setLoadingId(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-r from-[#1E3A5F] to-[#7CA5BF] bg-size-200 animate-gradient-xy">
      {/* Alert */}
      {alertMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert variant={alertType}>
            {alertType === "default" ? (
              <CheckCircle2Icon />
            ) : alertType === "destructive" ? (
              <AlertCircleIcon />
            ) : null}
            <AlertTitle>{alertMessage}</AlertTitle>
            {alertType === "destructive" && (
              <AlertDescription>
                Please verify your details and try again.
                <ul className="mt-2 list-disc ml-5 text-sm text-red-600">
                  <li>Check your credentials</li>
                  <li>Ensure correct information</li>
                  <li>Verify input fields</li>
                </ul>
              </AlertDescription>
            )}
          </Alert>
        </div>
      )}

      {/* Card */}
      <Card className="w-[560px] z-10 gap-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <Image src="/images/hris-logo.png" alt="HRIS Logo" width={60} height={50} />
          </CardTitle>
          <CardAction>
            <Button variant="link" style={{ color: "#1E3A5F" }} className="cursor-pointer">
              Try it for free
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email">
            <TabsList className="flex justify-center px-1 py-1" style={{ backgroundColor: "#F5F5F5", width: "fit-content", margin: "0 auto", borderRadius: "14px" }}>
              <TabsTrigger value="email" className="cursor-pointer py-1 px-3 text-#7CA5BF font-medium focus:bg-white focus:outline-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-black" style={{ borderRadius: "12px" }}>
                Sign In with Email
              </TabsTrigger>
              <TabsTrigger value="id" className="cursor-pointer py-1 px-3 text-black font-medium focus:bg-white focus:outline-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-black" style={{ borderRadius: "12px" }}>
                Sign In with ID Employee
              </TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="mt-4">
              <form onSubmit={handleSignInEmail}>
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>Welcome back to HRIS cmlabs! Manage everything with ease.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="email-or-phone">Email or Phone Number</Label>
                      <Input id="email-or-phone" placeholder="Enter your email or phone number" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} required />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember-password" />
                        <Label htmlFor="remember-password">Remember Me</Label>
                      </div>
                      <a href="#" className="text-blue-500 hover:text-blue-700">
                        Forgot Password?
                      </a>
                    </div>
                    {errorEmail && <div className="text-red-500 text-sm">{errorEmail}</div>}
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full"
                      style={{
                        background: "linear-gradient(90deg, #7ca5bf 0%, #1e3a5f 100%)",
                        color: "#fff",
                        border: "none",
                      }}
                      disabled={loadingEmail}
                    >
                      {loadingEmail ? "Signing In..." : "Sign In"}
                    </Button>
                    <Button variant="outline" className="w-full" type="button">
                      {/* Google Logo */}
                      <Image src="/google-logo.svg" alt="Google Logo" width={15} height={15} className="inline-block align-middle" style={{ display: "inline" }} />
                      Sign in with Google
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
            <TabsContent value="id" className="mt-4">
              <form onSubmit={handleSignInId}>
                <Card>
                  <CardHeader>
                    <CardTitle>Sign in with ID Employee</CardTitle>
                    <CardDescription>Please enter your employee ID and password.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="company-username">Company Username</Label>
                      <Input id="company-username" placeholder="Enter your company username" value={companyUsername} onChange={(e) => setCompanyUsername(e.target.value)} required />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="employee-id">Employee ID</Label>
                      <Input id="employee-id" placeholder="Enter your employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="employee-password">Password</Label>
                      <Input id="employee-password" type="password" placeholder="Enter your password" value={employeePassword} onChange={(e) => setEmployeePassword(e.target.value)} required />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember-password" />
                        <Label htmlFor="remember-password">Remember Me</Label>
                      </div>
                      <a href="#" className="text-blue-500 hover:text-blue-700">
                        Forgot Password?
                      </a>
                    </div>
                    {errorId && <div className="text-red-500 text-sm">{errorId}</div>}
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      style={{
                        background: "linear-gradient(30deg, #7ca5bf 0%, #1e3a5f 100%)",
                        color: "#fff",
                        border: "none",
                      }}
                      disabled={loadingId}
                    >
                      {loadingId ? "Signing In..." : "Sign In"}
                    </Button>
                    <Button variant="outline" className="w-full" type="button">
                      {/* Google Logo */}
                      <Image src="/google-logo.svg" alt="Google Logo" width={15} height={15} className="inline-block align-middle" style={{ display: "inline" }} />
                      Sign in with Google
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center">
          <span className="text-sm text-muted-foreground">
            Don’t have an account yet?{" "}
            {/* 2. Bungkus Button dengan Link */}
            <Link href="/sign-up" passHref>
              <Button
                variant="link"
                className="cursor-pointer p-0 h-auto align-baseline text-blue-600 hover:text-blue-700"
              >
                Sign Up now and get started
              </Button>
            </Link>
          </span>
        </CardFooter>
      </Card>


    </div>
  );
}
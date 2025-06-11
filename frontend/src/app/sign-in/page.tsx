"use client";

import { useRouter } from 'next/navigation';
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
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/lib/axios';

export default function SignIn() {
  const { signIn } = useAuth();

  // State untuk form email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  
  // State untuk form ID Employee
  const [companyUsername, setCompanyUsername] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [showEmployeePassword, setShowEmployeePassword] = useState(false);
  const [loadingId, setLoadingId] = useState(false);

  // State untuk "Remember Me"
  const [rememberMe, setRememberMe] = useState(false);
  
  // Memeriksa localStorage saat komponen dimuat
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Fungsi submit untuk email/phone
  const handleSignInEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingEmail(true);

    try {
      const response = await axiosInstance.post('/sign-in', {
        email: email,
        password: password
      });

      const data = response.data;

      if (data.token && data.user) {
        toast.success("Login Berhasil!");
        
        // Logika Remember Me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Panggil signIn dari context (yang sekarang akan me-redirect)
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
      setLoadingEmail(false);
    }
  };

  const handleSignInId = async (e: React.FormEvent) => {
    // ... (logika untuk sign in via ID tetap sama)
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-r from-[#1E3A5F] to-[#7CA5BF] bg-size-200 animate-gradient-xy">
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
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="nama@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required
                          className="pr-10"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember-me"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <Label htmlFor="remember-me" className="cursor-pointer">Remember Me</Label>
                      </div>
                      <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
                        Forgot Password?
                      </Link>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" disabled={loadingEmail}>
                      {loadingEmail ? "Signing In..." : "Sign In"}
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
                    {/* --- IKON MATA UNTUK PASSWORD EMPLOYEE --- */}
                    <div className="grid gap-3">
                      <Label htmlFor="employee-password">Password</Label>
                       <div className="relative">
                        <Input 
                          id="employee-password" 
                          type={showEmployeePassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          value={employeePassword} 
                          onChange={(e) => setEmployeePassword(e.target.value)} 
                          required 
                          className="pr-10"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                          onClick={() => setShowEmployeePassword(!showEmployeePassword)}
                          aria-label={showEmployeePassword ? "Hide password" : "Show password"}
                        >
                          {showEmployeePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
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
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center">
          <span className="text-sm text-muted-foreground">
            Don’t have an account yet?{" "}
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
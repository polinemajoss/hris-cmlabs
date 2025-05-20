"use client";

import { useAuth } from "../../lib/authContext"; // sesuaikan path jika perlu

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import axiosInstance from "../../lib/axios";

export function SignIn({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // Validasi email & phone number
  const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isPhoneNumber = (value: string) => /^[0-9]{10,15}$/.test(value);
  const { setUser } = useAuth(); 

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
  
    if (!emailOrPhone || !password) {
      setError("Please fill all fields.");
      return;
    }
  
    if (!isEmail(emailOrPhone) && !isPhoneNumber(emailOrPhone)) {
      setError("Please enter a valid email or phone number.");
      return;
    }
  
    setLoading(true);
  
    try {
      await axiosInstance.get("/sanctum/csrf-cookie");
  
      const response = await axiosInstance.post("/sign-in", {
        email: emailOrPhone,
        password,
      });
  
      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
      }
  
      const userResponse = await axiosInstance.get("/user");
      console.log("User data:", userResponse.data); // debug
      setUser(userResponse.data);
  
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
    
      if (error.response) {
        setError(`Server error: ${error.response.status} - ${error.response.data.message || "Check your credentials"}`);
      } else if (error.request) {
        setError("No response from server. Check connection.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };
  
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        backgroundImage: "url(/images/background.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {/* Kiri - Logo */}
        <div
          className="hidden md:flex w-1/2 h-full items-center justify-center p-5"
          style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
        >
          <img
            src="/images/hris-logo.png"
            alt="Logo"
            className="w-full max-w-[40%] drop-shadow-[0_0_1px_5px_black]"
          />
        </div>

        {/* Form - Kanan */}
        <div className="bg-white w-1/2 max-h-[95vh] overflow-y-auto rounded-[15px] shadow-md mx-[2%] p-8 pt-12">
          <div className="flex flex-col justify-between items-center gap-7 h-full">
            <div className="flex flex-col justify-between gap-7">
              <div className="flex flex-row items-center justify-between text-sm">
                <img
                  src="/images/hris-logo.png"
                  alt="Logo"
                  style={{
                    width: "15%",
                    maxWidth: "40%",
                    filter: "drop-shadow(0 0 1px 5px #000)",
                  }}
                />
                <a href="#" className="text-blue-600 hover:underline">
                  Try for free!
                </a>
              </div>
              <h2 className="text-2xl font-bold text-left">Sign in</h2>

              <form onSubmit={handleSignIn} className="flex flex-col gap-6 w-full">
                <p>Welcome back to HRIS cmlabs! Manage everything with ease.</p>
                <div className="grid gap-3">
                  <Label htmlFor="emailPhoneNumber">Email or Phone Number</Label>
                  <Input
                    id="emailPhoneNumber"
                    type="text"
                    placeholder="Enter your Email or Phone Number"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    required
                  />
                  {emailOrPhone && !isEmail(emailOrPhone) && !isPhoneNumber(emailOrPhone) && (
                    <p className="text-sm text-red-500">
                      Please enter a valid email or phone number
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                    />
                    <Label htmlFor="remember">Remember Me</Label>
                  </div>
                  <a href="/forgot-password" className="text-blue-600 hover:underline">
                    Forgot Password?
                  </a>
                </div>

                {error && <p className="text-sm text-red-500 -mt-4">{error}</p>}

                <div className="flex flex-col items-center w-full gap-4">
                  <Button
                    type="submit"
                    className="w-full h-[50px] font-bold uppercase"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-[50px] font-bold uppercase flex items-center justify-center gap-3"
                    onClick={() => alert("Google sign-in is not implemented.")}
                  >
                    <img
                      src="/images/google-logo.png"
                      alt="Google Logo"
                      className="w-5 h-5"
                    />
                    Sign in with Google
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-[50px] font-bold uppercase"
                    onClick={() => (window.location.href = "/sign-in/employee")}
                  >
                    Use a different sign-in method
                  </Button>
                </div>
              </form>
            </div>
            <div className="flex flex-col items-center w-full gap-5 mt-0">
              <div className="flex items-center w-full">
                <hr className="flex-grow border-t border-gray-300" />
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account yet?{" "}
                <a href="/sign-up" className="underline underline-offset-4">
                  Sign up now and get started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .left-card {
            width: 50%;
          }
        }

        @media (max-width: 480px) {
          .left-card {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

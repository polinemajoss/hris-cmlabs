"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import router from "next/router";

export function SignInEmployee({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyUsername, setCompanyUsername] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        const data = await res.json();
        setError(data.message || "Email atau password salah");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat login. Coba lagi.");
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
          style={{
            backgroundColor: "rgba(255, 255, 255, 0)",
          }}
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
              <h2 className="text-2xl font-bold text-left">Sign in with ID Employee</h2>

              <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full">
                <p>Welcome back to HRIS cmlabs! Manage everything with ease.</p>
                <div className="grid gap-3">
                  <Label htmlFor="companyUsername">Company Username</Label>
                  <Input
                    id="companyUsername"
                    type="text"
                    placeholder="Enter your Company Username"
                    value={companyUsername}
                    onChange={(e) => setCompanyUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="idEmployee">ID Employee</Label>
                  <Input
                    id="idEmployee"
                    type="text"
                    placeholder="Enter your ID Employee"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                  <a href="../forgotpassword" className="text-blue-600 hover:underline">
                    Forgot Password?
                  </a>
                </div>

                {error && (
                  <p className="text-sm text-red-500 -mt-4">{error}</p>
                )}

                <div className="flex flex-col items-center w-full gap-4">
                  <Button
                    type="submit"
                    className="w-full h-[50px] font-bold uppercase"
                  >
                    Sign In
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-[50px] font-bold uppercase"
                    onClick={() => window.location.href = "/signin"}
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
                <a href="/register" className="underline underline-offset-4">
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

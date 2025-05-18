"use client";

import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Label } from "./label";

export function ForgotPassword({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccess("Link reset password telah dikirim ke email Anda.");
      } else {
        const data = await res.json();
        setError(data.message || "Gagal mengirim link reset password.");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
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
        {/* Form - Kiri */}
        <div className="bg-white w-1/2 max-h-[95vh] overflow-y-auto rounded-[15px] shadow-md mx-[2%] p-8 pt-12">
          <div className="flex flex-col justify-between items-center gap-7 h-full">
            <div className="flex flex-col justify-between gap-7">
              <h1 className="text-2xl font-bold text-center">Forgot Password</h1>

              <form
                onSubmit={handleForgotPassword}
                className="flex flex-col gap-6 w-full"
              >
                <p>
                  No worries! Enter your email address below, and we'll send you
                  a link to reset your password.
                </p>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}

                <div className="flex flex-col items-center w-full gap-4">
                  <Button
                    type="submit"
                    className="w-full h-[50px] font-bold uppercase"
                  >
                    Reset Password
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-[50px] font-bold uppercase"
                    onClick={() => (window.location.href = "/signin")}
                  >
                    Back to sign in
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Kanan - Logo */}
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
      </div>
    </div>
  );
}

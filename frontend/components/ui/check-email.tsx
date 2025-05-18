"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export function CheckEmail({
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
        <div className="bg-white w-1/2 h-[95vh] rounded-[15px] shadow-md mx-[2%] p-8 flex flex-col justify-center">
          <div className="flex flex-col items-center justify-between gap-7 w-full">
            <div className="flex flex-col justify-between gap-7">
            <img
                src="/images/hris-logo.png"
                alt="Logo"
                className="w-[15%] max-w-[40%] drop-shadow-[0_0_1px_5px_black] mx-auto"
            />

                <h1 className="text-2xl font-bold text-center">Check your email</h1>

                <form
                    onSubmit={handleForgotPassword}
                    className="flex flex-col gap-6 w-full"
                >
                    <p className="text-center">
                        We sent a password reset link to your email (uremail@gmail.com) 
                        which valid for 24 hours after receive the email. Please check your inbox!
                    </p>

                    <div className="flex flex-col items-center w-full gap-4">
                        <Button
                            type="submit"
                            className="w-full h-[50px] font-bold uppercase"
                        >
                            Open Gmail
                        </Button>
                    </div>

                    <div className="text-center text-sm">
                        Don&apos;t receive the email?{" "}
                        <a href="/forgot-password" className="underline underline-offset-4">
                        Click here to resend!
                        </a>
                    </div>
                    <div className="mt-4 text-sm flex items-center justify-center">
                        <a href="/signin" className="flex items-center text-gray-700 hover:underline">
                            <img src="/left-arrow.svg" alt="Back" className="w-4 h-4 mr-2" />
                            Back to log in
                        </a>
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

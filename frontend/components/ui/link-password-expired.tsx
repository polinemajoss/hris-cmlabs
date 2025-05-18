"use client";

import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Label } from "./label";

export function LinkExpired({
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

                <h1 className="text-2xl font-bold text-center">Link Expired</h1>

                <form
                    onSubmit={handleForgotPassword}
                    className="flex flex-col gap-6 w-full"
                >
                    <p className="text-center">
                        The password reset link has expired.
                        Please request a new link to reset to your password.
                    </p>

                    <div className="flex flex-col items-center w-full gap-4">
                        <Button
                            type="submit"
                            className="w-full h-[40px] font-bold uppercase"
                            onClick={() => window.location.href = "/signin"}
                        >
                            Back to Sign in
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

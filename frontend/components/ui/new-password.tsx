"use client";

import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Label } from "./label";

export function NewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Simulasikan permintaan ke server di sini
    alert("Password has been reset.");
  };

  return (
    <div className="absolute top-0 left-0 w-full h-screen bg-cover bg-center bg-no-repeat overflow-hidden flex items-center justify-center" style={{ backgroundImage: "url(/images/background.jpeg)" }}>
      <div className="flex justify-center items-center h-full w-full">
        {/* Form - Kiri */}
        <div className="bg-white w-1/2 h-[95vh] rounded-[15px] shadow-md mx-[2%] p-8 flex flex-col justify-center">
          <div className="flex flex-col items-center justify-between gap-7 w-full">
            <h1 className="text-2xl font-bold text-center">Set new password</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
              <div className="text-center">
                <p>Enter your new password below to complete the reset process.</p>
                <p>Ensure it's strong and secure.</p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <p className="text-sm text-gray-500 -mt-4">Must be at least 8 characters.</p>

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col items-center w-full gap-4">
                <Button type="submit" className="w-full h-[50px] font-bold uppercase">
                  Reset Password
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-[50px] font-bold uppercase"
                  onClick={() => window.location.href = "/signin"}
                >
                  Back to sign in
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Kanan - Logo */}
        <div className="hidden md:flex w-1/2 h-full items-center justify-center p-5">
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

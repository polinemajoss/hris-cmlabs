"use client";
import api from "../../lib/axios";
import axios from 'axios';
import { useEffect } from "react";
import { useAuth } from "../../lib/authContext";  
import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Label } from "./label";
import { Checkbox } from "./checkbox";
import { useRouter } from "next/navigation";

export function SignUp({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!agreeTerms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1. Ambil CSRF token dari Sanctum
    await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
      withCredentials: true,
    });

    // 2. Kirim form ke backend Laravel
    const response = await axios.post(
      "http://localhost:8000/api/sign-up",
      {
        name: `${firstName} ${lastName}`,
        email,
        password,
        password_confirmation: confirmPassword,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status === 201 || response.status === 200) {
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => router.push("/sign-in"), 2000);
    } else {
      setError(response.data.message || "Registration failed.");
    }
  } catch (err: unknown) {
    let message = "An unexpected error occurred.";
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      err.response !== undefined
    ) {
      // @ts-ignore
      message = err.response.data?.message ||
        // @ts-ignore
        Object.values(err.response.data?.errors || {})?.[0]?.[0] ||
        message;
    }
    setError(message);
  } finally {
    setLoading(false);
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
      className={className}
      {...props}
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
            backgroundColor: "transparent",
          }}
        >
          <img
            src="/images/hris-logo.png"
            alt="Logo"
            className="w-full max-w-[40%] drop-shadow-[0_0_1px_5px_black]"
          />
        </div>

        {/* Form - Kanan */}
        <div className="bg-white w-full md:w-1/2 max-h-[95vh] overflow-y-auto rounded-[15px] shadow-md mx-[2%] p-8 pt-10">
          <div className="flex flex-col justify-between items-center gap-7 h-full">
            <div className="flex flex-col justify-between gap-7 w-full">
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
                <a href="/sign-in" className="text-blue-600 hover:underline">
                  Sign in here!
                </a>
              </div>
              <h2 className="text-2xl font-bold text-left">Sign Up</h2>

              <form onSubmit={handleSignUp} className="flex flex-col gap-6 w-full">
                <p>Create your account and streamline your employee management</p>
                <div className="flex flex-row gap-4">
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
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
                <div className="grid gap-2">
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
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                  />
                  <Label htmlFor="terms">I agree with terms and conditions</Label>
                </div>

                {error && <p className="text-sm text-red-500 -mt-4">{error}</p>}
                {success && <p className="text-sm text-green-600 -mt-4">{success}</p>}

                <Button
                  type="submit"
                  className="w-full h-[40px] font-bold uppercase"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Sign Up"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-[40px] font-bold uppercase flex items-center justify-center gap-3"
                    onClick={() => window.location.href = "/signup"}
                  >
                    {/* Google logo */}
                    <img
                      src="/images/google-logo.png" // Gantilah dengan path logo Google yang sesuai
                      alt="Google Logo"
                      className="w-5 h-5" // Ukuran logo, bisa disesuaikan
                    />
                    Sign up with Google
                  </Button>
              </form>
            </div>
            <div className="flex items-center w-full">
              <hr className="flex-grow border-t border-gray-300" />
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/sign-in" className="underline underline-offset-4">
                Sign in now
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden.md\\:flex {
            width: 50%;
          }
        }

        @media (max-width: 480px) {
          .hidden.md\\:flex {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../../lib/authContext"; 
import axiosInstance from "../../lib/axios";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error || !token) {
      console.error("OAuth error or no token");
      router.push("/sign-in");
      return;
    }

    localStorage.setItem("token", token);
    console.log("Token stored:", token);

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/user");
        setUser(response.data);
        router.push("/dashboard");
      } catch (err: any) {
        console.error("Failed to fetch user:", err);
        localStorage.removeItem("token");
        router.push("/sign-in");
      }
    };

    fetchUser();
  }, [router, searchParams, setUser]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <p className="text-xl font-medium">Signing in with Google...</p>
    </div>
  );
}

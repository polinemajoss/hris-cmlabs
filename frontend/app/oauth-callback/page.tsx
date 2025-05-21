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

    if (token) {
      localStorage.setItem("token", token);

      // opsional: fetch user jika backend tidak mengembalikannya langsung
      const fetchUser = async () => {
        try {
          const response = await axiosInstance.get("/user");
          setUser(response.data);
          router.push("/dashboard");
        } catch (error) {
          console.error("Error fetching user", error);
          router.push("/sign-in");
        }
      };

      fetchUser();
    }
  }, [searchParams]);

  return <p>Signing in with Google...</p>;
}

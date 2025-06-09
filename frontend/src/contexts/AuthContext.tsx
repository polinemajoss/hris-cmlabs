"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axiosInstance from "../lib/axios";
import router, { useRouter } from "next/navigation";

type User = {
  role: string;
  avatar: string;
  id: string;
  name: string;
  email: string;
  // tambahkan properti lain jika perlu
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (userData: User, token: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // State untuk token
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/user", { withCredentials: true });
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    setToken(storedToken); // Simpan token ke state saat pertama kali dimuat
    if (storedToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      axiosInstance.get("/user")
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          setUser(null);
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // 2. Implementasikan fungsi signIn
  const signIn = (userData: User, token: string) => {
    // Simpan token ke localStorage sebagai bukti login
    localStorage.setItem('auth_token', token);
    // Atur header default axios untuk request selanjutnya
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Simpan data user ke state
    setUser(userData);
    // Arahkan ke halaman utama
    router.push('/');
  };
  
  const signOut = async () => {
    try {
      await axiosInstance.post("/sign-out");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
        // Hapus semua bukti login dari sisi frontend
        localStorage.removeItem('auth_token');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setUser(null);
        router.push('/sign-in');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!token, loading, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};



"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import Cookies from 'js-cookie'; // Gunakan js-cookie untuk manajemen cookie yang lebih mudah

// Tipe data untuk User
interface User {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  avatar?: string;
  // tambahkan properti lain yang dikembalikan oleh API Anda
}

// Tipe untuk nilai yang disediakan oleh Context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (user: User, token: string) => void;
  signOut: () => void;
}

// Buat Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Buat Provider komponen
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cek sesi login saat aplikasi pertama kali dimuat
  useEffect(() => {
    const tokenFromCookie = Cookies.get('auth_token');
    if (tokenFromCookie) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokenFromCookie}`;
      // Ambil data user dari server untuk verifikasi token
      axiosInstance.get('/user')
        .then(response => {
          setUser(response.data);
          setToken(tokenFromCookie);
        })
        .catch(() => {
          // Jika token tidak valid, hapus semuanya
          Cookies.remove('auth_token');
          setUser(null);
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Fungsi signIn yang sudah diperbaiki
  const signIn = (userData: User, token: string) => {
    // 1. Simpan data ke state
    setUser(userData);
    setToken(token);

    // 2. Simpan token ke cookie (lebih aman dari localStorage untuk token)
    Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'strict' });

    // 3. Atur header default untuk semua request axios selanjutnya
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // 4. INI BAGIAN PENTING: Arahkan ke halaman dashboard
    router.push('/');
  };

  const signOut = async () => {
    try {
      await axiosInstance.post("/sign-out");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Hapus semua data otentikasi dari frontend
      setUser(null);
      setToken(null);
      Cookies.remove('auth_token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      // Arahkan kembali ke halaman sign-in
      router.push('/sign-in');
    }
  };

  const value = { user, isAuthenticated: !!token, loading, signIn, signOut };

  // Jangan render apapun sampai proses pengecekan otentikasi selesai
  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="flex h-screen items-center justify-center">Loading...</div> : children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk menggunakan context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
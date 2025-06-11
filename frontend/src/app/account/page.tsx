"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Sesuaikan path jika perlu
import axiosInstance from '@/lib/axios'; // Sesuaikan path jika perlu
import { toast } from 'sonner';

// Import komponen UI yang Anda gunakan
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { SiteHeader } from '@/components/ui/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AvatarUploader } from '@/components/ui/AvatarUploader'; // Asumsi komponen ini sudah ada
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  // State untuk form profil
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // State untuk form ganti password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Mengisi form dengan data user saat data dari context tersedia
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      // Asumsi user object memiliki properti avatar (URL)
      setAvatarUrl((user as any).avatar || null);
    }
  }, [user]);

  // "Penjaga" halaman, jika tidak login, tendang ke sign-in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in');
    }
  }, [user, authLoading, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProfile(true);

    // Kirim data ke backend (endpoint ini perlu Anda buat di Laravel)
    try {
      // Jika ada file avatar baru, upload dulu
      let updatedAvatarUrl = avatarUrl;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const response = await axiosInstance.post('/upload-avatar', formData);
        updatedAvatarUrl = response.data.url;
      }

      // Kirim pembaruan data user
      await axiosInstance.put('/user/profile-information', {
        name: name,
        email: email,
        avatar: updatedAvatarUrl
      });
      
      toast.success('Profil berhasil diperbarui!');
      // Anda mungkin perlu me-refresh data user di context di sini
    } catch (error) {
      toast.error('Gagal memperbarui profil.');
      console.error(error);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error('Password baru tidak cocok.');
      return;
    }
    setIsSubmittingPassword(true);

    try {
      // Kirim data ke backend (endpoint ini perlu Anda buat di Laravel)
      await axiosInstance.put('/user/password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmNewPassword,
      });
      toast.success('Password berhasil diganti!');
      // Kosongkan field password setelah berhasil
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gagal mengganti password.';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  // Tampilkan loading screen jika context masih memeriksa auth
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar variant="inset" />
        <SidebarInset className="flex-1 flex flex-col">
          <SiteHeader />
          <main className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Pengaturan Akun</h1>
              
              {/* Kartu Informasi Profil */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Profil</CardTitle>
                  <CardDescription>Perbarui foto dan detail pribadi Anda di sini.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <Label>Foto Profil</Label>
                        <AvatarUploader onFileSelect={setAvatarFile} initialImageUrl={avatarUrl} />
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <Label htmlFor="name">Nama Lengkap</Label>
                          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmittingProfile}>
                        {isSubmittingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Separator className="my-8" />

              {/* Kartu Ganti Password */}
              <Card>
                <CardHeader>
                  <CardTitle>Ganti Password</CardTitle>
                  <CardDescription>Pastikan Anda menggunakan password yang kuat dan unik.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="current_password">Password Saat Ini</Label>
                      <Input id="current_password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="new_password">Password Baru</Label>
                      <Input id="new_password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="confirm_new_password">Konfirmasi Password Baru</Label>
                      <Input id="confirm_new_password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                    </div>
                    <div className="flex justify-end">
                       <Button type="submit" disabled={isSubmittingPassword}>
                        {isSubmittingPassword ? 'Memperbarui...' : 'Perbarui Password'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

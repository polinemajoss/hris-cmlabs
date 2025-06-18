"use client";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { PaymentDetail } from "../../components/ui/PaymentDetail";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ name: "", type: "" });
  const router = useRouter(); 


  const handlePackageSelect = (packageName: string, packageType: string) => {
    setSelectedPackage({ name: packageName, type: packageType });
    setIsDetailOpen(true);
  };

  const handleGoBack = () => {
  router.back(); 
  };

  return (
      <div className="container mx-auto py-10 px-4 relative"> {/* Pastikan ada 'relative' di sini */}
      <div className="absolute top-4 left-4 z-10"> {/* Tambahkan z-index jika perlu */}
        <Button 
          variant="ghost" 
          // HAPUS size="icon" di sini
          onClick={handleGoBack}
          // Sesuaikan className untuk menampung ikon dan teks
          className="rounded-full px-4 py-2 text-gray-700 hover:bg-gray-200 flex items-center gap-2" 
        >
          <ArrowLeft className="h-5 w-5" /> {/* Ukuran ikon bisa disesuaikan */}
          <span>Kembali</span> {/* HAPUS className="sr-only" di sini */}
        </Button>
      </div>
            <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-900">
        Paket Harga HRIS
      </h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Pilih paket yang paling sesuai dengan bisnis Anda! HRIS ini menawarkan opsi pembayaran berlangganan dan bayar sesuai pemakaian, tersedia dalam paket berikut:
      </p>

      <Tabs defaultValue="package" className="mb-10">
        <TabsList className="flex justify-center gap-4 mx-auto w-fit">
          <TabsTrigger
            value="package"
            className="px-6 py-2 text-sm font-medium border border-gray-300 rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Paket
          </TabsTrigger>
          <TabsTrigger
            value="seat"
            className="px-6 py-2 text-sm font-medium border border-gray-300 rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Harga
          </TabsTrigger>
        </TabsList>
        <TabsContent value="package">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Paket 1 */}
            <Card className="bg-gray-100 border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Standar
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Cocok untuk tim kecil dan startup
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Validasi absensi berbasis GPS
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Manajemen data karyawan
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Permintaan cuti & izin
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Manajemen lembur (regulasi pemerintah)
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Manajemen jadwal kerja tetap
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Perhitungan pajak otomatis
                  </li>
                </ul>
                <Button 
                  className="mt-4 w-full bg-black text-white hover:bg-gray-800"
                  onClick={() => handlePackageSelect("Standar", "Paket")}
                >
                  Pilih Paket →
                </Button>
              </CardContent>
            </Card>

            {/* Paket 2 */}
            <Card className="bg-gray-300 border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Premium
                </CardTitle>
                <p className="text-sm text-gray-500">Terbaik untuk bisnis berkembang</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Semua fitur Standar
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Pengaturan absensi masuk & pulang
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Integrasi fingerprint
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Manajemen dokumen karyawan
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Pengaturan cuti sakit & izin
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Manajemen shift
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Laporan komprehensif
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Manajemen lembur (regulasi pemerintah & custom)
                  </li>
                </ul>
                <Button 
                  className="mt-4 w-full bg-black text-white hover:bg-gray-800"
                  onClick={() => handlePackageSelect("Premium", "Paket")}
                >
                  Pilih Paket →
                </Button>
              </CardContent>
            </Card>

            {/* Paket 3 */}
            <Card className="bg-gray-100 border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Ultra
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Untuk perusahaan dan organisasi besar
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Semua fitur Premium
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Face recognition
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Absensi pulang otomatis
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Dashboard turnover karyawan
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Dashboard custom untuk statistik & analisis
                  </li>
                </ul>
                <Button 
                  className="mt-4 w-full bg-black text-white hover:bg-gray-800"
                  onClick={() => handlePackageSelect("Ultra", "Paket")}
                >
                  Pilih Paket →
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* KONTEN KURSI */}
        <TabsContent value="seat">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {/* Kursi 1 */}
            <Card className="bg-gray-100 border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  STANDAR
                </CardTitle>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-900">Rp 15.000</p>
                </div>
                <p className="text-sm text-gray-500">Untuk 1-50 pengguna per bulan</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Cocok untuk tim kecil hingga 50 karyawan
                </p>
                <Button 
                  className="w-full bg-gray-800 text-white hover:bg-gray-700"
                  onClick={() => handlePackageSelect("Standar", "Kursi")}
                >
                  Upgrade Paket →
                </Button>
              </CardContent>
            </Card>

            {/* Kursi 2 */}
            <Card className="bg-gray-100 border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  PREMIUM
                </CardTitle>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-900">Rp 12.000</p>
                </div>
                <p className="text-sm text-gray-500">Untuk 51-100 pengguna per bulan</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Ideal untuk tim berkembang 51-100 karyawan
                </p>
                <Button 
                  className="w-full bg-gray-800 text-white hover:bg-gray-700"
                  onClick={() => handlePackageSelect("Premium", "Kursi")}
                >
                  Upgrade Paket →
                </Button>
              </CardContent>
            </Card>

            {/* Kursi 3 */}
            <Card className="bg-gray-100 border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  ULTRA
                </CardTitle>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-900">Rp 19.000</p>
                </div>
                <p className="text-sm text-gray-500">Untuk 101+ pengguna per bulan</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Terbaik untuk organisasi besar dengan 101+ karyawan
                </p>
                <Button 
                  className="w-full bg-gray-800 text-white hover:bg-gray-700"
                  onClick={() => handlePackageSelect("Ultra", "Kursi")}
                >
                  Upgrade Paket →
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <PaymentDetail
        packageName={selectedPackage.name}
        packageType={selectedPackage.type}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
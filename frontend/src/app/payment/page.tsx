"use client";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Check } from "lucide-react";
import { useState } from "react";
import { PaymentDetail } from "../../components/ui/PaymentDetail";

export default function PaymentPage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ name: "", type: "" });

  const handlePackageSelect = (packageName: string, packageType: string) => {
    setSelectedPackage({ name: packageName, type: packageType });
    setIsDetailOpen(true);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-900">
        HRIS Pricing Plans
      </h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Choose the plan that best suits your business! This HRIS offers both subscription and pay-as-you-go payment options, available in the following packages:
      </p>

      <Tabs defaultValue="package" className="mb-10">
        <TabsList className="flex justify-center gap-4 mx-auto w-fit">
          <TabsTrigger
            value="package"
            className="px-6 py-2 text-sm font-medium border border-gray-300 rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Package
          </TabsTrigger>
          <TabsTrigger
            value="seat"
            className="px-6 py-2 text-sm font-medium border border-gray-300 rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Seat
          </TabsTrigger>
        </TabsList>
        <TabsContent value="package">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Package 1 */}
            <Card className="bg-gray-100 border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Standard
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Perfect for small teams and startups
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    GPS-based attendance validation
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Employee data management
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Leave & time-off requests
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Overtime management (government regulations)
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Fixed work schedule management
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Automatic tax calculation
                  </li>
                </ul>
                <Button 
                  className="mt-4 w-full bg-black text-white hover:bg-gray-800"
                  onClick={() => handlePackageSelect("Standard", "Package")}
                >
                  Select a Package →
                </Button>
              </CardContent>
            </Card>

            {/* Package 2 */}
            <Card className="bg-gray-300 border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Premium
                </CardTitle>
                <p className="text-sm text-gray-500">Best for growing business</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    All Standard features
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Clock-in & clock-out attendance settings
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Fingerprint integration
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Employee document management
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Sick leave & time-off settings
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Shift management
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Comprehensive reports
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Overtime management (government & custom regulations)
                  </li>
                </ul>
                <Button 
                  className="mt-4 w-full bg-black text-white hover:bg-gray-800"
                  onClick={() => handlePackageSelect("Premium", "Package")}
                >
                  Select a Package →
                </Button>
              </CardContent>
            </Card>

            {/* Package 3 */}
            <Card className="bg-gray-100 border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Ultra
                </CardTitle>
                <p className="text-sm text-gray-500">
                  For large enterprises and organizations
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    All Premium features
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Face recognition
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Automated check-out attendance
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Employee turnover dashboard
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Custom dashboard for statistics & analysis
                  </li>
                </ul>
                <Button 
                  className="mt-4 w-full bg-black text-white hover:bg-gray-800"
                  onClick={() => handlePackageSelect("Ultra", "Package")}
                >
                  Select a Package →
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SEAT CONTENT */}
        <TabsContent value="seat">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {/* Seat 1 */}
            <Card className="bg-gray-100 border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  STANDARD
                </CardTitle>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-900">Rp 15.000</p>
                </div>
                <p className="text-sm text-gray-500">For 1-50 users monthly</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Perfect for small teams with up to 50 employees
                </p>
                <Button 
                  className="w-full bg-gray-800 text-white hover:bg-gray-700"
                  onClick={() => handlePackageSelect("Standard", "Seat")}
                >
                  Upgrade Paket →
                </Button>
              </CardContent>
            </Card>

            {/* Seat 2 */}
            <Card className="bg-gray-100 border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  PREMIUM
                </CardTitle>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-900">Rp 12.000</p>
                </div>
                <p className="text-sm text-gray-500">For 51-100 users monthly</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Ideal for growing teams of 51-100 employees
                </p>
                <Button 
                  className="w-full bg-gray-800 text-white hover:bg-gray-700"
                  onClick={() => handlePackageSelect("Premium", "Seat")}
                >
                  Upgrade Paket →
                </Button>
              </CardContent>
            </Card>

            {/* Seat 3 */}
            <Card className="bg-gray-100 border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  ULTRA
                </CardTitle>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-900">Rp 19.000</p>
                </div>
                <p className="text-sm text-gray-500">For 101+ users monthly</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Best for large organizations with 101+ employees
                </p>
                <Button 
                  className="w-full bg-gray-800 text-white hover:bg-gray-700"
                  onClick={() => handlePackageSelect("Ultra", "Seat")}
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
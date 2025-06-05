import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { useState } from "react";

interface PaymentDetailProps {
  packageName: string;
  packageType: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentDetail({ packageName, packageType, isOpen, onClose }: PaymentDetailProps) {
  const [employeeCount, setEmployeeCount] = useState(2);
  const [selectedBilling, setSelectedBilling] = useState("single");
  const [selectedSize, setSelectedSize] = useState("1-50");

  const handleEmployeeChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setEmployeeCount(prev => prev + 1);
    } else {
      setEmployeeCount(prev => prev > 1 ? prev - 1 : 1);
    }
  };

  // Tentukan harga per user sesuai paket
  const getPricePerUser = () => {
    switch (packageName.toLowerCase()) {
      case "standard":
        return 15000;
      case "premium":
        return 20000;
      case "ultra":
        return 300000;
      default:
        return 17000;
    }
  };
    const pricePerUser = getPricePerUser();
    const subtotal = pricePerUser * employeeCount;

    // Hitung harga per hari
    const pricePerDay = Math.round(pricePerUser / 30);
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto h-full">
        {/* Left Column Card */}
        <Card className="border-0 shadow-none">
          <CardContent className="space-y-6">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src="/images/hris-logo.png" 
                alt="HRIS Logo" 
                width={50} 
                height={50} 
                // className="rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2 uppercase">
                {packageName ? `${packageName}` : "Paket yang dipilih"}
              </h1>
              <h2 className="text-lg mb-2">
                Upgrade to {packageName} ({packageType})
              </h2>
              <button onClick={onClose} className="text-blue-600 hover:underline">
                Change plan
              </button>
            </div>

            {/* Billing Period */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Billing Period</h3>
              <RadioGroup 
                value={selectedBilling}
                onValueChange={setSelectedBilling}
                className="grid grid-cols-2 gap-4"
              >
                <Label className="border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="single" id="single" />
                    <div>
                      <div>Single Payment</div>
                      <div className="text-sm text-gray-500">Rp {pricePerDay.toLocaleString()} / User / Day</div>
                    </div>
                  </div>
                </Label>
                <Label className="border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <div>
                      <div>Monthly</div>
                      <div className="text-sm text-gray-500">Rp {pricePerUser.toLocaleString()} / User</div>
                    </div>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            {/* Size Matters */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Size Matters</h3>
              <p className="text-sm text-gray-600">Choose the right fit for your team!</p>
              <RadioGroup 
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="grid grid-cols-2 gap-4"
              >
                <Label className="border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="1-50" id="1-50" />
                    <span>1 - 50</span>
                  </div>
                </Label>
                <Label className="border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="51-100" id="51-100" />
                    <span>51 - 100</span>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            {/* Number of Employees */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Number of Employees</h3>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleEmployeeChange('decrease')}
                  className="h-10 w-10"
                >
                  -
                </Button>
                <Input 
                  type="number" 
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(parseInt(e.target.value) || 1)}
                  className="w-20 text-center"
                />
                <Button 
                  variant="outline"
                  onClick={() => handleEmployeeChange('increase')}
                  className="h-10 w-10"
                >
                  +
                </Button>
              </div>
            </div>

            <Button className="w-full">Continue to Payment</Button>
          </CardContent>
        </Card>

        {/* Right Column Card */}
        <Card className="bg-gray-100 flex flex-col shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-medium mb-2">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-8 flex-1 flex flex-col">
            <div className="flex-1 space-y-4 text-base">
              <div className="flex justify-between">
                <span className="font-medium">Package</span>
                <span> {packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Billing Period</span>
                <span> {selectedBilling === 'single' ? 'Single Payment' : 'Monthly'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Team Size</span>
                <span> {selectedSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Number of Employees</span>
                <span> {employeeCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Price per User</span>
                <span> Rp {pricePerUser.toLocaleString()}</span>
              </div>
            </div>

            <Separator className="my-10"/>

            <div className="space-y-4 text-base">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Rp 0</span>
              </div>
            </div>

            <Separator className="my-6"/>

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total at renewal</span>
              <span>Rp {subtotal.toLocaleString()}</span>
            </div>

            <Button className="w-full bg-gray-700 text-white hover:bg-gray-600">
              Confirm and upgrade
            </Button>
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  );
}
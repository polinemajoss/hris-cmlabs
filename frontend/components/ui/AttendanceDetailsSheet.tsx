import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from './sheet';

interface AttendanceDetailsProps {
  data: {
    name: string;
    jabatan: string;
    date: string;
    clockIn: string;
    clockOut: string;
    workHours: string;
    status: string;
    location: string;
    address: string;
    lat: string;
    long: string;
    proof: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const AttendanceDetailsSheet: React.FC<AttendanceDetailsProps> = ({ data, isOpen, onClose }) => {
  if (!data) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="max-w-lg w-full p-6">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">Attendance Details</SheetTitle>
          {/* Hanya gunakan SheetClose untuk tombol Close */}
          <SheetClose asChild>
            <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"></button>
          </SheetClose>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-4">
          {/* Employee Info */}
          <div className="flex items-center gap-4 border-b pb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600 uppercase">
              {data.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{data.name}</h3>
              <p className="text-sm text-gray-500">{data.jabatan}</p>
            </div>
          </div>

          {/* Attendance Information */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-2">Attendance Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Date</p>
                <p>{data.date}</p>
              </div>
              <div>
                <p className="text-gray-500">Check In</p>
                <p>{data.clockIn}</p>
              </div>
              <div>
                <p className="text-gray-500">Check Out</p>
                <p>{data.clockOut}</p>
              </div>
              <div>
                <p className="text-gray-500">Work Hours</p>
                <p>{data.workHours}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p>{data.status}</p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-2">Location Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Location</p>
                <p>{data.location}</p>
              </div>
              <div>
                <p className="text-gray-500">Detail Address</p>
                <p>{data.address}</p>
              </div>
              <div>
                <p className="text-gray-500">Lat</p>
                <p>{data.lat}</p>
              </div>
              <div>
                <p className="text-gray-500">Long</p>
                <p>{data.long}</p>
              </div>
            </div>
          </div>

          {/* Proof of Attendance */}
          <div>
            <h4 className="font-semibold mb-2">Proof of Attendance</h4>
            <div className="flex items-center gap-2">
              <p className="text-sm">{data.proof}</p>
              <button className="text-blue-500 hover:underline">View</button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AttendanceDetailsSheet;
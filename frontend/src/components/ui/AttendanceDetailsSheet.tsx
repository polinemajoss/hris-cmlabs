import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from './sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Download, Trash2 } from 'lucide-react';


interface AttendanceDetailsProps {
  data: {
    id: string; // Added id property
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
    approve: boolean;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
}
const AttendanceDetailsSheet: React.FC<AttendanceDetailsProps> = ({ data, isOpen, onClose, onApprove }) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = React.useState(false);

  // Dummy implementation for PDF download
  const handleDownloadPDF = async (attendanceData: typeof data) => {
    if (!attendanceData) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/attendances/${attendanceData.id}/download-pdf`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Sesuaikan dengan mekanisme autentikasi Anda
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${attendanceData.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  };

  // Dummy implementation for delete
const handleDelete = (id: string, name: string) => {
  const confirmDelete = window.confirm(`Anda yakin ingin menghapus data karyawan "${name}" ini?`);
  if (confirmDelete) {
    // Replace this with actual delete logic
    alert(`Data karyawan "${name}" berhasil dihapus.`);
  }
};

  if (!data) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="p-6 sm:max-w-2xl w-full">
        <SheetHeader className="flex flex-row justify-between items-center w-full">
        <SheetTitle className="text-xl font-semibold">Attendance Details</SheetTitle>

          <div className="flex gap-2">
            <button
              onClick={() => handleDownloadPDF(data)}
              className="px-4 py-2 bg-white border border-[#257047] text-[#257047] rounded hover:bg-[#257047] hover:text-white transition"
            >
              Download PDF
            </button>
            <button
              onClick={() => handleDelete(data.id, data.name)}
              className="px-4 py-2 bg-white border border-[#C11106] text-[#C11106] rounded hover:bg-[#C11106] hover:text-white transition"
            >
              Delete
            </button>
          </div>
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
            <div className="ml-auto">
              <span
                className={`px-2 py-1 rounded text-xs ${
                  data.approve
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {data.approve ? 'Status Approve' : 'Waiting Approval'}
              </span>
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
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-2">Proof of Attendance</h4>
            <div className="flex items-center gap-2">
              <p className="text-sm">{data.proof}</p>
              <button className="text-blue-500 hover:underline">View</button>
            </div>
          </div>
          {/* Approve Button */}
          <div className="mt-4">
            <button
              onClick={() => setIsApproveDialogOpen(true)} // Buka dialog persetujuan
              className="px-4 py-2 bg-[#1E3A5F] text-white rounded border border-transparent hover:bg-white hover:text-[#1E3A5F] hover:border-[#1E3A5F] w-full"
              disabled={data.approve}
            >
              {data.approve ? 'Approved' : 'Approve'}
            </button>
          </div>
          <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
            <DialogContent className="max-w-md w-full">
              <DialogHeader>
                <DialogTitle>Approve Attendance</DialogTitle>
                <DialogDescription>
                  Are you sure you want to approve this employee&apos;s attendance?<br />
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2 mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    onApprove(); // Jalankan fungsi approve
                    setIsApproveDialogOpen(false); // Tutup dialog
                  }}
                >
                  Confirm
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AttendanceDetailsSheet;
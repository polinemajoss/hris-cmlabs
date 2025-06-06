'use client';

import { SidebarProvider } from '../../components/ui/sidebar';
import { AppSidebar } from '../../components/ui/app-sidebar';
import { SiteHeader } from '../../components/ui/site-header';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import AddCheckclockSheet from '../../components/ui/AddCheckclockSheet';
import AttendanceDetailsSheet from '../../components/ui/AttendanceDetailsSheet';

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options); // Format: "1 March 2025"
};

type CheckclockData = {
  name: string;
  jabatan: string;
  date: string;
  clockIn: string;
  clockOut: string;
  workHours: string;
  approve: boolean;
  status: string;
};

const initialCheckclockData = [
  { name: 'Juanita', jabatan: 'CEO', date: formatDate(new Date()), clockIn: '08.00', clockOut: '16.30', workHours: '10h 5m', approve: false, status: 'Waiting Approval' },
  { name: 'Shane', jabatan: 'OB', date: formatDate(new Date()), clockIn: '08.00', clockOut: '17.15', workHours: '9h 50m', approve: true, status: 'On Time' },
  { name: 'Miles', jabatan: 'Head of HR', date: formatDate(new Date()), clockIn: '09.00', clockOut: '16.45', workHours: '10h 30m', approve: true, status: 'On Time' },
  { name: 'Flores', jabatan: 'Manager', date: formatDate(new Date()), clockIn: '09.15', clockOut: '15.30', workHours: '6h 15m', approve: true, status: 'Late' },
  { name: 'Henry', jabatan: 'CPO', date: formatDate(new Date()), clockIn: '0', clockOut: '0', workHours: '0', approve: false, status: 'Annual Leave' },
  { name: 'Marvin', jabatan: 'OB', date: formatDate(new Date()), clockIn: '0', clockOut: '0', workHours: '0', approve: true, status: 'Absent' },
  { name: 'Black', jabatan: 'HRD', date: formatDate(new Date()), clockIn: '08.15', clockOut: '17.00', workHours: '9h 45m', approve: true, status: 'On Time' },
  { name: 'Jacob Jones', jabatan: 'Supervisor', date: formatDate(new Date()), clockIn: '0', clockOut: '0', workHours: '0', approve: false, status: 'Sick Leave' },
  { name: 'Ronalds Ricards', jabatan: 'OB', date: formatDate(new Date()), clockIn: '08.00', clockOut: '16.00', workHours: '10h', approve: true, status: 'Late' },
  { name: 'Leslie Alexander', jabatan: 'OB', date: formatDate(new Date()), clockIn: '08.30', clockOut: '16.00', workHours: '8h 30m', approve: false, status: 'Waiting Approval' },
];

import React, { useState } from 'react';

export default function CheckclockPage() {
  // Ambil data buat checkclock
  // Misalnya data ini diambil dari API atau state global
  const [checkclockData, setCheckclockData] = useState([...initialCheckclockData]); // datanya ya qos -awa
  const [approveIdx, setApproveIdx] = useState<number | null>(null);
  type AttendanceDetailsData = CheckclockData & {
    location: string;
    address: string;
    lat: string;
    long: string;
    proof: string;
  };
  const [selectedDetail, setSelectedDetail] = useState<AttendanceDetailsData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  //Ini buat logika approve yaa sayang
  // Handler untuk approve attendance
  const handleApprove = () => {
    if (selectedDetail) {
    setCheckclockData(prev =>
      prev.map(row =>
        row.name === selectedDetail.name
          ? { ...row, approve: true, status: 'On Time' }
          : row
      )
    );
    setSelectedDetail({ ...selectedDetail, approve: true });
  }
  };

  // Handler untuk membuka detail attendance
  const handleViewDetails = (row: CheckclockData) => {
    setSelectedDetail({
      ...row,
      location: '',
      address: '',
      lat: '',
      long: '',
      proof: '',
    });
    setIsDetailOpen(true);
  };

  const filteredData = checkclockData.filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          row.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? row.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
        <div className="flex-1 min-h-screen bg-gray-50">
          <div className="w-full">
            <SiteHeader />
          </div>
          <main className="p-8">
            <section className="flex flex-col gap-4 py-4 md:gap-6 md:py-0">
              <div className="bg-white rounded-xl border shadow px-8 py-6 flex flex-col gap-6 w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h2 className="font-semibold text-lg whitespace-nowrap">Checkclock Overview</h2>
                  <div className="flex gap-3 flex-1">
                    <input
                      type="text"
                      placeholder="Search Employee"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-3 py-1 border rounded text-xs h-8 focus:outline-none focus:border-[#1E3A5F] flex-1 min-w-0"
                      style={{ minHeight: "2rem" }}
                    />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-1 border rounded text-xs h-8 focus:outline-none focus:border-[#1E3A5F]"
                      style={{ minHeight: "2rem" }}
                    >
                      <option value="">All Status</option>
                      <option value="Waiting Approval">Waiting Approval</option>
                      <option value="On Time">On Time</option>
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                    </select>
                    <AddCheckclockSheet />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {/* ...table... */}
                  <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48">Employee Name</TableHead>
                      <TableHead className="w-32">Jabatan</TableHead>
                      <TableHead className="w-25">Clock In</TableHead>
                      <TableHead className="w-25">Clock Out</TableHead>
                      <TableHead className="w-28">Work Hours</TableHead>
                      <TableHead className="w-25 text-center">Approve</TableHead>
                      <TableHead className="w-36 text-center">Status</TableHead>
                      <TableHead className="w-25">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((row, idx) => (
                      <TableRow key={idx}>
                        {/* Employee name */}
                        <TableCell className="w-48">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-base font-normal text-gray-600 uppercase">
                              {row.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)
                              }
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{row.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="w-32">{row.jabatan}</TableCell>
                        <TableCell className="w-25">{row.clockIn}</TableCell>
                        <TableCell className="w-25">{row.clockOut}</TableCell>
                        <TableCell className="w-28">{row.workHours}</TableCell>
                        {/* Approve checkbox */}
                        <TableCell className="w-25 text-center align-middle">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              row.approve
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {row.approve ? <span>&#10003;</span> : <span>&#10007;</span>}
                          </span>
                        </TableCell>
                        <TableCell className="w-30 text-center">
                          <span
                            className={`px-2 py-1 rounded bg-white-100 border text-xs ${
                              row.status === 'Late'
                                ? 'border-yellow-400 text-yellow-700'
                                : row.status === 'On Time'
                                ? 'border-green-400 text-green-700'
                                : row.status === 'Waiting Approval'
                                ? 'border-gray-400 text-gray-700'
                                : 'border-red-400 text-red-700'
                            }`}
                          >
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <button 
                            className="border px-3 py-1 rounded  hover:bg-white hover:text-[#1E3A5F] hover:border-[#1E3A5F]"
                            onClick={() => handleViewDetails(row)}
                            >View
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>

                {/* Attendance Details Sheet */}
                <AttendanceDetailsSheet
                  data={selectedDetail}
                  isOpen={isDetailOpen}
                  onClose={() => setIsDetailOpen(false)}
                  onApprove={handleApprove}
                />
                {/* Pagination, dst */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <select className="border rounded px-2 py-1">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <div>
                  Showing 1 to 10 out of {checkclockData.length} records
                </div>
                <div className="flex space-x-1">
                  <button className="px-2 py-1 border rounded hover:bg-gray-100">&lt;</button>
                  <button className="px-2 py-1 border rounded bg-gray-200">1</button>
                  <button className="px-2 py-1 border rounded hover:bg-gray-100">2</button>
                  <button className="px-2 py-1 border rounded hover:bg-gray-100">3</button>
                  <button className="px-2 py-1 border rounded hover:bg-gray-100">&gt;</button>
                </div>
              </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
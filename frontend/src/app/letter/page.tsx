'use client';

import React, { useState } from 'react';
import { SidebarProvider } from '../../components/ui/sidebar';
import { AppSidebar } from '../../components/ui/app-sidebar';
import { SiteHeader } from '../../components/ui/site-header';

type LetterData = {
  id: number;
  title: string;
  type: string;
  date: string;
  status: string;
};

const initialLetterData: LetterData[] = [
  { id: 1, title: 'Surat Izin', type: 'Izin', date: '2025-06-01', status: 'Approved' },
  { id: 2, title: 'Surat Cuti', type: 'Cuti', date: '2025-06-02', status: 'Pending' },
  { id: 3, title: 'Surat Tugas', type: 'Tugas', date: '2025-06-03', status: 'Rejected' },
];

export default function LetterManagementPage() {
  const [letters, setLetters] = useState(initialLetterData);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLetters = letters.filter((letter) =>
    letter.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <h2 className="font-semibold text-lg whitespace-nowrap">Letter Management</h2>
                  <div className="flex gap-3 flex-1">
                    <input
                      type="text"
                      placeholder="Search Letters"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-3 py-1 border rounded text-xs h-8 focus:outline-none focus:border-[#1E3A5F] flex-1 min-w-0"
                      style={{ minHeight: '2rem' }}
                    />
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Add Letter
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLetters.map((letter) => (
                        <tr key={letter.id}>
                          <td className="border border-gray-300 px-4 py-2">{letter.title}</td>
                          <td className="border border-gray-300 px-4 py-2">{letter.type}</td>
                          <td className="border border-gray-300 px-4 py-2">{letter.date}</td>
                          <td
                            className={`border border-gray-300 px-4 py-2 ${
                              letter.status === 'Approved'
                                ? 'text-green-600'
                                : letter.status === 'Pending'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {letter.status}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <button className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                              Edit
                            </button>
                            <button className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 ml-2">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
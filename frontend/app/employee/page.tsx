"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "../../components/ui/app-sidebar"
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent } from "../../components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Filter, Download, Upload, Plus, Bell, UserCircle2 } from "lucide-react"
import { Toggle } from "../../components/ui/toggle"
import { SiteHeader } from "../../components/ui/site-header"

export default function EmployeeDatabase() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  // Simulasi loading
  setTimeout(() => {
    setEmployees([
      {
        id: 1,
        firstName: "Budi",
        lastName: "Santoso",
        gender: "M",
        user: {
          phone: "08123456789",
          branch: "Jakarta",
          position: "Developer",
          grade: "A",
          status: "active"
        }
      },
      {
        id: 2,
        firstName: "Siti",
        lastName: "Nurhaliza",
        gender: "F",
        user: {
          phone: "08987654321",
          branch: "Bandung",
          position: "Designer",
          grade: "B",
          status: "inactive"
        }
      }
    ])
    setLoading(false)
  }, 1000)
  }, [])


  const currentMonthYear = new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  })

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-col h-full bg-white">
          <SiteHeader />
          {/* Summary Cards */}
          <section className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-6 mb-8">
              <Card className="w-full">
                <CardContent className="py-4 px-6">
                  <h3 className="text-sm text-muted-foreground">Periode</h3>
                  <p className="text-lg font-semibold">{currentMonthYear}</p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardContent className="py-4 px-6">
                  <h3 className="text-sm text-muted-foreground">Total Employee</h3>
                  <p className="text-lg font-semibold">208</p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardContent className="py-4 px-6">
                  <h3 className="text-sm text-muted-foreground">Total New Hire</h3>
                  <p className="text-lg font-semibold">20</p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardContent className="py-4 px-6">
                  <h3 className="text-sm text-muted-foreground">Full Time Employee</h3>
                  <p className="text-lg font-semibold">20</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Table Controls */}
          <section className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4">
            <h2 className="font-semibold text-lg whitespace-nowrap">All Employees Information</h2>
            <div className="flex flex-wrap gap-2">
              <Input type="text" placeholder="Search Employee" className="h-9 w-60" />
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter size={16} />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download size={16} />
                Export
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Upload size={16} />
                Import
              </Button>
              <Button size="sm" className="flex items-center gap-1">
                <Plus size={16} />
                Tambah Data
              </Button>
            </div>
          </section>

          {/* Table */}
          <section className="px-6 pb-6 overflow-x-auto">
            <Table className="min-w-full">
              <TableCaption>A list of your recent employees.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[48px]">No</TableHead>
                  <TableHead className="w-[48px]">Avatar</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Nomor Telepon</TableHead>
                  <TableHead>Cabang</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">No data</TableCell>
                  </TableRow>
                ) : (
                  employees.map((emp, i) => (
                    <TableRow key={emp.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <div className="w-8 h-8 rounded-full bg-gray-300" />
                      </TableCell>
                      <TableCell>{emp.firstName} {emp.lastName}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold
                          ${emp.gender === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                          {emp.gender === 'M' ? 'Laki-Laki' : 'Perempuan'}
                        </span>
                      </TableCell>
                      <TableCell>{emp.user?.phone ?? '-'}</TableCell>
                      <TableCell>{emp.user?.branch ?? '-'}</TableCell>
                      <TableCell>{emp.user?.position ?? '-'}</TableCell>
                      <TableCell>{emp.user?.grade ?? '-'}</TableCell>
                      <TableCell>
                        <Toggle defaultChecked={emp.user?.status === 'active'} />
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <button className="p-1 rounded hover:bg-gray-100" title="View">
                          👁️
                        </button>
                        <button className="p-1 rounded hover:bg-gray-100" title="Edit">
                          ✏️
                        </button>
                        <button className="p-1 rounded hover:bg-gray-100" title="Delete">
                          ❌
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <select className="border rounded px-2 py-1">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <div>
                Showing 1 to 10 out of {employees.length} records
              </div>
              <div className="flex space-x-1">
                <button className="px-2 py-1 border rounded hover:bg-gray-100">&lt;</button>
                <button className="px-2 py-1 border rounded bg-gray-200">1</button>
                <button className="px-2 py-1 border rounded hover:bg-gray-100">2</button>
                <button className="px-2 py-1 border rounded hover:bg-gray-100">3</button>
                <button className="px-2 py-1 border rounded hover:bg-gray-100">&gt;</button>
              </div>
            </div>
          </section>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

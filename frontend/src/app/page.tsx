"use client";

import { useAuth } from "../contexts/AuthContext"; // 1. Impor useAuth
import { useEffect, useState } from "react";
import { AppSidebar } from "../components/ui/app-sidebar";
// ChartAreaInteractive didefinisikan di dalam file ini, tidak perlu import dari components/ui
// import { ChartAreaInteractive } from "../../components/ui/chart-area-interactive";
import { DataTable } from "../components/ui/data-table";
import { SectionCards } from "../components/ui/section-card";
import { SiteHeader } from "../components/ui/site-header";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";

// Import komponen chart yang diperlukan (Recharts dan Shadcn UI chart components)
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "../hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../components/ui/toggle-group";
import {useRouter} from "next/navigation";
import { SectionCardsEmployee } from "@/components/employee/section-card-employee";

// --- START: Definisi ChartAreaInteractive (dipindahkan dari komponen terpisah ke sini jika tidak di-import) ---
const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
]; // shortened for brevity

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Komponen ChartAreaInteractive harus didefinisikan secara terpisah jika di-import
// Jika Anda ingin tetap menuliskannya di file page.tsx, biarkan seperti ini dan
// jangan import dari components/ui/chart-area-interactive
function ChartAreaInteractiveSelfContained() { // Ubah nama untuk menghindari konflik jika ada import lain
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30"); // Gunakan tanggal referensi yang sesuai
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
// --- END: Definisi ChartAreaInteractive ---


// Menyesuaikan tipe data mockTableData dengan yang diharapkan oleh DataTable
const mockTableData = [
  { header: 'ID', id: 1, type: 'Expense', status: 'Pending', target: 'Marketing', limit: '1000', reviewer: 'Admin' },
  { header: 'Status', id: 2, type: 'Income', status: 'Approved', target: 'Sales', limit: '500', reviewer: 'Manager' },
  { header: 'Type', id: 3, type: 'Expense', status: 'Rejected', target: 'HR', limit: '200', reviewer: 'Supervisor' },
  // Tambahkan data sesuai kebutuhan DataTable Anda
];


export default function DashboardPage() {
  const router = useRouter();
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const { isAuthenticated, loading } = useAuth(); // 2. Ambil 'loading' dari context

  // Simulasi loading data dashboard
  useEffect(() => {
    if (loading) {
      return;
    }

    // Hanya jika sudah selesai loading DAN ternyata tidak terautentikasi,
    // baru kita arahkan ke halaman sign-in.
    if (!loading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (dashboardError) {
    return <div className="flex h-screen items-center justify-center bg-white text-red-500">{dashboardError}</div>;
  }
  
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar variant="inset" />
        <SidebarInset className="flex-1 flex flex-col">
          <SiteHeader />
          <div className="flex-1 overflow-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCardsEmployee />
                <div className="px-4 lg:px-6">
                  {/* Panggil ChartAreaInteractiveSelfContained sebagai komponen */}
                  <ChartAreaInteractiveSelfContained /> 
                </div>
                {/* Gunakan mockTableData yang sudah disesuaikan tipenya */}
                <DataTable data={mockTableData} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
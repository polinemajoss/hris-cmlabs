"use client";

import { AppSidebar } from "../../components/ui/app-sidebar";
import { ChartAreaInteractive } from "../../components/ui/chart-area-interactive";
import { DataTable } from "../../components/ui/data-table";
import { SectionCards } from "../../components/ui/section-card";
import { SiteHeader } from "../../components/ui/site-header";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import data from "./data.json";

export default function Page() {
  // const { user, loading } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   // if (!loading && !user) {
  //   //   router.push("/sign-in");
  //   // }
  // }, [loading, user]);

  // if (loading || !user) {
  //   return (
  //     <div className="flex h-screen items-center justify-center bg-white">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
  //     </div>
  //   );
  // }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

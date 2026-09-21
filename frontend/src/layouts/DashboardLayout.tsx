import { Outlet } from "react-router-dom";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useAppearanceStore } from "@/store/appearance.store";

export default function DashboardLayout() {
  const compactSidebar = useAppearanceStore(
    (state) => state.compactSidebar
  );

  return (
    <SidebarProvider
      defaultOpen={!compactSidebar}
      key={compactSidebar ? "compact" : "expanded"}
    >
      <AppSidebar />

      <SidebarInset className="min-w-0">
        <DashboardHeader />

        <main className="min-w-0 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
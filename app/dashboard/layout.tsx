import type { ReactNode } from "react";
import { DashboardSidebar } from "./components/dashboard-sidebar";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 bg-zinc-50 font-sans dark:bg-black">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { AdminSidebar } from "./components/Navigation/AdminSidebar";
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";
import { DashboardPage } from "./features/dashboard/pages";

export const AdminLayout = () => {
  const userRedux = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  // Redirect non-admin users
  if (userRedux?.role !== "ADMIN") {
    navigate("/"); // Redirect to home or another page
    return null;
  }

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 min-w-0 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
    // <DashboardPage></DashboardPage>
  );
};

import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { AdminSidebar } from "./components/Navigation/AdminSidebar";
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";

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
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

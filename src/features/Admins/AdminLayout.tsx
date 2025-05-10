import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { AdminSidebar, BreadcrumbNav } from "./components/Navigation";
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";
import { SidebarInset } from "@/components/ui/shadcn/sidebar";
import { USER_ROLES } from "@/constants";

export const AdminLayout = () => {
  const userRedux = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const [openButton, setOpenButton] = useState(false); // handle showing the sidebar using icon button
  const [openHover, setOpenHover] = useState(false); // handle showing the sidebar using mouse hover

  useEffect(() => {
    document.title = "Admin | Intellab";
  }, []);

  useEffect(() => {
    if (!userRedux || userRedux?.role !== USER_ROLES.ADMIN) {
      navigate("/");
    }
  }, [userRedux]);

  const handleSidebarMouseEnter = () => {
    if (!openButton) {
      setOpenHover(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    if (!openButton) {
      setOpenHover(false);
    }
  };

  let layout = null;
  if (userRedux && userRedux?.role === USER_ROLES.ADMIN) {
    layout = (
      <SidebarProvider open={!openButton ? openHover : openButton} onOpenChange={setOpenButton}>
        <div className="flex flex-1">
          <AdminSidebar onMouseEnter={handleSidebarMouseEnter} onMouseLeave={handleSidebarMouseLeave} />
          <SidebarInset className="flex-1">
            <BreadcrumbNav />
            <div className="flex-1 p-4">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return layout;
};

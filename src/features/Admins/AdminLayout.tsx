import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { AdminSidebar, BreadcrumbNav } from "./components/Navigation";
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";
import { SidebarInset } from "@/components/ui/shadcn/sidebar";
import { USER_ROLES } from "@/constants";
import { useEditingCourse } from "./features/course/hooks";
import { resetCreateCourse, initialState } from "@/redux/createCourse/createCourseSlice";

export const AdminLayout = () => {
  const userRedux = useSelector((state: RootState) => state.user.user);
  const createCourseRedux = useSelector((state: RootState) => state.createCourse);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isEditingCourse } = useEditingCourse();

  const [openButton, setOpenButton] = useState(false); // handle showing the sidebar using icon button

  useEffect(() => {
    document.title = "Admin | Intellab";
  }, []);

  useEffect(() => {
    if (!userRedux || userRedux?.role !== USER_ROLES.ADMIN) {
      navigate("/");
    }
  }, [userRedux]);

  useEffect(() => {
    if (!isEditingCourse && createCourseRedux !== initialState) {
      dispatch(resetCreateCourse());
    }
  }, [isEditingCourse]);

  let layout = null;
  if (userRedux && userRedux?.role === USER_ROLES.ADMIN) {
    layout = (
      <SidebarProvider open={openButton} onOpenChange={setOpenButton}>
        <div className="flex flex-1">
          <AdminSidebar />
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

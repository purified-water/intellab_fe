import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  Users,
  GraduationCap,
  User,
  Settings,
  Bell,
  Sun,
  LogOut,
  FileCode
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/shadcn/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { AvatarIcon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useNavigate } from "react-router-dom";
import { logoutSuccess } from "@/redux/auth/authSlice";
import INTELLAB_LOGO from "@/assets/logos/intellab_default.svg";
import { userLocalStorageCleanUp } from "@/utils";
import { clearUser } from "@/redux/user/userSlice";

interface AdminSidebarProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { title: "Users", icon: Users, href: "/admin/users" },
  { title: "Courses", icon: GraduationCap, href: "/admin/courses" },
  { title: "Problems", icon: FileCode, href: "/admin/problems" }
];

interface DropdownMenuItem {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick: (navigate: (path: string) => void, userRedux?: { userId?: string }) => void;
}

const dropdownMenuItems: DropdownMenuItem[] = [
  {
    label: "Profile",
    icon: User,
    onClick: (navigate, userRedux) => navigate(`/profile/${userRedux?.userId}`)
  },
  {
    label: "Settings",
    icon: Settings,
    onClick: (navigate) => navigate("/profile/edit")
  },
  {
    label: "Notifications",
    icon: Bell,
    onClick: (navigate) => navigate("/notification")
  },
  {
    label: "Light Theme",
    icon: Sun,
    onClick: () => {
      // TODO: implement theme switching
    }
  }
];

export function AdminSidebar(props: AdminSidebarProps) {
  const { onMouseEnter, onMouseLeave } = props;

  const location = useLocation();
  const pathname = location.pathname;
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRedux = useSelector((state: RootState) => state.user.user);

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(logoutSuccess());
    userLocalStorageCleanUp();
    navigate("/");
  };

  const renderHeader = () => (
    <SidebarHeader className="py-4">
      <div className="flex flex-col group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <div className="flex items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
          <div className="mr-2 group-data-[collapsible=icon]:mr-0">
            <img src={INTELLAB_LOGO} alt="Intellab Logo" className="w-10 h-10" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-xl font-bold text-appPrimary">Intellab</span>
            <span className="text-sm font-medium text-transparent bg-gradient-to-r from-appPrimary to-appAccent bg-clip-text">
              Admin Page
            </span>
          </div>
        </div>
      </div>
    </SidebarHeader>
  );

  const renderBody = () => (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                  <Link to={item.href} className="flex items-center group-data-[collapsible=icon]:justify-center">
                    <item.icon
                      className={cn(
                        "mr-2 group-data-[collapsible=icon]:mr-0",
                        pathname === item.href ? "text-appPrimary" : "text-gray3"
                      )}
                    />
                    <span
                      className={cn(
                        pathname === item.href ? "text-appPrimary" : "text-gray3",
                        "group-data-[collapsible=icon]:hidden font-semibold text-base"
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );

  const renderDropdownMenuItems = () =>
    dropdownMenuItems.map((item, index) => (
      <DropdownMenuItem key={index} onClick={() => item.onClick(navigate, userRedux!)} className="cursor-pointer">
        <item.icon className="w-8 h-8 mr-2" />
        <span className="text-base">{item.label}</span>
      </DropdownMenuItem>
    ));

  const renderFooter = () => (
    <SidebarFooter className="border-t group-data-[collapsible=icon]:border-t-0">
      <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-md py-1 px-2 hover:bg-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1">
              <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
                <AvatarIcon src={userRedux?.photoUrl ?? ""} alt="Avatar" />
                <div className="flex flex-col items-start text-sm group-data-[collapsible=icon]:hidden">
                  <span className="text-base font-semibold">{`${userRedux?.firstName} ${userRedux?.lastName}`}</span>
                  <span className="text-xs text-gray3">{userRedux?.email}</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-0">
            <div className="flex items-center gap-3 p-3 border-b">
              <AvatarIcon src={userRedux?.photoUrl ?? ""} alt="Avatar" />
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{`${userRedux?.firstName} ${userRedux?.lastName}`}</span>
                <span className="text-xs text-gray3">{userRedux?.email}</span>
              </div>
            </div>
            <div className="p-1">{renderDropdownMenuItems()}</div>
            <div className="p-1 border-t">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 w-7 h-7" />
                <span className="text-base">Logout</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SidebarFooter>
  );

  return (
    <Sidebar collapsible="icon" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
    </Sidebar>
  );
}

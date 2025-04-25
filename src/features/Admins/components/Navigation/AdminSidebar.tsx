import React from "react";
import { NavLink } from "react-router-dom";
import { Grid, Users, Book, AlertTriangle, ChevronDown } from "lucide-react";
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
import { Button } from "@/components/ui/shadcn/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: Grid },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Courses", url: "/admin/courses", icon: Book },
  { title: "Problems", url: "/admin/problems", icon: AlertTriangle }
];

export function AdminSidebar() {
  return (
    <Sidebar className="border-r border-gray-200 bg-gray-50">
      {/* Header */}
      <SidebarHeader>
        <div className="p-4 flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">i</span>
          </div>
          <h1 className="text-lg font-bold text-purple-600">Intellab</h1>
        </div>
        <div className="px-4 pb-4">
          <p className="text-sm text-purple-500">Admin Page</p>
        </div>
      </SidebarHeader>

      {/* Navigation Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        asChild
                        className={`flex items-center space-x-2 ${
                          isActive ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <div>
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Section */}
      <SidebarFooter>
        <div className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-sm">👤</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-800">Admin Name</span>
                    <span className="text-xs text-gray-500">adminEmail@gmail.com</span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Notifications</DropdownMenuItem>
              <DropdownMenuItem>Light Theme</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

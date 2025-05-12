import * as React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/shadcn/sidebar";

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
}

export function BreadcrumbNav({ items: propItems }: BreadcrumbNavProps) {
  const location = useLocation();
  const pathname = location.pathname;

  // Generate breadcrumb items based on the current pathname
  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean);

    // Always start with Home
    const items: BreadcrumbItem[] = [
      {
        label: "Home page",
        href: "/admin/dashboard"
      }
    ];

    // Add path segments
    if (paths.length > 0) {
      const currentPath = paths[paths.length - 1];
      items.push({
        label: currentPath.charAt(0).toUpperCase() + currentPath.slice(1),
        href: `/${currentPath}`,
        active: true
      });
    }

    return items;
  };

  const breadcrumbItems = propItems || generateBreadcrumbItems();

  return (
    <div className="flex items-center px-4 h-14 bg-background">
      <SidebarTrigger className="mr-2" />
      <div className="flex items-center text-sm text-muted-foreground">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <React.Fragment key={item.href}>
              {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
              {isLast || item.active ? (
                <span className={item.active ? "font-medium text-gray2" : "text-gray4 "}>{item.label}</span>
              ) : (
                <Link to={item.href} className="transition-colors hover:text-gray4">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

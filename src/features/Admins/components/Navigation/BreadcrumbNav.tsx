import * as React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/shadcn/sidebar";
import { steps as courseSteps } from "@/features/Admins/features/course/constants/CreateCourseSteps";
import { steps as problemSteps } from "@/features/Admins/features/problem/constants/CreateProblemSteps";

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
}

/**
 * Format a path segment to a readable label
 * Handles hyphenated paths like "judge-management" -> "Judge Management"
 */
const formatPathToLabel = (path: string): string => {
  return path
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

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

    // Check if we're in the course creation flow
    if (pathname.includes("/courses/create")) {
      // Add Courses item
      items.push({
        label: "Courses",
        href: "/admin/courses"
      });

      // Add friendly label for the course creation step
      if (paths.length > 0) {
        const currentPath = paths[paths.length - 1];
        // Find matching step from constants
        const matchingStep = courseSteps.find((step) => step.path === currentPath);

        items.push({
          label: matchingStep?.label || formatPathToLabel(currentPath),
          href: `/admin/courses/create/${currentPath}`,
          active: true
        });
      }
    } else if (pathname.includes("/problems/create")) {
      // Add Problems item
      items.push({
        label: "Problems",
        href: "/admin/problems"
      });

      // Add friendly label for the problem creation step
      if (paths.length > 0) {
        const currentPath = paths[paths.length - 1];
        // Find matching step from constants
        const matchingStep = problemSteps.find((step) => step.path === currentPath);

        items.push({
          label: matchingStep?.label || formatPathToLabel(currentPath),
          href: `/admin/problems/create/${currentPath}`,
          active: true
        });
      }
    } else {
      // Regular breadcrumb for non-course-creation pages
      if (paths.length > 0) {
        const currentPath = paths[paths.length - 1];
        items.push({
          label: formatPathToLabel(currentPath),
          href: `/${currentPath}`,
          active: true
        });
      }
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

"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const routes = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/dashboard/book-session", label: "Book Session" },
  { path: "/view-session", label: "View Sessions" },
  { path: "/make-suggestion", label: "Make Suggestion" },
  { path: "/view-suggestion", label: "View Suggestions" },
  { path: "/dashboard/ask-question", label: "Ask for help" },
];

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter((segment) => segment !== "");
  const breadcrumbItems = segments.map((segment, index) => {
    const currentPath = "/" + segments.slice(0, index + 1).join("/");
    const routeConfig = routes.find((route) => route.path === currentPath);
    const isLastSegment = index === segments.length - 1;

    return (
      <BreadcrumbItem key={currentPath} className="block">
        {isLastSegment ? (
          <BreadcrumbPage>{routeConfig?.label || segment}</BreadcrumbPage>
        ) : (
          <span className="flex items-center gap-1">
            <BreadcrumbLink href={currentPath}>
              {routeConfig?.label || segment}
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </span>
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
    </Breadcrumb>
  );
}

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
  { path: "/tester", label: "Data Fetching Testing" },
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
          <div className="flex items-center gap-1">
            <BreadcrumbLink href={currentPath}>
              {routeConfig?.label || segment}
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </div>
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

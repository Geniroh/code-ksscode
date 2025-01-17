"use client";

import * as React from "react";

import { NavMain } from "@/components/app-sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex items-end gap-1">
          <Image
            src="/images/logo-black.png"
            alt="Codematic Logo"
            height={40}
            width={40}
          />
          {state === "expanded" && (
            <span className="font-space-grotesk text-[#18181b] text-[24px] font-bold">
              Ksscode
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

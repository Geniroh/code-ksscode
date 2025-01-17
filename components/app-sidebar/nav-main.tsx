"use client";

import {
  LayoutDashboard,
  BookOpen,
  MessageSquareDiff,
  CalendarRange,
  ChevronRight,
  ChartNoAxesCombined,
} from "lucide-react";

import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const links = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Session",
    url: "#",
    icon: CalendarRange,
    isActive: true,
    items: [
      {
        title: "Add a session",
        url: "/dashboard/book-session",
      },
      {
        title: "Upcoming session",
        url: "/dashboard/view-session",
      },
    ],
  },
  {
    title: "Suggestion",
    url: "#",
    icon: MessageSquareDiff,
    items: [
      {
        title: "Make a KSS Suggestion",
        url: "/dashboard/make-suggestion",
      },
      {
        title: "View Suggestions",
        url: "/dashboard/suggestion",
      },
    ],
  },
  {
    title: "Help Desk",
    url: "#",
    icon: BookOpen,
    items: [
      {
        title: "Request Help",
        url: "/dashboard/ask-question",
      },
      {
        title: "Offer help",
        url: "/dashboard/questions",
      },
    ],
  },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {links.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.items ? (
              <Collapsible
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <div>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subItem.url}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ) : (
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={pathname === item.url}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarGroupLabel>Others</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuButton
          asChild
          tooltip={"Leaderboard"}
          isActive={pathname === "/leaderboard"}
        >
          <Link href={"/leaderboard"}>
            <ChartNoAxesCombined />
            <span>Leaderboard</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarGroup>
  );
}

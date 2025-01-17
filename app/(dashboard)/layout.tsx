// import DashboardLeftSideBar from "@/components/navigation/DashboardLeftSideBar";
// import React from "react";
// import DashboardTopNav from "@/components/navigation/DashboardTopNav";

// const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <div className="h-screen w-full flex" suppressHydrationWarning>
//       <div className="flex">
//         <DashboardLeftSideBar />
//       </div>
//       <div className="w-full">
//         <DashboardTopNav />
//         <div className="p-4 md:p-6 bg-offwhite flex w-full h-[calc(100vh-70px)] overflow-y-auto ">
//           <div className=" p-6 pt-3 w-full">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

import { AppSidebar } from "@/components/app-sidebar/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, signOut } from "@/auth";
import { LogOut, Grip } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { DynamicBreadcrumb } from "@/components/app-sidebar/BreadcrumbList";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const authResult = await auth();
  const user = authResult?.user ?? { image: "", name: "" };
  return (
    <SidebarProvider suppressHydrationWarning>
      <AppSidebar />
      <SidebarInset>
        <header className="flex min-h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex-between w-full px-4 py-3">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </div>

            <div className="flex gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <Avatar>
                    <AvatarImage
                      src={user?.image}
                      alt={user?.name || "User Avatar"}
                    />
                    <AvatarFallback>
                      {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <Grip className="text-gray-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <form
                      action={async () => {
                        "use server";

                        await signOut({ redirectTo: "/" });
                      }}
                    >
                      <button
                        type="submit"
                        className="flex gap-1 items-center cursor-pointer"
                      >
                        <LogOut size={12} className="text-gray-400" /> Logout
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;

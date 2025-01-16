import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, signOut } from "@/auth";
import { Menu, LogOut } from "lucide-react";
import NavLinks from "./NavLinks";
import { Grip } from "lucide-react";
import Link from "next/link";

const DashboardTopNav = async () => {
  const authResult = await auth();
  const user = authResult?.user ?? { image: "", name: "" };

  return (
    <div className="h-[70px] w-full flex-between px-4 shadow-sm gap-6 md:gap-10">
      <div className="w-full">
        <div className="flex-between max-w-3xl">
          <div className="text-heading text-2xl font-bold">
            <Link href="/dashboard">Dashboard</Link>
          </div>
          {/* <div className="bg-offwhite h-[40px] hidden items-center px-4 py-2 md:min-w-[400px] rounded-2xl sm:flex gap-2 focus:outline-none outline-none">
            <Search className="text-heading" />
            <input
              type="text"
              name="query"
              className="search-input"
              placeholder="Search Start"
            />
          </div> */}
        </div>
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

        <Sheet>
          <SheetTrigger className="sm:hidden">
            <Menu />
          </SheetTrigger>
          <SheetContent className="sm:hidden">
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription>
                <NavLinks showTextOnSm />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default DashboardTopNav;

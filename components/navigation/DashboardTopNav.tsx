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
import { auth } from "@/auth";
import { Search, Menu } from "lucide-react";
import NavLinks from "./NavLinks";

const DashboardTopNav = async () => {
  const { user = {} } = await auth();

  return (
    <div className="h-[70px] w-full flex-between px-4 shadow-sm gap-6 md:gap-10">
      <div className="w-full">
        <div className="flex-between max-w-3xl">
          <div className="text-heading text-2xl font-bold">Dashboard</div>
          <div className="bg-offwhite h-[40px] hidden items-center px-4 py-2 md:min-w-[400px] rounded-2xl sm:flex gap-2 focus:outline-none outline-none">
            <Search className="text-heading" />
            <input
              type="text"
              name="query"
              className="search-input"
              placeholder="Search Start"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={user?.image}
                alt={user?.name || "User Avatar"}
              />
              <AvatarFallback>
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
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

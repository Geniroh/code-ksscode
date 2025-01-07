import React from "react";
import Image from "next/image";
import Link from "next/link";
import NavLinks from "./NavLinks";

const DashboardLeftSideBar = () => {
  return (
    <section className="hidden sm:flex flex-col sm:w-[90px] lg:w-[246px] px-4 border-r border-gray-200 bg-white shadow-sm">
      {/* Logo Section */}
      <div className="h-[70px] flex items-center">
        <Link href="/">
          <div className="flex items-end gap-2">
            <Image
              src="/images/logo.png"
              alt="Codematic Logo"
              height={40}
              width={40}
            />
            <span className="font-space-grotesk text-primary hidden lg:block text-[24px] font-bold">
              Ksscode
            </span>
          </div>
        </Link>
      </div>

      {/* Sidebar Links */}
      <NavLinks />
    </section>
  );
};

export default DashboardLeftSideBar;

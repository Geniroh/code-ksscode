import Image from "next/image";
import Link from "next/link";
import React from "react";

const DashboardTopNav = () => {
  return (
    <nav className="flex-between w-full dark:shadow-none gap-5 h-[80px] px-4">
      <Link href="/" className="flex items-center gap-1">
        <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
        <p className="font-space-grotesk max-sm:hidden">
          <span className=" text-primary text-[24px] font-bold hidden md:block">
            Ksscode
          </span>
        </p>
      </Link>

      <p>Global Search</p>

      <div className="flex-between gap-5">Mobile Nav</div>
    </nav>
  );
};

export default DashboardTopNav;

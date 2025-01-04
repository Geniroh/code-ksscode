"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { TbCalendarPlus } from "react-icons/tb";
import { FaQuestion } from "react-icons/fa";

const DashboardLeftSideBar = () => {
  const pathname = usePathname();

  console.log(pathname);
  return (
    <div className="h-[calc(100vh-80px)] hidden md:flex border-[3px] border-red-600 w-[166px] p-4 flex-col gap-4">
      <div>
        <Link
          href="/dashboard/book-session"
          className={`flex flex-col items-center gap-2 hover:bg-[#E3E3E3] px-1 py-3 rounded-[10px]`}
        >
          <TbCalendarPlus className="text-3xl" />
          <p className="text-xs text-body">Book Session</p>
        </Link>
        <Link
          href="/dashboard/ask-question"
          className={`flex flex-col items-center gap-2 hover:bg-[#E3E3E3] px-1 py-3 rounded-[10px]`}
        >
          <FaQuestion className="text-3xl" />
          <p className="text-xs text-body">Ask a question</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardLeftSideBar;

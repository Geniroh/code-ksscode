"use client";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import {
  SquarePlus,
  CalendarRange,
  MessageCircleQuestion,
  MessageSquareDiff,
} from "lucide-react";
import Link from "next/link";

const sidebarLinks = [
  {
    title: "Add",
    href: "dashboard/book-session",
    desc: "Book a session",
    iconSrc: SquarePlus,
  },
  {
    title: "Upcoming",
    href: "dashboard/view-session",
    desc: "Upcoming session",
    iconSrc: CalendarRange,
  },
  {
    title: "Questions",
    href: "dashboard/ask-question",
    desc: "Ask a question",
    iconSrc: MessageCircleQuestion,
  },
  {
    title: "Suggestions",
    href: "dashboard/suggestions",
    desc: "Topic suggestion",
    iconSrc: MessageSquareDiff,
  },
];

const DashboardLeftSideBar = () => {
  const pathname = usePathname();

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
      <div className="mt-8 space-y-4">
        {sidebarLinks.map((link) => {
          const isActive = pathname?.includes(link.href);

          return (
            <a
              key={link.href}
              href={`/${link.href}`}
              title={link.desc}
              className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                isActive ? "bg-blue-100 text-blue-600" : "text-gray-600"
              } hover:bg-gray-100`}
            >
              <link.iconSrc
                className={`w-6 h-6 ${
                  isActive ? "text-blue-600" : "text-gray-400"
                }`}
              />
              <div className="hidden lg:block">
                <p className="font-semibold">{link.title}</p>
                <p className="text-sm text-gray-500">{link.desc}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardLeftSideBar;

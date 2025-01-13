"use client";
import React from "react";

import {
  SquarePlus,
  CalendarRange,
  MessageCircleQuestion,
  MessageSquareDiff,
} from "lucide-react";
import { usePathname } from "next/navigation";
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
    href: "dashboard/questions",
    desc: "Answer or ask a question",
    iconSrc: MessageCircleQuestion,
  },
  {
    title: "Suggestions",
    href: "dashboard/suggestion",
    desc: "Topic suggestion",
    iconSrc: MessageSquareDiff,
  },
];

interface NavLinksProps {
  showTextOnSm?: boolean;
}

const NavLinks = ({ showTextOnSm = false }: NavLinksProps) => {
  const pathname = usePathname();
  return (
    <div className="mt-8 space-y-4">
      {sidebarLinks.map((link) => {
        const isActive = pathname?.includes(link.href);

        return (
          <Link
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
            <div
              className={`text-left ${
                showTextOnSm ? "block" : "hidden lg:block"
              }`}
            >
              <p className="font-semibold">{link.title}</p>
              {/* <p className="text-sm text-gray-500">{link.desc}</p> */}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default NavLinks;

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full h-[80px] px-4 flex-between">
      <div className="flex items-end gap-1">
        <Image
          src="/images/logo.png"
          alt="Codematic Logo"
          height={40}
          width={40}
        />

        <span className="font-space-grotesk text-primary text-[24px] font-bold hidden md:block">
          Ksscode
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="secondary" size="lg">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/register">Get Started</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;

import Image from "next/image";
import React from "react";

const Footer = () => {
  // Get the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full h-[150px] bg-primary-gradient">
      <div className="w-full h-full bg-white flex flex-col items-center justify-center ">
        <div className="flex items-end gap-1">
          <Image
            src="/images/logo.png"
            alt="Codematic Logo"
            height={32}
            width={32}
          />

          <span className="font-space-grotesk my-primary-text-gradient text-[20px] font-bold">
            Ksscode
          </span>
        </div>

        <div className="text-body text-sm">&copy; {currentYear}</div>
      </div>
    </footer>
  );
};

export default Footer;

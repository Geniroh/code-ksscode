"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 items-center md:gap-16 h-[calc(100vh-80px)] overflow-hidden px-4">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center md:text-left"
        >
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-heading md:text-6xl">
              Empower Your Team with Knowledge
            </h1>
            <p className="mt-4 text-lg text-body md:text-xl font-light">
              Book a knowledge sharing session, attend a session, Share skills,
              request help, and collaborate on projects - all in one place.
            </p>
            <Button size={"lg"}>
              <div className="p-1 bg-white rounded-sm">
                <Image
                  src="/icons/google.svg"
                  alt="google"
                  width={16}
                  height={16}
                />
              </div>
              <Link href="register" className="text-md">
                Sign up with workspace
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="hidden md:flex"
      >
        <div className="relative w-full min-h-[500px] p-8 rounded-lg overflow-hidden flex justify-center items-center">
          {/* ADD Infinite pulse animation */}
          <div className="absolute bg-red-400 w-60 animate-pulse-slow h-48 rounded-lg shadow-lg top-[10%] left-[5%]"></div>
          <div className="absolute bg-green-500 w-60 h-60 animate-pulse-slow rounded-lg shadow-lg top-[50%] left-[30%]"></div>
          <div className="absolute bg-blue-500 w-60 animate-pulse-slow h-[200px] rounded-lg shadow-lg top-[20%] right-[10%]"></div>
        </div>
      </motion.div>
    </section>
  );
}

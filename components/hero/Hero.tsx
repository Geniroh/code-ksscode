"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative flex items-center justify-center h-[calc(100vh-80px)] border-[3px] border-red-500">
      {/* Central Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center"
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-heading md:text-6xl">
            Empower Your Team with Knowledge
          </h1>
          <p className="mt-4 text-lg text-body md:text-xl">
            Share skills, request help, and collaborate on projects - all in one
            place.
          </p>
          <Button size={"lg"}>
            <Image
              src="/icons/google.svg"
              alt="google"
              width={24}
              height={24}
            />
            <span className="text-[20px]">Sign up with Google</span>
          </Button>
        </div>
      </motion.div>

      {/* Rotating Divs */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-16 h-16 bg-primary rounded-full top-10 left-10"
      ></motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-16 h-16 bg-secondary rounded-full top-10 right-10"
      ></motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-16 h-16 bg-red-500 rounded-full bottom-10 left-10"
      ></motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-16 h-16 bg-primary rounded-full bottom-10 right-10"
      ></motion.div>
    </div>
  );
}

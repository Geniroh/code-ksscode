"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LeaderboardSection = () => {
  const contributions = [
    {
      id: 1,
      title: "Knowledge Sharing:",
      description:
        "Earn points for creating and sharing valuable content, tutorials, and resources.",
      iconClass: "bg-primary-gradient",
    },
    {
      id: 2,
      title: "Helping Others:",
      description:
        "Get rewarded for answering questions and assisting team members with their learning goals.",
      iconClass: "bg-primary-gradient",
    },
    {
      id: 3,
      title: "Collaborative Projects:",
      description:
        "Gain recognition for initiating and participating in team projects that foster skill development.",
      iconClass: "bg-primary-gradient",
    },
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeInVariants = (direction: string) => ({
    hidden: { opacity: 0, x: direction === "left" ? -50 : 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  });

  return (
    <div className="py-24 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto px-6"
      >
        <div className="mx-auto max-w-2xl lg:mx-0">
          {/* Heading */}
          <motion.h2 className="my-h1" variants={fadeUpVariants}>
            Top Contributors
          </motion.h2>
          {/* Subheading */}
          <motion.p
            className="mt-6 my-p-regular"
            variants={fadeUpVariants}
            transition={{ delay: 0.2 }}
          >
            Recognize and celebrate the most active members of your community.
            Points are awarded for knowledge sharing, helping others, and
            collaborative contributions.
          </motion.p>
        </div>
        <motion.div
          className="max-w-xl text-base leading-7 lg:col-span-7"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.ul
            role="list"
            className="mt-8 space-y-8 text-muted-foreground"
          >
            {contributions.map((item, index) => (
              <motion.li
                key={item.id}
                className="flex gap-x-3"
                variants={fadeInVariants(index % 2 === 0 ? "left" : "right")}
              >
                <span
                  className={`mt-1 h-5 w-5 flex-none rounded-full ${item.iconClass}`}
                />
                <span className="my-p-body">
                  <strong className="my-h2">{item.title}</strong>{" "}
                  {item.description}
                </span>
              </motion.li>
            ))}
          </motion.ul>
          <Button className="mt-8" size="lg" asChild>
            <Link href="/leaderboard">View Leaderboard</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex w-full items-start"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInVariants("right")}
      >
        <Image
          src="/images/leaderboard.png"
          alt="Leaderboard"
          width={400}
          height={400}
          className="rounded-2xl object-contain w-full"
        />
      </motion.div>
    </div>
  );
};

export default LeaderboardSection;

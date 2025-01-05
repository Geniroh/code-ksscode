"use client";

import { motion } from "motion/react";
import { CheckCircle, Users, BookOpen, Rocket } from "lucide-react";

const features = [
  {
    name: "Help Request System",
    description:
      "Easily request assistance or learning opportunities in specific areas.",
    icon: CheckCircle,
  },
  {
    name: "Knowledge Sharing",
    description:
      "Share insights, resources, or tutorials on new skills with your team.",
    icon: BookOpen,
  },
  {
    name: "Collaboration",
    description:
      "Work together on meaningful projects to foster growth and innovation.",
    icon: Users,
  },
  {
    name: "Skill Development",
    description:
      "Track your progress and enhance your skills through continuous learning.",
    icon: Rocket,
  },
];

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
};

const fadeInRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
};

const Features = () => {
  return (
    <div className="py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.p className="mt-2 my-h1" variants={fadeUpVariants}>
            Everything you need to boost knowledge sharing
          </motion.p>
          <motion.p
            className="mt-6 my-p-regular font-light"
            variants={fadeUpVariants}
            transition={{ delay: 0.2 }}
          >
            Ksscode provides a comprehensive set of tools to facilitate skill
            development and collaboration within your team.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl lg:mt-24 lg:max-w-4xl">
          <motion.dl
            className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-6 lg:max-w-none lg:grid-cols-2 lg:gap-y-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="relative pl-16"
                variants={
                  index % 2 === 0 ? fadeInLeftVariants : fadeInRightVariants
                }
              >
                <dt className="my-h2">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-gradient">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 my-p-body font-light !leading-normal">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </motion.div>
    </div>
  );
};

export default Features;

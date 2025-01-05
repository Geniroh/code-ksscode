// "use client";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";

// const LeaderboardSection = () => {
//   const contributions = [
//     {
//       id: 1,
//       title: "Knowledge Sharing:",
//       description:
//         "Earn points for creating and sharing valuable content, tutorials, and resources.",
//       iconClass: "bg-primary-gradient",
//     },
//     {
//       id: 2,
//       title: "Helping Others:",
//       description:
//         "Get rewarded for answering questions and assisting team members with their learning goals.",
//       iconClass: "bg-primary-gradient",
//     },
//     {
//       id: 3,
//       title: "Collaborative Projects:",
//       description:
//         "Gain recognition for initiating and participating in team projects that foster skill development.",
//       iconClass: "bg-primary-gradient",
//     },
//   ];

//   return (
//     <div className="py-24">
//       <div className="mx-auto px-6">
//         <div className="mx-auto max-w-2xl lg:mx-0">
//           <h2 className={`my-h1`}>Top Contributors</h2>
//           <p className={`mt-6 my-p-regular`}>
//             Recognize and celebrate the most active members of your community.
//             Points are awarded for knowledge sharing, helping others, and
//             collaborative contributions.
//           </p>
//         </div>
//         <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12">
//           <div className={`relative lg:order-last lg:col-span-5`}>
//             <Image
//               src="/images/leaderboard.png"
//               alt="Leaderboard"
//               width={400}
//               height={400}
//               className="aspect-[4/3] rounded-2xl object-cover"
//             />
//           </div>
//           <div className={`max-w-xl text-base leading-7 lg:col-span-7`}>
//             <ul role="list" className="mt-8 space-y-8 text-muted-foreground">
//               {contributions.map((item) => (
//                 <li key={item.id} className="flex gap-x-3">
//                   <span
//                     className={`mt-1 h-5 w-5 flex-none rounded-full ${item.iconClass}`}
//                   />
//                   <span className="my-p-body">
//                     <strong className="my-h2">{item.title}</strong>{" "}
//                     {item.description}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//             <Button className="mt-8" size="lg">
//               View Full Leaderboard
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeaderboardSection;

"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
    <div className="py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // Start animation when 30% of the section is visible
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
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12">
          {/* Image */}
          <motion.div
            className="relative lg:order-last lg:col-span-5"
            variants={fadeInVariants("right")}
          >
            <Image
              src="/images/leaderboard.png"
              alt="Leaderboard"
              width={400}
              height={400}
              className="aspect-[4/3] rounded-2xl object-cover"
            />
          </motion.div>
          {/* List */}
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
            <Button className="mt-8" size="lg">
              View Full Leaderboard
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardSection;

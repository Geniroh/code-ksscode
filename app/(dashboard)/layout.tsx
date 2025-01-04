import DashboardLeftSideBar from "@/components/navigation/DashboardLeftSideBar";
import DashboardRightSideBar from "@/components/navigation/DashboardRightSideBar";
import DashboardTopNav from "@/components/navigation/DashboardTopNav";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full border-[3px] border-blue-800 bg-[#F5F5F5]">
      <DashboardTopNav />

      <div className="flex">
        <DashboardLeftSideBar />

        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-10 max-md:pb-14 ">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>

        <DashboardRightSideBar />
      </div>
      {children}
    </div>
  );
};

export default DashboardLayout;

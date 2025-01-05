import DashboardLeftSideBar from "@/components/navigation/DashboardLeftSideBar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React from "react";
import DashboardTopNav from "@/components/navigation/DashboardTopNav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full flex">
      <div className="flex">
        <DashboardLeftSideBar />
      </div>
      <div className="w-full">
        <DashboardTopNav />
        <div></div>
        <div className="p-4 md:p-6 bg-[#fafbfc]">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;

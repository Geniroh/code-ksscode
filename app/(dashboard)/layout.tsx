import DashboardLeftSideBar from "@/components/navigation/DashboardLeftSideBar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full border-[3px] border-red-500 flex">
      <div className="flex">
        <DashboardLeftSideBar />
      </div>
      <div className="w-full border-[3px] border-green-600">
        <div className="h-[70px] w-full border-[3px] border-black"></div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;

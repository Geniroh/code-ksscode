import DashboardLeftSideBar from "@/components/navigation/DashboardLeftSideBar";
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
        <div className="p-4 md:p-6 bg-offwhite flex w-full h-[calc(100vh-70px)] overflow-y-auto ">
          <div className=" p-6 pt-3 w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

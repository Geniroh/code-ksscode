"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { CalendarDays, Users, Clock, BarChart } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { useFetchData } from "@/hooks/use-query";
import { customFormatDate, format12HTime } from "@/lib/utils";
import Link from "next/link";

const DashboardPage = () => {
  const { data, isLoading } = useFetchData(`/session`);

  return (
    <div className="p-3 space-y-6">
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Session Duration
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.5 hours</div>
            <p className="text-xs text-muted-foreground">
              -0.1 hours from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Student Satisfaction
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9/5</div>
            <p className="text-xs text-muted-foreground">
              +0.1 from last month
            </p>
          </CardContent>
        </Card>
      </div> */}

      <Card className="!border-none">
        <CardHeader>
          <CardTitle className="text-heading">Upcoming Sessions</CardTitle>
        </CardHeader>

        {isLoading ? (
          <CardContent>
            <div className="flex gap-2 items-center leading-6 py-2 text-sm">
              <RefreshCw size={12} className="text-heading animate-spin" />{" "}
              Getting Sessions...
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <ul className="space-y-2">
              {data?.map((session: ISession) => (
                <Link href="view-session" key={session.id}>
                  <li
                    key={session.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium text-heading text-sm">
                        {session.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {customFormatDate(session?.date.toString())}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {format12HTime(session?.startTime)}
                    </p>
                  </li>
                </Link>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;

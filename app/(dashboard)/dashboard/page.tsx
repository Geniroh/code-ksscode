"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCw, Telescope } from "lucide-react";
import { useFetchData } from "@/hooks/use-query";
import { format12HTime, getTimeOfDay } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Image from "next/image";

const DashboardPage = () => {
  const date = new Date(); // Current date

  const { data: session } = useSession();
  const { data, isLoading } = useFetchData(
    `/session?date=${date}&limit=5`,
    "get-recent-session"
  );
  const { data: questions, isLoading: isGettingQuestions } = useFetchData(
    `/question?limit=5`,
    "get-questions"
  );

  return (
    <div className="p-3 space-y-6">
      <div className="flex flex-col items-center justify-center w-full  py-4 bg-[#fafafa] rounded-lg">
        <div className="text-sm font-light">{format(date, "EEEE, MMMM d")}</div>
        <div className="font-semibold">
          Good {getTimeOfDay(date)} {session?.user.name?.split(" ")[0]}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="!border-none">
          <CardHeader>
            <CardTitle className="border-b pb-2 flex-between">
              <span>Upcoming Sessions</span>
              <Link
                href="/dashboard/book-session"
                className="text-xs font-medium flex gap-1 items-center hover:bg-offwhite px-2 py-2"
              >
                <Plus size={14} />
                Book a session
              </Link>
            </CardTitle>
          </CardHeader>

          {isLoading ? (
            <CardContent>
              <div className="flex gap-2 items-center leading-6 py-2 text-sm">
                <RefreshCw size={12} className="text-heading animate-spin" />{" "}
                Getting Sessions...
              </div>
            </CardContent>
          ) : (
            <>
              {data?.length > 0 ? (
                <CardContent>
                  <ul className="space-y-2 min-h-[200px]">
                    {data?.map((session: ISession) => (
                      <Link href="/dashboard/view-session" key={session.id}>
                        <li
                          key={session.id}
                          className="flex justify-between items-center border-b pb-2"
                        >
                          <div>
                            <p className="font-medium text-heading text-sm">
                              {session.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {/* {customFormatDate(session?.date.toString())} */}
                              {format(session?.date, "MMMM d, yyyy")}
                            </p>
                          </div>
                          <p className="text-sm font-medium">
                            {format12HTime(session?.startTime)}
                          </p>
                        </li>
                      </Link>
                    ))}
                  </ul>

                  <div className="mt-3">
                    {data?.length >= 5 && (
                      <Link href="/dashboard/view-session">
                        <div className="flex justify-center items-center gap-1 text-xs text-primary">
                          <span>View all</span>
                          <Telescope size={12} />
                        </div>
                      </Link>
                    )}
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  <div className="w-full min-h-[200px] flex flex-col items-center justify-center">
                    <Image
                      src="/icons/empty.svg"
                      width={130}
                      height={130}
                      alt="No data"
                    />
                    <p className="text-xs text-center w-[150px] mx-auto mt-3 md:pl-5">
                      No upcoming session
                    </p>
                  </div>
                </CardContent>
              )}
            </>
          )}
        </Card>

        <Card className="!border-none">
          <CardHeader>
            <CardTitle className="border-b pb-2 flex-between">
              <span>Requested Help</span>
              <Link
                href="/dashboard/ask-question"
                className="text-xs font-medium flex gap-1 items-center hover:bg-offwhite px-2 py-2"
              >
                <Plus size={14} />
                Ask for help
              </Link>
            </CardTitle>
          </CardHeader>

          {isGettingQuestions ? (
            <CardContent>
              <div className="flex gap-2 items-center leading-6 py-2 text-sm">
                <RefreshCw size={12} className="text-heading animate-spin" />{" "}
                Loading help requests...
              </div>
            </CardContent>
          ) : (
            <>
              {questions && questions?.length > 0 ? (
                <CardContent>
                  <ul className="space-y-2 min-h-[200px]">
                    {questions?.map((question: IQuestionWithTag) => (
                      <Link
                        href={`/question/${question?.id}`}
                        key={question?.id}
                      >
                        <li
                          key={question?.id}
                          className="flex justify-between items-center border-b pb-2"
                        >
                          <div>
                            <p className="font-medium text-heading text-sm">
                              {question?.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(question?.createdAt, "MMMM d, yyyy")}
                            </p>
                          </div>
                        </li>
                      </Link>
                    ))}
                  </ul>

                  <div className="mt-3">
                    {questions?.length >= 5 && (
                      <Link href="/dashboard/questions">
                        <div className="flex justify-center items-center gap-1 text-xs text-primary">
                          <span>View all</span>
                          <Telescope size={12} />
                        </div>
                      </Link>
                    )}
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  <div className="w-full min-h-[200px] flex flex-col items-center justify-center">
                    <Image
                      src="/icons/no-help.svg"
                      width={130}
                      height={130}
                      alt="No data"
                    />
                    <p className="text-xs text-center w-[150px] mx-auto mt-3 md:pl-5">
                      No help requested
                    </p>
                  </div>
                </CardContent>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

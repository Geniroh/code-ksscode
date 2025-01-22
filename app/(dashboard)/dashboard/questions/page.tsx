"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/use-query";
import Link from "next/link";
import React from "react";
import { getTimeStamp } from "@/lib/utils";
import TagCard from "@/components/card/TagCard";
import MarkdownTruncate from "@/components/MarkdownTruncate";
import { RefreshCw } from "lucide-react";
import Image from "next/image";

const QuestionPage = () => {
  const { data: questions, isLoading } = useFetchData(
    `/question`,
    "get-all-question"
  );

  return (
    <div className="p-4 md:pt-6">
      <div className="flex-between">
        <h1 className="text-2xl font-bold mb-4">All Question</h1>

        <Button asChild size={"sm"} className="bg-heading2">
          <Link href="/dashboard/ask-question" className="text-sm">
            Ask a question
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex gap-2 items-center justify-center leading-6 min-h-10 py-2 text-sm mt-6 bg-white">
          <RefreshCw size={12} className="text-heading animate-spin" /> Loading
          questions...
        </div>
      ) : (
        <>
          {questions?.length > 0 ? (
            <div className="space-y-3 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {questions?.map((question: IQuestionWithTag) => (
                <div
                  className="w-full p-6 bg-[#fafafa] min-h-10 rounded-md shadow-sm flex"
                  key={question.id}
                >
                  <div className="flex gap-3 items-start">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={question?.user?.image}
                        alt={question?.user?.name || "User Avatar"}
                      />
                      <AvatarFallback>
                        {question?.user?.name
                          ? question?.user.name.charAt(0).toUpperCase()
                          : "?"}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h1 className="text-primary capitalize leading-6 ">
                        <Link href={`/question/${question.id}`}>
                          {question?.title}
                        </Link>
                      </h1>
                      <div className="flex gap-2">
                        {question?.tags?.map((tag: ITag) => (
                          <TagCard
                            key={tag.id}
                            _id={tag.id || ""}
                            name={tag.name}
                            compact
                            isButton
                          />
                        ))}
                      </div>
                      <MarkdownTruncate
                        data={question?.content || ""}
                        max={30}
                        className="text-sm mt-3"
                      />

                      <div>
                        <span className="text-[10px] font-light text-body">
                          posted {getTimeStamp(question.createdAt.toString())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full min-h-[300px] flex flex-col items-center justify-center bg-white mt-6">
              <Image
                src="/icons/no-question.svg"
                width={200}
                height={200}
                alt="No data"
              />
              <p className="text-xs text-center w-[150px] mx-auto mt-3 md:pl-5">
                No help requested
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionPage;

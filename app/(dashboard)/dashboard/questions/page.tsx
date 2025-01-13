"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/use-query";
import Link from "next/link";
import React from "react";
import { getTimeStamp } from "@/lib/utils";
import TagCard from "@/components/card/TagCard";

const QuestionPage = () => {
  const { data: questions } = useFetchData(`/question`);
  return (
    <div>
      <div className="flex-between">
        <h1 className="text-2xl font-bold mb-4">All Question</h1>

        <Button asChild>
          <Link href="/dashboard/ask-question">Ask a question</Link>
        </Button>
      </div>

      <div className="space-y-3 mt-6">
        {questions?.map((question: IQuestionWithTag) => (
          <Card className="" key={question.id}>
            <CardHeader>
              <CardTitle className="text-heading">
                <Link href={`/question/${question.id}`}>{question?.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <span className="">
                  {getTimeStamp(question.createdAt.toString())}
                </span>
              </div>
              <div className="mt-3.5 flex w-full flex-wrap gap-2">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionPage;

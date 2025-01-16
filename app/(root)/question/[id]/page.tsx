"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useFetchData, usePostData } from "@/hooks/use-query";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import QuestionPageSkeleton from "@/components/skeleton/QuestionPageSkeleton";
import Editor from "@/components/editor";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Loader, ChevronLeft } from "lucide-react";
import MarkdownTruncate from "@/components/MarkdownTruncate";
import TagCard from "@/components/card/TagCard";
import { useSession } from "next-auth/react";

const answerSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters long"),
});

type AnswerFormValues = z.infer<typeof answerSchema>;

export default function QuestionPage() {
  const params = useParams<{ id: string }>();

  const session = useSession();

  const editorRef = useRef<MDXEditorMethods>(null);
  const [editorKey, setEditorKey] = useState(0);

  const { id: questionId } = params;

  const { data, isLoading, refetch } = useFetchData(`/question/${questionId}`);

  const form = useForm<AnswerFormValues>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      content: "",
    },
  });

  const mutation = usePostData("/answer", {
    onSuccess: () => {
      refetch();
      toast.success("answer submitted");
      form.reset();

      form.setValue("content", "");
      setEditorKey((prevKey) => prevKey + 1);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  function onSubmit(values: AnswerFormValues) {
    const payload = {
      ...values,
      questionId,
    };

    mutation.mutate(payload);
  }

  const router = useRouter();

  if (isLoading) {
    return <QuestionPageSkeleton />;
  }

  return (
    <div className="min-h-[calc(100vh-100px)] max-w-5xl mx-auto py-10 md:py-16">
      <div
        onClick={() => router.back()}
        className="flex items-center cursor-pointer py-6 text-[12px] "
      >
        <ChevronLeft size={14} /> Back
      </div>
      <div className="my-container">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={data?.user?.image} />
                <AvatarFallback>
                  {data?.user?.email.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">{data?.user?.name}</p>
                <p className="text-[10px] text-body">
                  Asked on{" "}
                  {format(data?.createdAt || new Date(), "MMMM d, yyyy")}
                </p>
              </div>
            </div>

            <div>
              {session?.data?.user?.id === data?.author ? (
                <Button
                  variant="outline"
                  size="sm"
                  className={`${data?.answered && "text-green-400"}`}
                >
                  {!data?.answered
                    ? "Mark as answered"
                    : "Mark as not answered"}
                </Button>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${data?.answered && "text-green-400"}`}
                    >
                      {data?.answered ? "Answered" : "Not Answered"}
                    </Button>
                    <Button variant="outline" size="sm">
                      {data?.answers} answers
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-heading">{data?.title}</h1>
            <div className="flex gap-2">
              {data?.tags?.map((tag: ITag) => (
                <TagCard
                  key={tag.id}
                  _id={tag.id || ""}
                  name={tag.name}
                  compact
                  isButton
                />
              ))}
            </div>
          </div>

          <MarkdownTruncate data={data?.content || ""} />
        </div>

        <div className="mt-6 md:mt-10">
          <h2 className="text-2xl font-bold mb-4">
            {data?.answer?.length} Answers
          </h2>
          {data &&
            data?.answer?.map((answer: IAnswer) => (
              <Card key={answer.id} className="mb-4">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={answer?.user?.image} />
                        <AvatarFallback>
                          {answer?.user?.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {answer?.user?.name}
                        </p>
                        <p className="text-[10px] text-body">
                          Answered on{" "}
                          {format(answer?.createdAt || "", "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {answer?.upvotes} votes
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <MarkdownTruncate data={answer.content || ""} />
                </CardContent>
              </Card>
            ))}
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor
                        key={editorKey}
                        value={field.value}
                        editorRef={editorRef}
                        fieldChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className=""
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  <span>Submit</span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { usePostData } from "@/hooks/use-query";
import TagCard from "@/components/card/TagCard";

const questionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(255, "Title cannot exceed 255 characters"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag is required." })
        .max(30, { message: "Tag cannot exceed 30 characters." })
    )
    .min(1, { message: "At least one tag is required." })
    .max(5, { message: "Cannot add more than 5 tags." }),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const CreateQuestionForm = () => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [editorKey, setEditorKey] = useState(0);

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  const mutation = usePostData("/question", {
    onSuccess: () => {
      toast.success("Question created successfully!");
      form.reset();

      form.setValue("content", "");
      setEditorKey((prevKey) => prevKey + 1);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  function onSubmit(values: QuestionFormValues) {
    console.log({ values });
    mutation.mutate(values);
  }

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);

    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Please add at least one tag",
      });
    }
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const tagInput = e.currentTarget.value.trim().toLocaleLowerCase();
      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";

        form.clearErrors("tags");
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag must be less than 15 characters",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <h1 className="text-2xl font-bold mb-4">Help Request</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter question title"
                  className="placeholder:text-gray-400"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
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

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    className=""
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                    // {...field}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start flex mt-2.5 flex-wrap gap-2.5">
                      {field?.value?.map((tag, index) => (
                        <TagCard
                          key={index}
                          name={tag}
                          compact
                          _id={tag}
                          remove
                          isButton
                          handleRemove={() => handleTagRemove(tag, field)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary-gradient"
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
  );
};

export default CreateQuestionForm;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader, RefreshCw } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useFetchData, usePostData } from "@/hooks/use-query";
import { useState, useEffect } from "react";
import Image from "next/image";
import TagCard from "../card/TagCard";

const suggestionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  suggestedUsers: z.array(z.string()).optional(),
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

type SuggestionFormValues = z.infer<typeof suggestionSchema>;

const CreateSuggestionForm = () => {
  const { data, isLoading } = useFetchData("/user");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      title: "",
      description: "",
      suggestedUsers: [],
      tags: [],
    },
  });

  useEffect(() => {
    if (data) {
      setFilteredUsers(data);
    }
  }, [data]);

  const mutation = usePostData("/suggestion", {
    onSuccess: () => {
      toast.success("Suggestion created successfully!");
      form.reset();
      setAllSelected(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const handleSearch = (query: string) => {
    if (!data) return;
    const filtered = data.filter((user: IUser) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSelectAll = (checked: boolean) => {
    setAllSelected(checked);
    const allUser = checked
      ? filteredUsers.map((user: IUser) => user.email)
      : [];
    form.setValue("suggestedUsers", allUser);
  };

  const handleToggleUser = (email: string) => {
    const currentGuests = form.getValues("suggestedUsers") || [];
    const newGuests = currentGuests.includes(email)
      ? currentGuests.filter((em) => em !== email)
      : [...currentGuests, email];

    form.setValue("suggestedUsers", newGuests, { shouldValidate: true });
    setAllSelected(newGuests.length === filteredUsers.length);
  };

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

  function onSubmit(values: SuggestionFormValues) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <h1 className="text-xl font-bold text-heading border-b pb-2">
        Make a suggestion
      </h1>
      <div className="mt-3 text-sm leading-5 text-body font-light mb-4">
        A suggestion represents an idea or topic for a knowledge-sharing
        session. It outlines a proposed title, an optional description to
        provide context, and suggested users who could benefit from or
        contribute to the session.
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-heading">Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your suggestion title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-heading">Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder="Please describe more about this session"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Users</FormLabel>
          <FormDescription className="mb-2 font-light text-xs">
            Suggest who you would like to take the session
          </FormDescription>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="animate-spin" />
              Loading guest list...
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search guests"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <span className="text-sm">Select All</span>
              </div>
              <ul className="max-h-48 overflow-y-auto space-y-2">
                {filteredUsers?.map((user: IUser) => (
                  <li key={user.id} className="flex items-center gap-4">
                    <Image
                      src={user?.image || ""}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                      width={30}
                      height={30}
                    />
                    <span>{user.name}</span>
                    <input
                      type="checkbox"
                      checked={
                        form
                          .getValues("suggestedUsers")
                          ?.includes(user.email) || false
                      }
                      onChange={() => handleToggleUser(user.email)}
                    />
                  </li>
                ))}
              </ul>
              <FormMessage />
            </div>
          )}
        </div>
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="">Tags</FormLabel>
              <FormControl>
                <div>
                  <Input
                    className=""
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                    // {...field}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start flex mt-2 flex-wrap gap-2">
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

export default CreateSuggestionForm;

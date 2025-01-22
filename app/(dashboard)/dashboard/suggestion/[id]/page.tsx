"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchData, usePostData } from "@/hooks/use-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MarkdownTruncate from "@/components/MarkdownTruncate";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Check, Loader, RefreshCw } from "lucide-react";
import TagCard from "@/components/card/TagCard";
import {
  SessionFormValues,
  sessionSchema,
} from "@/components/form/CreateSessionForm";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";

const SuggestionDetailsPage = () => {
  const params = useParams<{ id: string }>();

  const {
    data: suggestion,
    isLoading,
    refetch,
  } = useFetchData(
    `/suggestion/${params.id}`,
    `get-session-by-id-${params.id}`
  );

  const { data } = useFetchData("/user", "get-users");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: "",
      description: "",
      resources: [],
      guests: [],
    },
  });

  useEffect(() => {
    if (data) {
      setFilteredUsers(data);
    }
    form.setValue("title", suggestion?.title);
  }, [data, suggestion, form]);

  const mutation = usePostData("/suggestion/take", {
    onSuccess: () => {
      toast.success("Session created successfully!");
      form.reset();
      refetch();
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
    const allUserIds = checked
      ? filteredUsers.map((user: IUser) => user.email)
      : [];
    form.setValue("guests", allUserIds);
  };

  const handleToggleUser = (email: string) => {
    const currentGuests = form.getValues("guests") || [];
    const newGuests = currentGuests.includes(email)
      ? currentGuests.filter((em) => em !== email)
      : [...currentGuests, email];

    form.setValue("guests", newGuests, { shouldValidate: true });
    setAllSelected(newGuests.length === filteredUsers.length);
  };

  function onSubmit(values: SessionFormValues) {
    const payload = {
      suggestionId: params.id,
      ...values,
    };
    mutation.mutate(payload);
  }

  if (isLoading) {
    return (
      <div className="flex gap-2 items-center justify-center leading-6 py-2 text-sm mt-4 min-h-[100px]">
        <RefreshCw size={12} className="text-heading animate-spin" /> Loading
        suggestion...
      </div>
    );
  }

  if (!suggestion) {
    return <div className="p-4 mt-4">Suggestion not found.</div>;
  }

  return (
    <div className="p-4 mt-4">
      <h1 className="text-xl font-bold text-heading2 border-b pb-2 flex-between">
        <span className="max-w-4xl text-wrap">Topic: {suggestion?.title}</span>
        <span>
          {!suggestion?.taken ? (
            <span
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1 text-white bg-heading2 px-2 py-1 text-xs rounded-sm cursor-pointer"
            >
              {showForm ? "Hide Form" : "Take Session"}
            </span>
          ) : (
            <div className="flex items-center gap-1 text-green-400 bg-white px-2 py-1 rounded-sm text-xs">
              <Check className="h-3 w-3" /> Taken
            </div>
          )}
        </span>
      </h1>

      <div className="mt-3 mb-4">
        <MarkdownTruncate
          data={suggestion?.description || ""}
          className="text-sm leading-5 text-body font-light"
        />
      </div>

      <div className="flex items-center gap-2 ">
        <span className="font-bold text-sm">Tags:</span>
        <div className="flex flex-wrap gap-1">
          {suggestion?.tags &&
            suggestion?.tags.map((tag: string, i: number) => (
              <TagCard _id={i.toString()} name={tag} compact key={i} />
            ))}
        </div>
      </div>

      <>{showForm && !suggestion?.taken && <hr className="mt-4" />}</>
      <>
        {showForm && !suggestion?.taken && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-heading">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your session title"
                        {...field}
                      />
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
                    <FormLabel className="text-heading2">Description</FormLabel>
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
              <div className="flex items-center gap-6 md:gap-10 flex-wrap">
                <div>
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-heading2">
                          Pick a date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  <span className=" text-sm">
                                    {format(field.value, "PPP")}
                                  </span>
                                ) : (
                                  <span className="text-sm text-[#69748B]">
                                    Pick a date
                                  </span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-heading2">
                          Start Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="max-w-[150px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-heading2">
                          End Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            className="max-w-[150px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <FormLabel>Guests</FormLabel>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw size={16} className="animate-spin" />
                    Loading guest list...
                  </div>
                ) : (
                  <div className="space-y-4">
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
                              form.getValues("guests")?.includes(user.email) ||
                              false
                            }
                            onChange={() => handleToggleUser(user.email)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-heading2"
                disabled={mutation.isPending || suggestion?.taken}
              >
                {mutation.isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  <span>Submit</span>
                )}
              </Button>
            </form>
          </Form>
        )}
      </>
    </div>
  );
};

export default SuggestionDetailsPage;

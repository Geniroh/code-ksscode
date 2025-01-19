"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader, RefreshCw } from "lucide-react";
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
import toast from "react-hot-toast";
import { useFetchData, usePostData } from "@/hooks/use-query";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import Image from "next/image";

const sessionSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
    date: z.date(),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
    resources: z
      .array(
        z.object({
          type: z.enum(["pdf", "image", "video"], {
            message: "Invalid resource type",
          }),
          url: z.string().url("Must be a valid URL"),
        })
      )
      .optional(),
    guests: z.array(z.string()).optional(), // Changed from email to string to match user IDs
    image: z.string().url({ message: "Not a valid URL" }).optional(),
  })
  .refine(
    (data) => {
      const startTime = new Date(`1970-01-01T${data.startTime}:00`);
      const endTime = new Date(`1970-01-01T${data.endTime}:00`);
      return endTime > startTime;
    },
    {
      message: "End time must be later than start time",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => {
      const startTime = new Date(`1970-01-01T${data.startTime}:00`);
      const endTime = new Date(`1970-01-01T${data.endTime}:00`);
      const maxDuration = 2 * 60 * 60 * 1000;
      return endTime.getTime() - startTime.getTime() <= maxDuration;
    },
    {
      message: "Kss sessions cannot exceed 2 hours",
      path: ["endTime"],
    }
  );

type SessionFormValues = z.infer<typeof sessionSchema>;

const BookSessionForm = () => {
  const { data, isLoading } = useFetchData("/user");
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [allSelected, setAllSelected] = useState(false);

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
  }, [data]);

  const mutation = usePostData("/session", {
    onSuccess: () => {
      toast.success("Session created successfully!");
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
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <h1 className="text-xl font-bold text-heading2 border-b pb-2">
        Create a New Session
      </h1>
      <div className="mt-3 text-sm leading-5 text-body font-light mb-4">
        A knowledge-sharing session is a dedicated time for colleagues to learn
        from each other. It&apos;s a chance to present a new skill, discuss a
        best practice, explore a project&apos;s learnings, or offer guidance on
        a specific challenge. By creating a session, you&apos;re facilitating
        learning and collaboration within the team.
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-heading">Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter your session title" {...field} />
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
                  <FormLabel className="text-heading2">Pick a date</FormLabel>
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
                  <FormLabel className="text-heading2">Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="max-w-[150px]" />
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
                  <FormLabel className="text-heading2">End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="max-w-[150px]" />
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
                        form.getValues("guests")?.includes(user.email) || false
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

export default BookSessionForm;

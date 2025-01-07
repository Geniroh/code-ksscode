"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"; // Example ShadCN Button component
import { Input } from "@/components/ui/input"; // Example ShadCN Input component
import { Textarea } from "@/components/ui/textarea"; // Example ShadCN Textarea component
import { useState } from "react";

const sessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Start date must be a valid date",
  }),
  endDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "End date must be a valid date",
  }),
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
  guests: z.array(z.string().email()).optional(),
  image: z.string().url("Image must be a valid URL").optional(),
});

type SessionFormValues = z.infer<typeof sessionSchema>;

const BookSessionPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      resources: [],
      guests: [],
      image: "",
    },
  });

  const onSubmit = async (data: SessionFormValues) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      alert("Session created successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Create a New Session</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            placeholder="Session Title"
            {...register("title")}
            className="mt-1"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            placeholder="Session Description"
            {...register("description")}
            className="mt-1"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-sm font-medium">
            Start Date
          </label>
          <Input
            type="datetime-local"
            id="startDate"
            {...register("startDate")}
            className="mt-1"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate.message}</p>
          )}
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-sm font-medium">
            End Date
          </label>
          <Input
            type="datetime-local"
            id="endDate"
            {...register("endDate")}
            className="mt-1"
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate.message}</p>
          )}
        </div>

        {/* Resources */}
        <div className="mb-4">
          <label htmlFor="resources" className="block text-sm font-medium">
            Resources (Optional)
          </label>
          <Input
            type="text"
            placeholder="Enter resource URL"
            {...register("resources.0.url")}
            className="mt-1"
          />
          {errors.resources && (
            <p className="text-red-500 text-sm">{errors.resources.message}</p>
          )}
        </div>

        {/* Guests */}
        <div className="mb-4">
          <label htmlFor="guests" className="block text-sm font-medium">
            Guests (Optional)
          </label>
          <Textarea
            id="guests"
            placeholder="Enter guest emails (comma-separated)"
            {...register("guests")}
            className="mt-1"
          />
          {errors.guests && (
            <p className="text-red-500 text-sm">{errors.guests.message}</p>
          )}
        </div>

        {/* Image */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium">
            Image URL (Optional)
          </label>
          <Input
            id="image"
            placeholder="Enter image URL"
            {...register("image")}
            className="mt-1"
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Create Session"}
        </Button>
      </form>
    </div>
  );
};

export default BookSessionPage;

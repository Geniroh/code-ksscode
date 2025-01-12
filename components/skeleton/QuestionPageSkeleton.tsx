"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

export default function QuestionPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="my-container py-10 md:py-16 ">
        <div className="space-y-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Avatar>
                <Skeleton className="h-10 w-10 rounded-full" />
              </Avatar>
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-24 rounded" />
              <Skeleton className="h-8 w-32 rounded" />
            </div>
          </div>

          <Skeleton className="h-8 w-3/4" />

          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        <div className="mt-10 md:mt-16">
          <Skeleton className="h-6 w-40 mb-4" />

          {[...Array(2)].map((_, index) => (
            <Card key={index} className="mb-6 md:mb-10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </Avatar>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-16 rounded" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

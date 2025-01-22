"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchData } from "@/hooks/use-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const { data: userDetails, isLoading } = useFetchData(
    `/user/me`,
    "user-details"
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 md:h-24 md:w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!session) {
    return <div>You need to be signed in to view this page.</div>;
  }

  const { user } = session;

  return (
    <div className="p-4 mt-4 space-y-6">
      <div className="flex items-center gap-6 flex-wrap">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src={userDetails?.image || user?.image}
            alt={userDetails?.name || "User Avatar"}
          />
          <AvatarFallback>
            {userDetails?.name ? userDetails.name.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <p className="text-xl md:text-2xl text-heading2 font-semibold">
            {userDetails?.name || user?.name}
          </p>
          <p className="text-base text-body">
            {userDetails?.email || user?.email}
          </p>
          <Badge variant="secondary">{userDetails?.role || "User"}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between">
            <StatItem
              label="Sessions"
              value={userDetails?.meta?.sessionsCount}
            />
            <StatItem
              label="Questions"
              value={userDetails?.meta?.questionsCount}
            />
            <StatItem label="Answers" value={userDetails?.meta?.answersCount} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>User ID:</strong> {userDetails?.id}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(userDetails?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatItem = ({ label, value }: { label: string; value?: number }) => (
  <div className="text-center">
    <p className="text-2xl font-semibold">{value || 0}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default ProfilePage;

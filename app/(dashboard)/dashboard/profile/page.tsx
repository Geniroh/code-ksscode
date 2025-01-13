"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Avatar>
            <Skeleton className="h-16 w-16 md:h-24 md:w-24 rounded-full" />
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
    );
  }

  if (!session) {
    return <div>You need to be signed in to view this page.</div>;
  }

  const { user } = session;

  return (
    <div>
      <div className="flex items-center gap-6 flex-wrap">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user?.image} alt={user?.name || "User Avatar"} />
          <AvatarFallback>
            {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <p className="text-xl md:text-3xl text-heading font-semibold">
            {user?.name}
          </p>
          <p className="text-base text-body">{user?.email}</p>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default ProfilePage;

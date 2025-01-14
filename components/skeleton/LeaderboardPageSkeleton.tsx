import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component in your UI library

const LeaderboardSkeleton = () => {
  // Number of rows for the skeleton
  const rows = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="my-container py-10">
        <h2 className="text-2xl font-bold mb-4 text-primary">
          <Skeleton className="h-6 w-40" />
        </h2>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Skeleton className="h-4 w-8" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-12" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((rank) => (
                <TableRow key={rank}>
                  <TableCell className="font-medium">
                    {rank <= 3 ? (
                      <Badge className="mr-2">
                        <Skeleton className="h-4 w-4" />
                      </Badge>
                    ) : null}
                    <Skeleton className="h-4 w-6" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </AvatarFallback>
                      </Avatar>
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSkeleton;

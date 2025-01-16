"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useFetchData } from "@/hooks/use-query";
import LeaderboardSkeleton from "@/components/skeleton/LeaderboardPageSkeleton";

type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  change: "up" | "down" | "same";
};

const RankChange: React.FC<{ change: "up" | "down" | "same" }> = ({
  change,
}) => {
  const arrow = change === "up" ? "↑" : change === "down" ? "↓" : "–";
  const color =
    change === "up"
      ? "text-green-500"
      : change === "down"
      ? "text-red-500"
      : "text-gray-500";
  return <span className={`${color} font-bold`}>{arrow}</span>;
};

const LeaderboardTable = () => {
  const { data, isLoading, isError } = useFetchData("/leaderboard");

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  if (isError || !data) {
    return <p>Error loading leaderboard.</p>;
  }

  // Transform the API data into the required format
  const leaderboardData: LeaderboardEntry[] = data?.leaderboard?.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (user: any) => ({
      rank: user.rank,
      name: user.name,
      score: user.metrics.totalPoints,
      avatar: user.image || user.name.slice(0, 2), // Fallback to initials
      change: "same", // Replace with actual logic if change data is available
    })
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="my-container py-10">
        <h2 className="text-2xl font-bold mb-4 text-primary">Leaderboard</h2>
        <div className="border rounded-lg overflow-hidden min-h-[50vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData?.map((entry) => (
                <TableRow key={entry.rank}>
                  <TableCell className="font-medium">
                    {entry.rank === 1 && <Badge className="mr-2">🏆</Badge>}
                    {entry.rank === 2 && <Badge className="mr-2">🥈</Badge>}
                    {entry.rank === 3 && <Badge className="mr-2">🥉</Badge>}
                    {entry.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={entry.avatar} alt={entry.name} />
                        <AvatarFallback>
                          {entry.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {entry.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.score.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <RankChange change={entry.change} />
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

export default LeaderboardTable;

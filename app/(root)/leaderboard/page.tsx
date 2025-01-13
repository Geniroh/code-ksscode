// import React from "react";

// const LeaderBoardPage = () => {
//   return <div>LeaderBoardPage</div>;
// };

// export default LeaderBoardPage;

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

type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  change: "up" | "down" | "same";
};

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Alice Johnson", score: 9850, avatar: "AJ", change: "up" },
  { rank: 2, name: "Bob Smith", score: 9720, avatar: "BS", change: "same" },
  { rank: 3, name: "Charlie Brown", score: 9680, avatar: "CB", change: "up" },
  { rank: 4, name: "Diana Prince", score: 9550, avatar: "DP", change: "down" },
  { rank: 5, name: "Ethan Hunt", score: 9400, avatar: "EH", change: "up" },
  {
    rank: 6,
    name: "Fiona Gallagher",
    score: 9350,
    avatar: "FG",
    change: "same",
  },
  {
    rank: 7,
    name: "George Michael",
    score: 9200,
    avatar: "GM",
    change: "down",
  },
  { rank: 8, name: "Hannah Montana", score: 9150, avatar: "HM", change: "up" },
  { rank: 9, name: "Ian Malcolm", score: 9000, avatar: "IM", change: "same" },
  {
    rank: 10,
    name: "Julia Roberts",
    score: 8950,
    avatar: "JR",
    change: "down",
  },
];

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
  return (
    <div className="max-w-3xl mx-auto">
      <div className="my-container py-10">
        <h2 className="text-2xl font-bold mb-4 text-primary">Leaderboard</h2>
        <div className="border rounded-lg overflow-hidden">
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
              {leaderboardData.map((entry) => (
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
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${entry.avatar}`}
                          alt={entry.name}
                        />
                        <AvatarFallback>{entry.avatar}</AvatarFallback>
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

import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import LeaderboardSection from "@/components/home/Leaderboard";

export default function Home() {
  return (
    <div className="my-container">
      <Hero />
      <Features />
      <LeaderboardSection />
    </div>
  );
}

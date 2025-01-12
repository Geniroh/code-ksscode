import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import LeaderboardSection from "@/components/home/Leaderboard";
import Navbar from "@/components/navigation/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="my-container">
        <Hero />
        <Features />
        <LeaderboardSection />
      </div>
    </>
  );
}

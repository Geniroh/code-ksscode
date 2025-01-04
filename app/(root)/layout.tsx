import Navbar from "@/components/navigation/Navbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative ">
      <Navbar />

      {children}
    </main>
  );
};

export default RootLayout;

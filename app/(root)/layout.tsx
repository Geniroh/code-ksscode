import Footer from "@/components/home/Footer";
import Navbar from "@/components/navigation/Navbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative ">
      <Navbar />

      {children}

      <Footer />
    </main>
  );
};

export default RootLayout;

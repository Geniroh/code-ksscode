import Footer from "@/components/home/Footer";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative " suppressHydrationWarning>
      {children}
      <Footer />
    </main>
  );
};

export default RootLayout;

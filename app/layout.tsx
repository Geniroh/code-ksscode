import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
// import { ThemeProvider } from "@/context/Theme";
import QueryWrapper from "@/components/QueryWrapper";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codematic Ksscode",
  description: "Facilitate skill and knowledge sharing among team members",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
      >
        <QueryWrapper>
          {/* <ThemeProvider
          attribute="class"
          defaultTheme="light"
          // enableSystem
          disableTransitionOnChange
        > */}
          {children}
          {/* </ThemeProvider> */}
        </QueryWrapper>
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MOOD App",
  description: "Mathematics Operation Online Development",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

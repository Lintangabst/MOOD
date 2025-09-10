"use client";

import { usePathname } from "next/navigation";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavbar = !pathname?.startsWith("/admin"); // Navbar tidak muncul di /admin

  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {showNavbar && <Navbar />}
        <main>{children}</main>
        {showNavbar && <Footer />}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

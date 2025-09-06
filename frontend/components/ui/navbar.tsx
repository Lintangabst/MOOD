"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("User");
  const [initial, setInitial] = useState("U");

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);

    if (token) {
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const fullName = res.data.fullName || "User";
          const first = fullName.split(" ")[0];
          setFirstName(first);
          setInitial(first.charAt(0).toUpperCase());
        })
        .catch((err) => {
          console.error("Gagal mengambil data user", err);
          setIsLoggedIn(false);
        });
    }
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    localStorage.clear();
    toast.success("Berhasil logout");
    router.push("/login");
  };

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <Link href="/" className="text-xl font-bold text-green-600">
          MOOD
        </Link>

        <button
          className="md:hidden text-green-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className={`hover:text-green-600 ${pathname === "/" ? "text-green-600" : "text-gray-700"}`}
            >
              Home
            </Link>
            <Link
              href="/materials"
              className={`hover:text-green-600 ${pathname === "/materials" ? "text-green-600" : "text-gray-700"}`}
            >
              Learning Materials
            </Link>
            <Link
              href="/exercises"
              className={`hover:text-green-600 ${pathname === "/exercises" ? "text-green-600" : "text-gray-700"}`}
            >
              Start Exercises
            </Link>
          </nav>

          <Button className="bg-green-500 hover:bg-green-600 text-white text-sm">
            Exercises with AI
          </Button>

          {isLoggedIn && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-green-200 bg-green-100 text-green-700">
                  <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-800">{firstName}</span>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-sm">
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah kamu yakin ingin logout?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Ya, Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-md z-40">
          <nav className="flex flex-col items-center gap-4 py-4 text-sm font-medium">

            {isLoggedIn && (
              <div className="flex flex-col items-center gap-3 mt-2 w-full">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-green-200 bg-green-100 text-green-700">
                    <AvatarFallback>{initial}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-800">{firstName}</span>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-sm w-1/2">
                      Logout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Logout?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah kamu yakin ingin logout?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>
                        Ya, Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                </div>

              </div>
            )}

            <Link
              href="/"
              className={`hover:text-green-600 ${pathname === "/" ? "text-green-600" : "text-gray-700"}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/materials"
              className={`hover:text-green-600 ${pathname === "/materials" ? "text-green-600" : "text-gray-700"}`}
              onClick={() => setIsOpen(false)}
            >
              Learning Materials
            </Link>
            <Link
              href="/exercises"
              className={`hover:text-green-600 ${pathname === "/exercises" ? "text-green-600" : "text-gray-700"}`}
              onClick={() => setIsOpen(false)}
            >
              Start Exercises
            </Link>

            <Button className="bg-green-500 hover:bg-green-600 text-white text-sm w-11/12">
              Exercises with AI
            </Button>


          </nav>
        </div>
      )}
    </header>
  );
}

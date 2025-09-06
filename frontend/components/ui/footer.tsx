"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  const hiddenPaths = ["/login", "/register"];
  const isHidden = hiddenPaths.some((path) => pathname.startsWith(path));
  if (isHidden) return null;

  return (
    <footer className="bg-green-700 text-white mt-20">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand + tagline */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">MOOD</h2>
          <p className="text-sm text-green-100">
            Mathematics Operation Online Development.<br />
            Learn math, grow plants, love the planet.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold mb-1 text-white">Quick Links</h3>
          <Link href="/" className="text-sm hover:underline text-green-100">
            Home
          </Link>
          <Link href="/materials" className="text-sm hover:underline text-green-100">
            Learning Materials
          </Link>
          <Link href="/exercises" className="text-sm hover:underline text-green-100">
            Start Exercises
          </Link>
        </div>

        {/* Contact & Social */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-semibold text-white">Connect with us</h3>
          <div className="flex items-center gap-4">
            <Link
              href="mailto:hello@mood.com"
              className="hover:text-green-200 transition-colors"
            >
              <Mail className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/"
              target="_blank"
              className="hover:text-green-200 transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://instagram.com/"
              target="_blank"
              className="hover:text-green-200 transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://linkedin.com/"
              target="_blank"
              className="hover:text-green-200 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-green-500 mt-8">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-green-200">
          &copy; {new Date().getFullYear()} <span className="font-semibold">MOOD</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

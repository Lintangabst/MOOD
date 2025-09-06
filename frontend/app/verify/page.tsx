// app/verify/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:5000/api/auth/verify?token=${token}`)
        .then((res) => {
          setStatus("success");
          setMessage(res.data.msg);

          // ✅ Simpan status di localStorage
          localStorage.setItem("emailVerified", "true");

          // ✅ Tutup tab ini setelah 2 detik
          setTimeout(() => {
            window.close(); // hanya berfungsi jika tab ini dibuka dengan window.open()
          }, 2000);
        })
        .catch((err) => {
          setStatus("error");
          setMessage(err.response?.data?.msg || "Verifikasi gagal.");
        });
    } else {
      setStatus("error");
      setMessage("Email belum terverifikasi.");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {status === "verifying" && "Verifying..."}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 text-center">
            {status === "verifying" && (
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            )}
            {status === "success" && (
              <CheckCircle className="h-10 w-10 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="h-10 w-10 text-red-500" />
            )}
            <p className="text-gray-700">{message}</p>

            {(status === "success" || status === "error") && (
              <Link href="/login" className="w-full">
                <Button className="w-full mt-2">Go to Login</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

export default function CustomPage() {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (!code.trim()) {
      toast.error("Masukkan kode akses dulu");
      return;
    }
    router.push(`/custom/${code}`);
  };

  const handleToggle = () => setIsCreateMode(!isCreateMode);

  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-gradient-to-b from-green-50 to-white p-6 space-y-6">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-green-700 mt-6"
      >
        ✨ Custom Question
      </motion.h1>

      {/* Toggle Switch */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center space-x-3"
      >
        <span className="font-semibold text-gray-700">Masuk / Buat Soal:</span>
        <Switch checked={isCreateMode} onCheckedChange={handleToggle} />
        <span className="text-gray-600">{isCreateMode ? "Buat Soal Baru" : "Masukkan Kode Akses"}</span>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {isCreateMode ? "📘 Buat Soal Baru" : "🔑 Masukkan Kode Akses"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCreateMode ? (
              <Button
                variant="default"
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={() => router.push("/custom/create")}
              >
                Buat Soal
              </Button>
            ) : (
              <>
                <Input
                  placeholder="Contoh: 71NT4N9"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button variant="default" className="w-full bg-blue-400 hover:bg-green-500" onClick={handleJoin}>
                  Masuk
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

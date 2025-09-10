"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import StatusTukarPoin from "@/components/StatusTukarPoint";
import TukarPoin from "@/components/TukarPoin";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Dashboard = () => {
  const [firstName, setFirstName] = useState<string>("User");
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showTukarPoin, setShowTukarPoin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setLoading(false);
      toast.error("Token tidak ditemukan, silakan login kembali.");
      router.push("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const fullName = res.data.fullName || "User";
        const first = fullName.split(" ")[0];
        setFirstName(first);
        setPoints(res.data.points || 0);
      })
      .catch((err) => {
        console.error("Gagal mengambil data user:", err);
        toast.error("Gagal mengambil data user, silakan login ulang.");
        router.push("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleToggle = () => setShowTukarPoin((s) => !s);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 md:px-8 py-10 max-w-7xl">
        {/* Greeting */}
        <motion.h2
          className="text-2xl font-bold mb-1 text-green-500"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Hallo, {firstName}
        </motion.h2>
        <motion.p
          className="text-gray-600 text-xl mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Selamat Datang di <span className="text-2xl font-bold text-green-500">MOOD!</span>
        </motion.p>

        {/* Section Atas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Poin */}
          <motion.div
            className="bg-green-500 rounded-xl flex flex-col md:flex-row items-center md:justify-between text-white p-4 md:p-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="w-full md:w-1/2 flex justify-center mb-4 md:mb-0">
              <Image src="/img/dash.png" alt="Plant" width={350} height={150} />
            </div>
            <div className="flex-1 text-center">
              <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full inline-block mb-3">
                P
              </div>
              <p className="font-bold">POINKU</p>
              <h3 className="text-4xl">{points}</h3>
              <p
                className="underline mt-2 cursor-pointer"
                onClick={handleToggle}
              >
                {showTukarPoin ? "Lihat Status Penukaran!" : "Tukar Poin >"}
              </p>
            </div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            className="bg-blue-400 rounded-xl py-6 px-8 md:px-12 text-white flex flex-col justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-3">
              Masih bingung menghitung penjumlahan atau pengurangan?
            </h3>
            <p className="mb-4">
              Yuk, belajar lewat aplikasi ini! Kerjakan soal, kumpulkan poin,
              dan rasakan serunya belajar matematika sambil bermain!
            </p>
            <motion.button
              className="bg-white text-black border-2 border-green-500 font-medium px-4 py-2 rounded hover:bg-green-500 w-fit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Kerjakan Latihan!
            </motion.button>
          </motion.div>
        </div>

        {/* Status Tukar Poin / Tukar Poin */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="mt-8"
        >
          {showTukarPoin ? (
            <TukarPoin
              onRedeemed={(newPoints) => {
                setPoints(newPoints);
                setShowTukarPoin(false);
              }}
            />
          ) : (
            <StatusTukarPoin />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;

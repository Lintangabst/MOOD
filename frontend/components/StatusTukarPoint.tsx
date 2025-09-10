"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";

interface StatusCardProps {
  icon: string;
  title: string;
  count: number;
  variant: "green" | "blue";
}

const StatusCard: React.FC<StatusCardProps> = ({ icon, title, count, variant }) => {
  const bg = variant === "green" ? "bg-green-500" : "bg-blue-400";
  return (
    <div className={`${bg} rounded-xl text-white p-6 flex flex-col items-center shadow-md`}>
      <Image src={icon} alt={title} width={64} height={64} />
      <p className="text-lg font-bold mt-2">{title}</p>
      <p className="mt-2">{count} Permintaan</p>
    </div>
  );
};

const StatusTukarPoin: React.FC = () => {
  const [summary, setSummary] = useState({
    pending: 0,
    accepted: 0,
    processing: 0,
    completed: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/redemptions/summary", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSummary(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const items = [
    { icon: "/img/acc.png", title: "Diterima", count: summary.pending },
    { icon: "/img/proc.png", title: "Diproses", count: summary.processing },
    { icon: "/img/done.png", title: "Selesai", count: summary.completed },
    { icon: "/img/rej.png", title: "Ditolak", count: summary.rejected },
  ];

  if (loading) {
    return <p className="text-center mt-8 text-gray-600">Memuat status penukaran…</p>;
  }

  return (
    <div className="mt-10 text-center">
      <h3 className="text-2xl font-bold">Status Tukar Poin</h3>
      <p className="text-gray-600">Lihat Jumlah dan Status Penukaran Poin Anda</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {items.map((it, idx) => (
          <StatusCard
            key={it.title}
            icon={it.icon}
            title={it.title}
            count={it.count}
            variant={idx % 2 === 0 ? "green" : "blue"}
          />
        ))}
      </div>
    </div>
  );
};

export default StatusTukarPoin;

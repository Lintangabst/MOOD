"use client";

import React from "react";
import Image from "next/image";

interface StatusCardProps {
  icon: string;
  title: string;
  count: number;
  variant: "green" | "blue";
}

const StatusCard: React.FC<StatusCardProps> = ({ icon, title, count, variant }) => {
  const bgColor = variant === "green" ? "bg-green-500" : "bg-blue-400";

  return (
    <div className={`${bgColor} rounded-xl text-white p-6 flex flex-col items-center shadow-md`}>
      <Image src={icon} alt={title} width={64} height={64} />
      <p className="text-lg font-bold mt-2">{title}</p>
      <p className="mt-2">{count} Permintaan</p>
    </div>
  );
};

const StatusTukarPoin: React.FC = () => {
  const statuses = [
    { icon: "/img/acc.png", title: "Diterima", count: 12 },
    { icon: "/img/proc.png", title: "Diproses", count: 12 },
    { icon: "/img/done.png", title: "Selesai", count: 12 },
    { icon: "/img/rej.png", title: "Ditolak", count: 12 },
  ];

  return (
    <div className="mt-10 text-center">
      <h3 className="text-2xl font-bold">Status Tukar Poin</h3>
      <p className="text-gray-600">
        Lihat Jumlah dan Status Penukaran Poin Anda
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {statuses.map((status, index) => (
          <StatusCard
            key={index}
            icon={status.icon}
            title={status.title}
            count={status.count}
            variant={index % 2 === 0 ? "green" : "blue"} // hijau-biru bergantian
          />
        ))}
      </div>
    </div>
  );
};

export default StatusTukarPoin;

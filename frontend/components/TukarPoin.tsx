"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Reward = {
  _id: string;
  title: string;
  pointsRequired: number;
  image: string;
  stock: number;
  active: boolean;
};

interface Props {
  onRedeemed?: (newPoints: number) => void;
}

const RewardCard: React.FC<
  Reward & { onRedeem: (id: string) => void; loadingId: string | null }
> = ({ _id, title, pointsRequired, image, stock, onRedeem, loadingId }) => {
  const disabled = stock <= 0 || loadingId === _id;
  return (
    <div className="bg-white border border-r-8 border-r-blue-400 border-b-4 border-b-blue-400 rounded-xl p-6 flex flex-col items-center shadow-md h-full">
      <Image src={image || "/img/reward1.png"} alt={title} width={100} height={100} />
      <h4 className="text-lg font-bold mt-3">{title}</h4>
      <p className="mt-1">{pointsRequired} Poin</p>
      <p className="mt-1 text-sm opacity-90">Stok: {stock}</p>
      <button
        disabled={disabled}
        onClick={() => onRedeem(_id)}
        className={`mt-4 font-semibold px-4 py-2 rounded ${
          disabled ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-yellow-400 text-black hover:bg-yellow-500"
        }`}
      >
        {loadingId === _id ? "Memproses..." : "Tukar Sekarang"}
      </button>
    </div>
  );
};

const TukarPoin: React.FC<Props> = ({ onRedeemed }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchRewards = () => {
    setLoading(true);
    axios
      .get<Reward[]>("http://localhost:5000/api/rewards")
      .then((res) => setRewards(res.data))
      .catch(() => toast.error("Gagal memuat rewards"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRewards();
  }, []);

 const handleRedeem = async (rewardId: string) => {
  const token = Cookies.get("token");
  if (!token) {
    toast.error("Silakan login kembali");
    return;
  }
  try {
    setLoadingId(rewardId);
    const res = await axios.post(
      "http://localhost:5000/api/rewards/redeem",
      { rewardId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(res.data?.message || "Penukaran berhasil diajukan");
    // update poin di dashboard + refresh data
    onRedeemed?.(res.data.currentPoints);
    fetchRewards();
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      toast.error(err.response?.data?.message || "Gagal menukar poin");
    } else {
      toast.error("Terjadi kesalahan tidak diketahui");
    }
  } finally {
    setLoadingId(null);
  }
};

  if (loading) {
    return <p className="text-center mt-8 text-gray-600">Memuat hadiah…</p>;
  }

  return (
    <div className="mt-10 text-center">
      <h3 className="text-2xl font-bold">🎁 Tukar Poin</h3>
      <p className="text-gray-600">Pilih hadiah seru dan tukarkan dengan poinmu!</p>

      <div className="mt-6">
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {rewards.map((r) => (
              <CarouselItem key={r._id} className="basis-full md:basis-1/2 lg:basis-1/3 p-2">
                <RewardCard {...r} onRedeem={handleRedeem} loadingId={loadingId} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default TukarPoin;

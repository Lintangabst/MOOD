"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface RewardCardProps {
  image: string;
  title: string;
  points: number;
}

const RewardCard: React.FC<RewardCardProps> = ({ image, title, points }) => {
  return (
    <div className="bg-white rounded-xl border border-b-green-500 border-r-green-500 border-r-8 border-b-6 border-gray-300 text-green-500 p-6 flex flex-col items-center shadow-md">
      <Image src={image} alt={title} width={100} height={100} />
      <h4 className="text-lg font-bold mt-3">{title}</h4>
      <p className="mt-2 text-blue-400 font-semibold">{points} Poin</p>
      <button className="mt-4 bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-500">
        Tukar Sekarang
      </button>
    </div>
  );
};

const TukarPoin: React.FC = () => {
  const rewards = [
    { image: "/img/reward1.png", title: "Pulpen Lucu", points: 50 },
    { image: "/img/reward2.png", title: "Buku Tulis", points: 100 },
    { image: "/img/reward3.png", title: "Stiker Karakter", points: 30 },
    { image: "/img/reward4.png", title: "Kotak Pensil", points: 150 },
    { image: "/img/reward5.png", title: "Gantungan Kunci", points: 70 },
    { image: "/img/reward6.png", title: "Tas Mini", points: 200 },
  ];

  return (
    <div className="mt-10 text-center">
      <h3 className="text-2xl font-bold">🎁 Tukar Poin</h3>
      <p className="text-gray-600">Pilih hadiah seru dan tukarkan dengan poinmu!</p>

      <div className="mt-6">
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {rewards.map((r, i) => (
              <CarouselItem
                key={i}
                className="basis-full md:basis-1/2 lg:basis-1/3 p-2"
              >
                <RewardCard {...r} />
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

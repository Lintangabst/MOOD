"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Dipo",
    comment: "MOOD really helps my child in a fun way!",
    rating: 5,
  },
  {
    name: "Nadia",
    comment: "A creative approach to math! My students love it.",
    rating: 5,
  },
  {
    name: "Raka",
    comment: "Combining math and eco-awareness is genius.",
    rating: 4,
  },
];

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length); // Looping
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Carousel Box */}
        <div className="w-full max-w-md mx-auto">
          <Carousel className="w-full">
            <CarouselContent
              className="transition-transform duration-500"
              style={{
                transform: `translateX(-${current * 100}%)`,
                display: "flex",
              }}
            >
              {testimonials.map((item, index) => (
                <CarouselItem key={index} className="w-full shrink-0 basis-full">
                  <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                    <p className="text-sm italic text-gray-700">
                      “{item.comment}”
                    </p>
                    <p className="font-semibold mt-4 text-gray-800">
                      • {item.name}
                    </p>
                    <p className="text-yellow-500 text-xl mt-1">
                      {"★".repeat(item.rating).padEnd(5, "☆")}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-center gap-4 mt-6">
              <CarouselPrevious
                className="bg-green-100 text-green-700"
                onClick={() =>
                  setCurrent((prev) =>
                    prev === 0 ? testimonials.length - 1 : prev - 1
                  )
                }
              />
              <CarouselNext
                className="bg-green-100 text-green-700"
                onClick={() =>
                  setCurrent((prev) => (prev + 1) % testimonials.length)
                }
              />
            </div>
          </Carousel>
        </div>

        {/* Image */}
        <div className="flex justify-center w-full md:w-auto">
          <Image
            src="/img/testi.png"
            alt="Testimonial Illustration"
            width={500}
            height={500}
            className="object-contain max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}

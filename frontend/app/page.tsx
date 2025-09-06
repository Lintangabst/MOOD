"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import MainFeatures from "@/components/MainFeatures";
import TestimonialSection from "@/components/TestimonialSection";


export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-600 leading-tight mb-4">
            Welcome to Mathematics Operation Online Development (MOOD)
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-6">
            Learn number operations in a fun and eco-friendly way! Our materials
            and exercises are designed not only to boost your math skills but
            also to inspire care for the planet. Perfect for elementary school
            students!
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-sm md:text-base">
            Start Learning
          </Button>
        </div>

        <div className="flex justify-center">
          <Image
            src="/img/hero.png"
            alt="Hero Illustration"
            width={500}
            height={500}
            className="object-contain max-w-full h-auto"
            priority
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <Image
              src="/img/about.png" 
              alt="Eco Globe"
              width={500}
              height={500}
              className="object-contain"
            />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-6">
              Eco-Friendly Education Through <br className="hidden md:block" /> Mathematical Operations
            </h2>

          <div className="space-y-4">
            {[
              {
                title: "Eco-Friendly Friendly Math",
                desc: "Explore math operations while understanding eco-",
                desc2: "friendly concept through plants.",
                image: "/img/leaves.png",
              },
              {
                title: "Sustainable Practices",
                desc: "Understand mathematics can help in promoting",
                desc2: "sustainable and eco friendly practices.",
                image: "/img/sus.png",
              },
              {
                title: "Mathematical Greenhouse",
                desc: "Apply mathematical concepts to the growth of the",
                desc2: "plants, understanding how operations affect nature.",
                image: "/img/math.png",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition border flex items-start gap-4"
              >
                {/* Left image */}
                <div className="w-6 h-6 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Right content */}
                <div>
                  <h3 className="text-green-600 font-semibold text-base">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.desc} <br/> {item.desc2} </p>
                </div>
              </div>
            ))}
          </div>

          </div>
        </div>
      </section>

      <MainFeatures />

      <TestimonialSection />

    </div>
  );
}

"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function MainFeatures() {
  const features = [
    {
      icon: "📘",
      title: "Learning Material",
      desc: "Learn various number operation concepts",
      desc2: "with an eco-friendly theme.",
    },
    {
      icon: "🏆",
      title: "Gamification",
      desc: "Collect points, exchange rewards",
    },
    {
      icon: "🧩",
      title: "Interactive Problems",
      desc: "Problems that are easy to understand with",
      desc2: "eco-friendly examples.",
    },
  ];

  return (
    <section className="bg-green-600 text-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Main Features
        </h2>

        {/* Carousel untuk mobile */}
        <div className="md:hidden">
          <Carousel className="w-full max-w-sm mx-auto">
            <CarouselContent>
              {features.map((item, idx) => (
                <CarouselItem key={idx}>
                  <div className="bg-white text-green-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-2xl rounded-full mb-4 mx-auto">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-center text-gray-600">
                      {item.desc} <br /> {item.desc2}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-6">
              <CarouselPrevious className="bg-white text-green-600 hover:bg-green-100" />
              <CarouselNext className="bg-white text-green-600 hover:bg-green-100" />
            </div>
          </Carousel>
        </div>

        {/* Grid untuk tablet dan desktop */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white text-green-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-2xl rounded-full mb-4 mx-auto">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-center text-gray-600">
                {item.desc} <br /> {item.desc2}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

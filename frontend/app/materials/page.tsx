"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LearningMaterialsPage() {
  const materials = [
    {
      title: "Adding & Subtracting",
      description:
        "Addition is when we combine two or more numbers together to get a larger number. Subtraction is when we take a number away from a larger number.",
      image: "/img/add.png",
      link: "/materials/adding-subtracting/adding",
    },
    {
      title: "Multiplying & Dividing",
      description:
        "Multiplication is the process of adding the same number repeatedly. Division is splitting something into smaller, equal parts.",
      image: "/img/multiply.png",
      link: "/materials/multiplying-dividing/multiplying",
    },
    {
      title: "Learning Videos",
      description:
        "Watch educational videos on how to perform operations correctly.",
      image: "/img/video.png",
      link: "/videos", // optional, placeholder
    },
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <h1 className="text-3xl md:text-4xl font-bold text-green-600 text-center mb-12">
        Mathematic Learning Materials - Eco Friendly
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {materials.map((item, idx) => (
          <Card
            key={idx}
            className="shadow-md hover:shadow-lg transition-all flex flex-col h-full"
          >
            <CardHeader className="flex justify-center">
              <Image
                src={item.image}
                alt={item.title}
                width={1440}
                height={1440}
                className="object-contain h-32"
              />
            </CardHeader>

            <CardContent className="flex flex-col justify-between flex-1 px-6 pb-6">
              <div>
                <h2 className="text-green-600 font-semibold text-xl mb-2">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-700">{item.description}</p>
              </div>

              <div className="mt-6">
                <Link href={item.link}>
                  <Button variant="outline" className="w-full text-sm font-semibold">
                    Start Learning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

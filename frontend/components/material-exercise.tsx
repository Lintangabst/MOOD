"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";

interface Question {
  question?: string;
  image?: string;
  correctAnswer: number;
}

interface Props {
  topic: string;
}

export default function MaterialExercise({ topic }: Props) {
  const [data, setData] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/questions?topic=${topic}`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to load question", err);
      }
    };

    fetchQuestion();
  }, [topic]);

  const handleCheck = () => {
    const userAnswer = parseInt(answer.trim());
    setResult(userAnswer === data?.correctAnswer ? "correct" : "wrong");
  };

  if (!data) return <p className="text-sm text-gray-600">Loading question...</p>;

  return (
    <div className="mt-10 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-green-700 font-bold text-lg mb-4">Soal</h3>

      {data.image && (
        <div className="mb-4">
          <Image
            src={data.image}
            alt="Question Image"
            width={500}
            height={300}
            className="object-contain rounded"
          />
        </div>
      )}

      {data.question && (
        <p className="text-sm text-gray-800 mb-4">{data.question}</p>
      )}

      <div className="flex items-center gap-2">
        <Input
          placeholder="Masukan jawabanmu di sini"
          className="max-w-sm"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <Button onClick={handleCheck} className="bg-green-600 hover:bg-green-700">
          Cek Jawaban
        </Button>
      </div>

      {result === "correct" && (
        <p className="mt-3 text-green-600 text-sm font-semibold">Jawaban kamu benar! 🎉</p>
      )}
      {result === "wrong" && (
        <p className="mt-3 text-red-500 text-sm font-semibold">Jawaban kamu masih salah, coba lagi!</p>
      )}
    </div>
  );
}

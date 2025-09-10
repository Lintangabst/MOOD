"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type CustomSet = {
  _id: string;
  title: string;
  accessCode: string;
  questions: Question[];
};

export default function CustomQuestionPage() {
  const params = useParams();
  const accessCode = params?.accessCode as string;
  const [data, setData] = useState<CustomSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Silakan login dulu");
      return;
    }

    axios
      .get(`http://localhost:5000/api/custom-questions/${accessCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Error fetch soal:", err); // ✅ pakai err
        toast.error("Soal tidak ditemukan");
      });
  }, [accessCode]);

  if (!data) return <p className="text-center mt-10">⏳ Memuat soal...</p>;

  const question = data.questions[currentIndex];

  const handleAnswer = async (option: string) => {
    setSelectedOption(option);

    if (option === question.answer) {
      setScore((prev) => prev + 1);
    }

    // ✅ Catat attempt ke backend
    try {
      const token = Cookies.get("token");
      if (token) {
        await axios.post(
          `http://localhost:5000/api/custom-questions/${data._id}/attempt`,
          { completed: option === question.answer },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Error mencatat attempt:", err); // ✅ pakai err
      toast.error("Gagal mencatat attempt");
    }

    // Delay sebelum pindah ke pertanyaan berikutnya
    setTimeout(() => {
      setSelectedOption(null);
      if (currentIndex + 1 < data.questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setShowScore(true);
      }
    }, 800);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">{data.title}</h1>

      {!showScore ? (
        <div className="border rounded-lg p-6 shadow-md">
          <p className="font-semibold mb-4">
            Pertanyaan {currentIndex + 1} dari {data.questions.length}
          </p>
          <p className="text-lg mb-4">{question.question}</p>
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={!!selectedOption}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedOption
                    ? opt === question.answer
                      ? "bg-green-400 text-white"
                      : opt === selectedOption
                      ? "bg-red-400 text-white"
                      : "bg-white"
                    : "bg-white hover:bg-yellow-100"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-6 border rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">🎉 Kuis Selesai!</h2>
          <p className="text-lg">
            Skor kamu: <span className="font-bold">{score}</span> /{" "}
            {data.questions.length}
          </p>
        </div>
      )}
    </div>
  );
}

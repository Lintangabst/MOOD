"use client";

import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

const API_KEY = "AIzaSyBMIwApNEvPvqMSjzLnncY0CYS9i99-8oE"; // jangan taruh di frontend production 🚨

type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

type HistoryItem = {
  question: string;
  options: string[];
  answer: string;
  userAnswer: string | null;
  explanation: string;
  correct: boolean;
};

const TOTAL_QUESTIONS = 10;
const TIMER_LIMIT = 30;

const ExerciseGame: React.FC = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_LIMIT);
  const [finished, setFinished] = useState<boolean>(false);
  const [rewardPoints, setRewardPoints] = useState<number | null>(null);

  const router = useRouter();

  // ambil soal baru
  const generateExercise = async () => {
    if (currentQuestion > TOTAL_QUESTIONS) {
      setFinished(true);
      return;
    }

    setLoading(true);
    setFeedback("");
    setSelectedAnswer(null);
    setTimeLeft(TIMER_LIMIT);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Buatkan 1 soal pilihan ganda tentang operasi bilangan (penjumlahan, pengurangan, perkalian, pembagian) untuk anak SD.
        Gunakan angka kecil (1–100).
        Jangan pernah menggunakan angka yang sama untuk soal dan hasil.
        Jawaban benar HARUS sama persis dengan salah satu opsi.
        Format JSON ketat:
        {
          "question": "Pertanyaan",
          "options": ["opsi A", "opsi B", "opsi C", "opsi D"],
          "answer": "jawaban benar",
          "explanation": "penjelasan singkat"
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonText = text.replace(/```json|```/g, "").trim();
      const parsed: Question = JSON.parse(jsonText);

      setQuestion(parsed);
    } catch (error) {
      console.error("Error generate soal:", error);
      setFeedback("⚠️ Gagal membuat soal, coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  // cek jawaban
  const checkAnswer = (option: string) => {
    if (!question) return;

    setSelectedAnswer(option);
    const correct =
      option.trim().toLowerCase() === question.answer.trim().toLowerCase();

    if (correct) {
      setScore((prev) => prev + 1);
      setFeedback(`✅ Benar! ${question.explanation}`);
    } else {
      setFeedback(
        `❌ Salah. Jawaban benar: ${question.answer}. ${question.explanation}`
      );
    }

    setHistory((prev) => [
      ...prev,
      {
        question: question.question,
        options: question.options,
        answer: question.answer,
        userAnswer: option,
        explanation: question.explanation,
        correct,
      },
    ]);
  };

  // auto next kalau waktu habis
  useEffect(() => {
    if (finished || !question) return;

    if (timeLeft <= 0) {
      setHistory((prev) => [
        ...prev,
        {
          question: question.question,
          options: question.options,
          answer: question.answer,
          userAnswer: null,
          explanation: question.explanation,
          correct: false,
        },
      ]);

      setCurrentQuestion((prev) => prev + 1);
      generateExercise();
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, question, finished]);

  // pertama kali jalan
  useEffect(() => {
    generateExercise();
  }, []);

  // selesai → kasih poin kalau skor >= 7
  useEffect(() => {
    if (finished && score >= 2) {
      const randomPoints = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
      setRewardPoints(randomPoints);

      const token = Cookies.get("token");
      if (token) {
        axios
          .post(
            "http://localhost:5000/api/auth/points",
            { amount: randomPoints },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((res) => {
            console.log("Poin berhasil ditambahkan:", res.data);
          })
          .catch((err) => {
            console.error("Gagal update poin:", err);
          });
      }
    }
  }, [finished, score]);

  // next soal
  const nextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
    generateExercise();
  };

  // reset game
  const playAgain = () => {
    setCurrentQuestion(1);
    setScore(0);
    setHistory([]);
    setFinished(false);
    setRewardPoints(null);
    generateExercise();
  };

  // UI selesai
  if (finished || currentQuestion > TOTAL_QUESTIONS) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-green-50 p-6">
        <h1 className="text-3xl font-bold mb-6">🎉 Selesai!</h1>
        <p className="text-xl mb-4">
          Skor akhir kamu: <span className="font-bold">{score}</span> /{" "}
          {TOTAL_QUESTIONS}
        </p>

        {rewardPoints && (
          <p className="text-lg font-semibold text-green-700 mb-4">
            🎁 Selamat! Kamu mendapatkan {rewardPoints} poin 🎉
          </p>
        )}

        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-4 space-y-4 mb-6">
          <h2 className="text-lg font-semibold">📚 Review Soal</h2>
          {history.map((h, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border bg-gray-50 text-sm text-left"
            >
              <p className="font-medium">
                {i + 1}. {h.question}
              </p>
              <p>Jawaban benar: {h.answer}</p>
              <p>
                Jawabanmu:{" "}
                {h.userAnswer ? h.userAnswer : "⏰ Tidak menjawab (waktu habis)"}
              </p>
              <p
                className={`font-semibold ${
                  h.correct ? "text-green-600" : "text-red-600"
                }`}
              >
                {h.correct ? "Benar ✅" : "Salah ❌"}
              </p>
              <p className="text-gray-600">{h.explanation}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={playAgain}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            🔄 Main Lagi
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            ⬅️ Kembali
          </button>
        </div>
      </div>
    );
  }

  // UI soal
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">🎯 MOODBOT - Exercise Game</h1>
      <p className="mb-2">
        Soal {currentQuestion} dari {TOTAL_QUESTIONS}
      </p>
      <p className="mb-4 text-red-600 font-bold">
        ⏰ Waktu tersisa: {timeLeft} detik
      </p>

      {loading && <p className="text-blue-500">Membuat soal...</p>}

      {!loading && question && (
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full">
          <p className="text-lg font-semibold mb-4">{question.question}</p>

          <div className="space-y-3">
            {question.options.map((opt, index) => (
              <button
                key={index}
                onClick={() => checkAnswer(opt)}
                disabled={!!selectedAnswer}
                className={`w-full text-left px-4 py-3 rounded-lg border transition 
                  ${
                    selectedAnswer === opt
                      ? opt.trim().toLowerCase() ===
                        question.answer.trim().toLowerCase()
                        ? "bg-green-400 text-white"
                        : "bg-red-400 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-100 text-gray-800">
              {feedback}
            </div>
          )}

          {selectedAnswer && (
            <button
              onClick={nextQuestion}
              className="mt-6 w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600"
            >
              Soal Berikutnya ➡️
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseGame;

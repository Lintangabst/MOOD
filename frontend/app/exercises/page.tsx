"use client";

import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "next/navigation";

const API_KEY = "AIzaSyBMIwApNEvPvqMSjzLnncY0CYS9i99-8oE";

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

  const router = useRouter();

  // Ambil soal baru
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
        Jangan Pernah Menggunakan Angka yang sama untuk Soal dan Hasil.
        Jawaban benar HARUS sama persis dengan salah satu nilai di "options".
        Format JSON ketat:
        {
          "question": "Pertanyaan di sini",
          "options": ["opsi A", "opsi B", "opsi C", "opsi D"],
          "answer": "Jawaban benar (harus sama persis dengan salah satu opsi)",
          "explanation": "Penjelasan singkat"
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonText = text.replace(/```json|```/g, "").trim();
      const parsed: Question = JSON.parse(jsonText);

      console.log("Soal dari AI:", parsed); // debug

      setQuestion(parsed);
    } catch (error) {
      console.error("Error generate soal:", error);
      setFeedback("⚠️ Gagal membuat soal, coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  // Cek jawaban user
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
        `❌ Salah. Jawaban yang benar: ${question.answer}. ${question.explanation}`
      );
    }

    // simpan ke history
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

  // Auto next kalau waktu habis
  useEffect(() => {
    if (finished || !question) return;

    if (timeLeft <= 0) {
      // simpan history dengan jawaban kosong
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

  // Pertama kali jalan → ambil soal
  useEffect(() => {
    generateExercise();
  }, []);

  // Next soal manual
  const nextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
    generateExercise();
  };

  // Reset game
  const playAgain = () => {
    setCurrentQuestion(1);
    setScore(0);
    setHistory([]);
    setFinished(false);
    generateExercise();
  };

  // Selesai
  if (finished || currentQuestion > TOTAL_QUESTIONS) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-green-50 p-6">
        <h1 className="text-3xl font-bold mb-6">🎉 Selesai!</h1>
        <p className="text-xl mb-4">
          Skor akhir kamu: <span className="font-bold">{score}</span> /{" "}
          {TOTAL_QUESTIONS}
        </p>

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
            🔄 Play Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            ⬅️ Back to Homepage
          </button>
        </div>
      </div>
    );
  }

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

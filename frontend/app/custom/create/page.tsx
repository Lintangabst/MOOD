"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Definisi tipe data Question
interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function CreateCustomPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const router = useRouter();

  const handleQuestionChange = (
    index: number,
    field: "question" | "answer" | string,
    value: string
  ) => {
    const updated = [...questions];

    if (field === "question" || field === "answer") {
      updated[index] = { ...updated[index], [field]: value };
    } else {
      const optionIndex = parseInt(field, 10);
      if (!isNaN(optionIndex)) {
        const newOptions = [...updated[index].options];
        newOptions[optionIndex] = value;
        updated[index] = { ...updated[index], options: newOptions };
      }
    }

    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(accessCode);
    toast.success("Kode akses disalin!");
  };

  const handleSubmit = async () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Silakan login dulu");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/custom-questions",
        { title, questions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAccessCode(res.data.accessCode);
      setModalOpen(true); // tampilkan modal
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Gagal membuat soal");
      } else {
        toast.error("Terjadi kesalahan");
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📝 Buat Soal Custom</h1>

      <input
        type="text"
        placeholder="Judul Kumpulan Soal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded-lg w-full p-2 mb-6"
      />

      {questions.map((q, idx) => (
        <div key={idx} className="border rounded-lg p-4 mb-4">
          <p className="font-semibold">Soal {idx + 1}</p>
          <input
            type="text"
            placeholder="Pertanyaan"
            value={q.question}
            onChange={(e) =>
              handleQuestionChange(idx, "question", e.target.value)
            }
            className="border rounded-lg w-full p-2 mb-2"
          />
          {q.options.map((opt, oIdx) => (
            <input
              key={oIdx}
              type="text"
              placeholder={`Opsi ${oIdx + 1}`}
              value={opt}
              onChange={(e) =>
                handleQuestionChange(idx, String(oIdx), e.target.value)
              }
              className="border rounded-lg w-full p-2 mb-2"
            />
          ))}
          <input
            type="text"
            placeholder="Jawaban Benar"
            value={q.answer}
            onChange={(e) =>
              handleQuestionChange(idx, "answer", e.target.value)
            }
            className="border rounded-lg w-full p-2"
          />
        </div>
      ))}

      <div className="flex gap-4 mb-6">
        <button
          onClick={addQuestion}
          className="bg-yellow-400 px-4 py-2 rounded-lg font-semibold"
        >
          ➕ Tambah Soal
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold"
        >
          ✅ Simpan Soal
        </button>
      </div>

      {/* Modal Popup */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>🎉 Soal Berhasil Dibuat!</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <textarea
              readOnly
              value={accessCode}
              className="flex-1 border rounded-lg p-2 font-mono resize-none h-12"
            />
            <div className="flex flex-col gap-2">
              <Button className="bg-blue-400 hover:bg-green-500" onClick={copyCode}>Copy</Button>
              <Button  variant="secondary" onClick={() => router.push("/custom")}>
                Back
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

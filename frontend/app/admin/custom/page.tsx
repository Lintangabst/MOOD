"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import AdminLayout from "@/components/Layouts/AdminLayout";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Types
interface CustomQuestion {
  _id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  topic: string;
  createdBy: {
    fullName: string;
    email: string;
  };
  attempts?: {
    user: {
      fullName: string;
      email: string;
    };
    completed: boolean;
  }[];
}

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
});

export default function AdminCustomQuestionsPage() {
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [selectedAttempts, setSelectedAttempts] = useState<
    CustomQuestion["attempts"] | null
  >(null);

  // Fetch Custom Questions
  const fetchQuestions = async () => {
    try {
      const res = await api.get<CustomQuestion[]>("/custom-questions");
      setQuestions(res.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat data soal custom";
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Delete Question
  const deleteQuestion = async (id: string) => {
    try {
      await api.delete(`/custom-questions/${id}`);
      toast.success("Soal custom berhasil dihapus");
      fetchQuestions();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal menghapus soal";
      toast.error(message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Tabel Custom Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Custom Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pertanyaan</TableHead>
                  <TableHead>Pilihan</TableHead>
                  <TableHead>Jawaban Benar</TableHead>
                  <TableHead>Topik</TableHead>
                  <TableHead>Dibuat Oleh</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((q) => (
                  <TableRow key={q._id}>
                    <TableCell>{q.question}</TableCell>
                    <TableCell>
                      {Array.isArray(q.options)
                        ? q.options.join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell>{q.correctAnswer}</TableCell>
                    <TableCell>{q.topic}</TableCell>
                    <TableCell>
                      {q.createdBy?.fullName} ({q.createdBy?.email})
                    </TableCell>
                    <TableCell>
                      {q.attempts && q.attempts.length > 0 ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAttempts(q.attempts)}
                            >
                              Detail
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detail Attempts</DialogTitle>
                            </DialogHeader>
                            {selectedAttempts ? (
                              <ul className="list-disc pl-4 space-y-2">
                                {selectedAttempts.map((a, i) => (
                                  <li key={i}>
                                    {a.user.fullName} ({a.user.email}) -{" "}
                                    {a.completed ? "Selesai" : "Hanya Masuk"}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>Belum ada data attempt.</p>
                            )}
                          </DialogContent>
                        </Dialog>
                      ) : (
                        "Belum ada yang mencoba"
                      )}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteQuestion(q._id)}
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Cookies from "js-cookie";

interface SummaryData {
  totalUsers: number;
  totalCustomQuestions: number;
  redemptionSummary: {
    pending: number;
    processing: number;
    accepted: number;
    rejected: number;
  };
}

export default function AdminDashboardChart() {
  const [summary, setSummary] = useState<SummaryData | null>(null);

  useEffect(() => {
    const token = Cookies.get("token"); // ambil token dari cookies
    if (!token) return; // jika tidak ada token, hentikan request

    axios
      .get("http://localhost:5000/api/admin/summary", {
        headers: {
          Authorization: `Bearer ${token}`, // kirim token JWT
        },
      })
      .then((res) => setSummary(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!summary) return <div>Loading...</div>;

  const barData = [
    { name: "Users", value: summary.totalUsers },
    { name: "Custom Questions", value: summary.totalCustomQuestions },
    { name: "Pending", value: summary.redemptionSummary.pending },
    { name: "Processing", value: summary.redemptionSummary.processing },
    { name: "Accepted", value: summary.redemptionSummary.accepted },
    { name: "Rejected", value: summary.redemptionSummary.rejected },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

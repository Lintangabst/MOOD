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
} from "recharts";
import Cookies from "js-cookie";

interface MonthlyStats {
  _id: { year: number; month: number };
  totalQuestions: number;
}

export default function AdminCustomQuestionChart() {
  const [data, setData] = useState<MonthlyStats[]>([]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    axios
      .get("http://localhost:5000/api/admin/custom-question-stats/monthly", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data.length) return <div>Loading...</div>;

  // Format bulan ke string "YYYY-MM"
  const chartData = data.map((item) => ({
    name: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
    value: item.totalQuestions,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Questions per Month</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

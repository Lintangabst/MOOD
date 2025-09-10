"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import AdminLayout from "@/components/Layouts/AdminLayout";

// Interfaces
interface Reward {
  _id: string;
  title: string;
  pointsRequired: number;
  stock: number;
  active: boolean;
  description?: string;
}

interface Redemption {
  _id: string;
  user: { fullName: string; email: string };
  reward: Reward;
  status: "pending" | "processing" | "accepted" | "rejected";
  pointsAtRedemption: number;
  note: string;
}

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
});

export default function AdminTransactionsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  const [newRewardTitle, setNewRewardTitle] = useState("");
  const [newRewardPoints, setNewRewardPoints] = useState<number>(0);
  const [newRewardStock, setNewRewardStock] = useState<number>(1);

  // Fetch data
  const fetchData = async () => {
    try {
      const rewardsRes = await api.get<Reward[]>("/rewards");
      setRewards(rewardsRes.data);

      const redemptionsRes = await api.get<Redemption[]>("/redemptions/list");
      setRedemptions(redemptionsRes.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengambil data";
      console.error(message);
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CRUD Reward
  const addReward = async () => {
    if (!newRewardTitle || newRewardPoints <= 0) {
      toast.error("Nama reward dan poin harus diisi dengan benar");
      return;
    }
    try {
      await api.post("/rewards", {
        title: newRewardTitle,
        pointsRequired: newRewardPoints,
        stock: newRewardStock,
      });
      toast.success("Reward berhasil ditambahkan");
      setNewRewardTitle("");
      setNewRewardPoints(0);
      setNewRewardStock(1);
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menambahkan reward";
      console.error(message);
      toast.error(message);
    }
  };

  const updateReward = async (id: string, updates: Partial<Reward>) => {
    try {
      await api.patch(`/rewards/${id}`, updates);
      toast.success("Reward diperbarui");
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memperbarui reward";
      console.error(message);
      toast.error(message);
    }
  };

  const deleteReward = async (id: string) => {
    try {
      await api.delete(`/rewards/${id}`);
      toast.success("Reward dihapus");
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menghapus reward";
      console.error(message);
      toast.error(message);
    }
  };

  // Update Redemption status
  const updateRedemptionStatus = async (id: string, status: "pending" | "processing" | "accepted" | "rejected") => {
    try {
      await api.patch(`/redemptions/${id}`, { status });
      toast.success("Status penukaran diperbarui");
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memperbarui status";
      console.error(message);
      toast.error(message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Tambah Reward */}
        <Card>
          <CardHeader>
            <CardTitle>Tambah Reward</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Nama Reward"
              value={newRewardTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRewardTitle(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Poin Required"
              value={newRewardPoints}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRewardPoints(Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Stock"
              value={newRewardStock}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRewardStock(Number(e.target.value))}
            />
            <Button onClick={addReward}>Tambah</Button>
          </CardContent>
        </Card>

        {/* Tabel Reward */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Reward</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward._id}>
                    <TableCell>{reward.title}</TableCell>
                    <TableCell>{reward.pointsRequired}</TableCell>
                    <TableCell>{reward.stock}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={reward.active ? "true" : "false"}
                        onValueChange={(val: string) => updateReward(reward._id, { active: val === "true" })}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => deleteReward(reward._id)}>
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tabel Redemption */}
        <Card>
          <CardHeader>
            <CardTitle>Status Penukaran Poin</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redemptions.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell>{r.user.fullName}</TableCell>
                    <TableCell>{r.reward.title}</TableCell>
                    <TableCell>{r.pointsAtRedemption}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={r.status}
                        onValueChange={(status: "pending" | "processing" | "accepted" | "rejected") =>
                          updateRedemptionStatus(r._id, status)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{r.note}</TableCell>
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

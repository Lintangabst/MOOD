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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Types
interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "admin" | "user-premium";
  isVerified: boolean;
}

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
});

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await api.get<User[]>("/users");
      setUsers(res.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memuat data pengguna";
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tambah User
  const addUser = async () => {
    if (!newName || !newEmail || !newPassword) {
      toast.error("Lengkapi semua data user baru");
      return;
    }
    try {
      await api.post("/users", {
        fullName: newName,
        email: newEmail,
        password: newPassword,
        role: "user",
      });
      toast.success("User berhasil ditambahkan");
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      fetchUsers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menambahkan user";
      toast.error(message);
    }
  };

  // Update Role
  const updateRole = async (id: string, role: "user" | "admin" | "user-premium") => {
    try {
      await api.patch(`/users/${id}`, { role });
      toast.success("Role berhasil diperbarui");
      fetchUsers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memperbarui role";
      toast.error(message);
    }
  };

  // Toggle Verified
  const toggleVerified = async (id: string, isVerified: boolean) => {
    try {
      await api.patch(`/users/${id}`, { isVerified });
      toast.success("Status verifikasi diperbarui");
      fetchUsers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memperbarui verifikasi";
      toast.error(message);
    }
  };

  // Delete User
  const deleteUser = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success("User berhasil dihapus");
      fetchUsers();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menghapus user";
      toast.error(message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Tambah User */}
        <Card>
          <CardHeader>
            <CardTitle>Tambah Pengguna</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Nama Lengkap"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button onClick={addUser}>Tambah</Button>
          </CardContent>
        </Card>

        {/* Tabel User */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(val: "user" | "admin" | "user-premium") =>
                          updateRole(user._id, val)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user-premium">User Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={user.isVerified ? "true" : "false"}
                        onValueChange={(val: string) =>
                          toggleVerified(user._id, val === "true")
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Verified</SelectItem>
                          <SelectItem value="false">Not Verified</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteUser(user._id)}
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarItem } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { Home, Users, FileText, DollarSign } from "lucide-react";
import AdminDashboardChart from "./AdminDashboardChart";
import AdminCustomQuestionChart from "./AdminCustomQuestionChart";


const menuItems = [
  { title: "Dashboard", icon: <Home />, route: "/admin/" },
  { title: "Users", icon: <Users />, route: "/admin/users" },
  { title: "Custom Questions", icon: <FileText />, route: "/admin/custom" },
  { title: "Transactions", icon: <DollarSign />, route: "/admin/transactions" },
];

export default function AdminPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        animate={{ width: collapsed ? 80 : 250 }}
        className="bg-white border-r border-gray-200 flex flex-col transition-all duration-300"
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          <h1 className="font-bold text-lg">{!collapsed && "MOOD Admin"}</h1>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1"
          >
            {collapsed ? "➤" : "⬅"}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <SidebarItem
              key={idx}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => router.push(item.route)}
            >
              {item.icon}
              {!collapsed && <span>{item.title}</span>}
            </SidebarItem>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        <AdminDashboardChart />
  <AdminCustomQuestionChart />

      </div>

    </div>
  );
}

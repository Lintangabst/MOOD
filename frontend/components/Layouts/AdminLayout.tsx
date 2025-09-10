// frontend/components/layouts/AdminLayout.tsx
"use client";

import { ReactNode, useState } from "react";
import { SidebarContent, SidebarItem } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { title: "Dashboard", icon: <Home />, route: "/admin/" },
    { title: "Users", icon: <Users />, route: "/admin/users" },
    { title: "Custom Questions", icon: <FileText />, route: "/admin/custom" },
    { title: "Transactions", icon: <DollarSign />, route: "/admin/transactions" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex flex-col">
        <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
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

          <SidebarContent>
            {menuItems.map((item, idx) => (
              <SidebarItem
                key={idx}
                onClick={() => router.push(item.route)}
                className={pathname === item.route ? "bg-gray-200 font-bold" : ""}
              >
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
              </SidebarItem>
            ))}
          </SidebarContent>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

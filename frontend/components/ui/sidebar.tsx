// frontend/components/ui/sidebar.tsx
"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

interface SidebarItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Sidebar = ({ children, className }: SidebarProps) => {
  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-gray-200 h-screen w-64",
        className
      )}
    >
      {children}
    </div>
  );
};

export const SidebarHeader = ({ children }: { children: ReactNode }) => (
  <div className="px-4 py-4 border-b font-bold text-lg">{children}</div>
);

export const SidebarContent = ({ children }: { children: ReactNode }) => (
  <div className="flex-1 overflow-y-auto">{children}</div>
);

export const SidebarItem = ({
  children,
  onClick,
  className,
}: SidebarItemProps) => (
  <div
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition",
      className
    )}
  >
    {children}
  </div>
);

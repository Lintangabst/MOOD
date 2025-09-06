"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react"; // optional: for icon

const menuMap: Record<string, string[]> = {
  "adding-subtracting": ["adding", "subtracting"],
  "multiplying-dividing": ["multiplying", "dividing"],
};

const labelMap: Record<string, string> = {
  adding: "Adding",
  subtracting: "Subtracting",
  multiplying: "Multiplying",
  dividing: "Dividing",
};

// Dynamic content components
const contentComponents: Record<string, any> = {
  adding: dynamic(() => import("./_content/adding")),
  subtracting: dynamic(() => import("./_content/subtracting")),
  multiplying: dynamic(() => import("./_content/multiplying")),
  dividing: dynamic(() => import("./_content/dividing")),
};

export default function MaterialTopicPage() {
  const params = useParams();
  const category = params.category as string;
  const topic = params.topic as string;

  const menus = menuMap[category] || [];
  const SelectedContent = contentComponents[topic];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/6 bg-white p-6 border-r hidden md:flex flex-col justify-between">
        <div>
          <Link
            href="/materials"
            className="inline-flex items-center gap-2 mb-6 text-green-700 hover:text-green-800 text-sm font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Materials
          </Link>

          <h2 className="text-lg font-semibold text-green-700 mb-4">Materials</h2>
          <nav className="space-y-2">
            {menus.map((item) => (
              <Link
                key={item}
                href={`/materials/${category}/${item}`}
                className={cn(
                  "block px-4 py-2 rounded-md text-sm font-medium hover:bg-green-100 transition",
                  topic === item ? "bg-green-600 text-white" : "text-green-700"
                )}
              >
                {labelMap[item]}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-6">
          {labelMap[topic] || "Material"}
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          {SelectedContent ? <SelectedContent /> : <p>Material not found.</p>}
        </div>
      </main>
    </div>
  );
}

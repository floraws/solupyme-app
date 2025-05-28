"use client";

import { useAuth } from "@/hooks/useAuth";

export default function ProductPage() {
  useAuth();
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
     </div>
  );
}

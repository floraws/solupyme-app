"use client";

import { useAuth } from "@/hooks/useAuth";

export default function ProductPage() {
  useAuth();
  return (
    <h1>Hola</h1>
  )
}

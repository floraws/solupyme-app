"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export function useAuth() {
  const router = useRouter();
  useEffect(() => {
    const isLoggedIn = authService.isLoggedIn;
    if (!isLoggedIn) {
      router.replace("/login");
    }
    // Opcional: aquí puedes validar el JWT (expiración, etc.)
  }, [router]);
}
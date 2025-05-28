"use client";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export function useLogout() {
  const router = useRouter();

  return () => {
    authService.logout(); 
    router.replace("/login");
  };
}
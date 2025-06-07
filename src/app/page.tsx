"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const { isAuthenticated, isLoading, user, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboards");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return null;
}
"use client";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import {
  HomeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { LogoutButton } from "@/components/LogoutButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";


export default function ClientLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const { isAuthenticated, isLoading, tokenExpiringSoon } = useAuth();
  const [queryClient] = useState(() => new QueryClient());

  // Si no está autenticado, el hook ya redirigirá al login
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Main content */}
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col flex-1 md:pl-64">
          <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex h-16 items-center px-4 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900">Cuenta</h1>
          </header>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </QueryClientProvider>
    </>
  );
}

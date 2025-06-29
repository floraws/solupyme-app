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

const navigation = [
  { name: "Inicio", href: "/dashboards", icon: HomeIcon, current: true },
  { name: "Productos", href: "/products", icon: UserGroupIcon, current: false },
  { name: "Terceros", href: "/bpartners", icon: UserGroupIcon, current: false },
  { name: "Empleados", href: "/employees", icon: UserGroupIcon, current: false },
  { name: "Documentos", href: "/documents", icon: UserGroupIcon, current: false },
  { name: "Configuración", href: "/settings", icon: Cog6ToothIcon, current: false },
];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const { isAuthenticated, isLoading, tokenExpiringSoon } = useAuth();
  const [queryClient] = useState(() => new QueryClient());

  // Mostrar indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, el hook ya redirigirá al login
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Alerta de token por expirar */}
      {tokenExpiringSoon && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Tu sesión expirará pronto. Los datos se guardarán automáticamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-200">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={32}
                className="dark:invert"
                style={{ height: "auto", width: "auto" }}
                priority
              />
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${item.current
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${item.current
                      ? "text-gray-500"
                      : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <a
              href="#"
              className="flex items-center group w-full"
            >
              <ArrowLeftStartOnRectangleIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500 mr-3" />
              <LogoutButton />
            </a>
          </div>
        </aside>
        {/* Main content */}
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </div>
    </>
  );
}

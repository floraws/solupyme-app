"use client";

import { useAuth } from "@/hooks/useAuth";

export function LogoutButton() {
  const { logout: authLogout } = useAuth();
  return (
    <span onClick={authLogout} className="text-sm font-medium text-gray-600 group-hover:text-gray-900 cursor-pointer">
      Cerrar sesión
    </span>
  );
}
"use client";
import { useLogout } from "@/hooks/useLogout";

export function LogoutButton() {
  const logout = useLogout();
  return (
    <span onClick={logout} className="text-sm font-medium text-gray-600 group-hover:text-gray-900 cursor-pointer">
      Cerrar sesión
    </span>
  );
}
"use client";
import { CLIENT_ID } from "@/constants";
import { clientService } from "@/services";
import { useCSRF } from "@/hooks/useCSRF";
import { useAuth } from "@/hooks/useAuthAdvanced";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { token: csrfToken, loading: csrfLoading, error: csrfError, validateAndGetToken } = useCSRF();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      setIsLoading(true); setError("");      // Validar y obtener token CSRF
      await validateAndGetToken();

      // Realizar login con protección CSRF
      const data = await authLogin({ username: email, password });

      // Buscar clientes asociados
      const clients = await clientService.findClientByUserId(data.user_id!);

      if (clients && clients.length == 1) {
        localStorage.setItem(CLIENT_ID, clients[0].id);
        window.location.href = "/dashboards";
      } else if (clients && clients.length > 1) {
        window.location.href = "/clients";
      } else {
        setError("No se encontraron clientes asociados a tu cuenta.");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error al iniciar sesión. Por favor, verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading si CSRF token no está disponible
  if (csrfLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>

        {/* CSRF Token (hidden field) */}
        {csrfToken && (
          <input type="hidden" name="csrf_token" value={csrfToken} />
        )}

        {/* Error del CSRF */}
        {csrfError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">Error de seguridad: {csrfError}</p>
          </div>
        )}

        {/* Error del login */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Correo electrónico</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || !csrfToken}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Contraseña</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || !csrfToken}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !csrfToken}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </>
          ) : (
            'Entrar'
          )}
        </button>

        {/* Información de seguridad */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>🔒 Conexión segura con protección CSRF</p>
        </div>
      </form>
    </div>
  );
}

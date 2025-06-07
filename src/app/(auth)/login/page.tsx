"use client";

import { useCSRF } from "@/hooks/useCSRF";
import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Ingresa un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(5, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede tener más de 100 caracteres")
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { token: csrfToken, loading: csrfLoading, error: csrfError, validateAndGetToken } = useCSRF();
  const { isAuthenticated, login: authLogin } = useAuth();

  const route = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    setError: setFieldError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError("");
      const validatedData = loginSchema.parse(data);
      await validateAndGetToken();
      const loginResponse = await authLogin({
        username: validatedData.email,
        password: validatedData.password
      });
      if (loginResponse) {
        route.push("/clients");
      } else {
        setError("Error al iniciar sesión. Por favor, intenta nuevamente.");
      }
    } catch (err) {
      console.error("Error en login:", err);
      if (err instanceof z.ZodError) {
        err.errors.forEach((error) => {
          setFieldError(error.path[0] as keyof LoginFormData, {
            type: "manual",
            message: error.message
          });
        });
      } else if (err && typeof err === 'object' && 'status' in err) {
        const apiError = err as { status: number; message?: string };
        switch (apiError.status) {
          case 401:
            setError("Credenciales incorrectas. Verifica tu email y contraseña.");
            break;
          case 403:
            setError("Error de seguridad. Por favor, recarga la página e intenta nuevamente.");
            break;
          case 429:
            setError("Demasiados intentos. Espera unos minutos antes de intentar nuevamente.");
            break;
          default:
            setError(apiError.message || "Error al iniciar sesión. Por favor, intenta nuevamente.");
        }
      } else {
        setError("Error de conexión. Verifica tu conexión a internet.");
      }

      reset({ password: "" }); // Limpiar solo la contraseña
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading si CSRF token no está disponible
  if (csrfLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Inicializando seguridad...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        noValidate // ✅ Deshabilitar validación HTML para usar Zod
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SoluPYME</h1>
          <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        {/* CSRF Token (hidden field) */}
        {csrfToken && (
          <input type="hidden" name="csrf_token" value={csrfToken} />
        )}

        {/* Error del CSRF */}
        {csrfError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm font-medium">Error de seguridad: {csrfError}</p>
            </div>
          </div>
        )}

        {/* Error del login */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Campo Email */}
        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.email
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            placeholder="usuario@ejemplo.com"
            disabled={isLoading || !csrfToken}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Campo Contraseña */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.password
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            placeholder="••••••••"
            disabled={isLoading || !csrfToken}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={isLoading || !csrfToken || !isValid || isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-sm shadow-sm"
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
            'Iniciar sesión'
          )}
        </button>

        {/* Información de validación */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {isValid ? (
              <span className="text-green-600">✓ Formulario válido</span>
            ) : (
              <span className="text-gray-400">Completa todos los campos</span>
            )}
          </p>
        </div>

        {/* Enlaces adicionales */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            ¿Problemas para acceder?{" "}
            <a href="/forgot-password" className="text-blue-600 hover:text-blue-500 font-medium hover:underline">
              Recuperar contraseña
            </a>
          </p>
          <p className="text-xs text-gray-500">
            Al iniciar sesión, aceptas nuestros{" "}
            <a href="/terms" className="text-blue-600 hover:underline">términos de servicio</a>
          </p>
        </div>
      </form>
    </div>
  );
}
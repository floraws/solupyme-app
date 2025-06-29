"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cityService } from "@/services";
import { Button, Alert, LoadingSpinner } from "@/components/ui";

export default function CreateCitiesColombiaPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleCreateStates = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await cityService.createCitiesColombia();
            setSuccess(true);

            // Redirigir después de 2 segundos
            setTimeout(() => {
                router.push("/cities");
            }, 2000);
        } catch (error) {
            console.error("Error creating cities:", error);
            setError("Error al crear los ciudades. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Crear Todos los Municipios de Colombia
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Esta acción creará todos los municipios predefinidos en el sistema.
                    </p>

                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            className="mb-6"
                            onClose={() => setError(null)}
                        />
                    )}

                    {success && (
                        <Alert
                            type="success"
                            title="Municipios creados exitosamente!"
                            message="Serás redirigido a la lista de departamentos en unos segundos..."
                            className="mb-6"
                        />
                    )}

                    <div className="flex justify-center space-x-4">
                        <Button
                            variant="secondary"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateStates}
                            disabled={loading || success}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Creando municipios...
                                </>
                            ) : success ? (
                                "Municipios creados!"
                            ) : (
                                "Crear Municipios"
                            )}
                        </Button>
                    </div>

                    {success && (
                        <div className="mt-4 text-sm text-gray-500">
                            Redirigiendo automáticamente...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
"use client";
import { LoadingSpinner } from "@/components/ui/Loading";
import { useRouter } from "next/navigation";
import { authService, clientService } from "@/services";
import { ClientResponse } from "@/types/api";

import {
    ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

import { useClient } from "@/hooks/useClient";
const defaultClients: ClientResponse[] = [
    {
        id: "",
        businessName: ""
    }
];

const ClientsPage = () => {
    const userId = authService.userId;
    const router = useRouter();
    const { isLoading, isSuccess, clients } = useClient();

    const changeClient = async (clientId: string) => {
        authService.clientId = clientId;
        router.push(`/dashboards`);
    };
    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            {isSuccess && clients && clients.map((client) => {
                return (
                    <div key={client.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <ArchiveBoxIcon className="h-8 w-8 text-blue-600 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">{client.businessName}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{client.businessName}</p>
                        <a
                            onClick={() => changeClient(client.id)}
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            Ir a {client.businessName}
                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                );
            })}
        </div>
    );
}
export default ClientsPage;


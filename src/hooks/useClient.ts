"use client";
import { authService, clientService } from "@/services";
import { ClientResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface ClientStatus {
    isLoading: boolean;
    isSuccess: boolean;
    clients: ClientResponse[] | null;
    error: string | null;
}

const defaultClients: ClientResponse[] = [
    {
        id: "",
        businessName: ""
    }
];


export const useClient = () => {
    const [state, setState] = useState<ClientStatus>({
        isLoading: true,
        isSuccess: false,
        error: null,
        clients: null,
    });
    const router = useRouter();
    const { data: clients, isLoading, isSuccess } = useQuery<ClientResponse[]>({
        queryKey: ['clients'],
        queryFn: () => clientService.findClientByUserId(authService.userId!)
    });
    useEffect(() => {
        if (isSuccess && clients && clients.length === 1) {
            authService.clientId = clients[0].id;
            router.push(`/dashboards`);
        }
        if (isSuccess && clients && clients.length > 1) {
            setState(prevState => ({
                ...prevState,
                isLoading: false,
                isSuccess: true,
                clients: clients,
                error: null
            }));
        }
        if (isLoading) {
            setState(prevState => ({
                ...prevState,
                isLoading: true,
                isSuccess: false,
                error: null
            }));
        }
    }, [isSuccess, isLoading]);
    return {
        ...state
    };
};
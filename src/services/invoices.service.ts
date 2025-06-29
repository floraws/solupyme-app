// import { apiUrls } from "@/constants";
// import { fetchWrapper } from "@/helpers";
import { InvoiceResponse } from "@/types/api";
import invoicesData from "@/data/invoices.json";

export const invoicesService = {
    findLastInvoices,
    getAllInvoices,
    getInvoiceById,
    getInvoicesByStatus,
    getInvoicesByCustomer,
    getTotalInvoiceAmount,
}


async function findLastInvoices(): Promise<InvoiceResponse[]> {
    try {
        // Simular datos locales para desarrollo
        // En producción, usar: return await fetchWrapper.get(apiUrls.invoices.findLastInvoice) as InvoiceResponse[];
        
        // Ordenar por fecha descendente y tomar las últimas 5
        const sortedInvoices = [...invoicesData]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
            
        return sortedInvoices as InvoiceResponse[];
    } catch (error) {
        console.error("Error fetching last invoices:", error);
        return [];
    }
}

async function getAllInvoices(): Promise<InvoiceResponse[]> {
    try {
        // Simular datos locales para desarrollo
        // En producción, usar: return await fetchWrapper.get(apiUrls.invoices.getAllInvoices) as InvoiceResponse[];
        
        return invoicesData as InvoiceResponse[];
    } catch (error) {
        console.error("Error fetching all invoices:", error);
        return [];
    }
}
async function getInvoiceById(id: string): Promise<InvoiceResponse | null> {
    try {
        // Simular datos locales para desarrollo
        // En producción, usar: return await fetchWrapper.get(apiUrls.invoices.getInvoiceById(id)) as InvoiceResponse;
        
        const invoice = invoicesData.find(inv => inv.id === id);
        return invoice ? invoice as InvoiceResponse : null;
    } catch (error) {
        console.error("Error fetching invoice by ID:", error);
        return null;
    }
}

// Obtener facturas por estado
async function getInvoicesByStatus(status: string): Promise<InvoiceResponse[]> {
    try {
        const filteredInvoices = invoicesData.filter(invoice => invoice.status === status);
        return filteredInvoices as InvoiceResponse[];
    } catch (error) {
        console.error("Error fetching invoices by status:", error);
        return [];
    }
}

// Obtener facturas por cliente
async function getInvoicesByCustomer(customerId: string): Promise<InvoiceResponse[]> {
    try {
        const filteredInvoices = invoicesData.filter(invoice => invoice.customer.id === customerId);
        return filteredInvoices as InvoiceResponse[];
    } catch (error) {
        console.error("Error fetching invoices by customer:", error);
        return [];
    }
}

// Obtener total de una factura específica o de todas
async function getTotalInvoiceAmount(invoiceId?: string): Promise<number> {
    try {
        if (invoiceId) {
            const invoice = invoicesData.find(inv => inv.id === invoiceId);
            return invoice ? invoice.total : 0;
        } else {
            // Sumar todas las facturas
            return invoicesData.reduce((total, invoice) => total + invoice.total, 0);
        }
    } catch (error) {
        console.error("Error calculating total invoice amount:", error);
        return 0;
    }
}

// Add more functions as needed for invoice management
// For example, createInvoice, updateInvoice, deleteInvoice, etc.

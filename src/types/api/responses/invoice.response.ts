export interface InvoiceResponse {
    // Identificación y números
    id: string;
    number: string;
    
    // Fechas
    date: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    
    // Estado
    status: string;
    paymentStatus?: string;
    
    // Cliente
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    
    // Items/Productos
    items: Array<{
        id: string;
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }>;
    
    // Moneda y cambio
    currency: string;
    exchangeRate?: number;
    
    // Cálculos financieros
    subtotal?: number;
    taxRate?: number;
    taxAmount?: number;
    discount?: number;
    total: number;
    
    // Términos y condiciones
    paymentTerms?: string;
    
    // Contenido adicional
    notes?: string;
    attachments?: Array<{
        id: string;
        fileName: string;
        fileType: string;
        fileSize: number;
        url: string;
    }>;
    
    // Datos flexibles
    customFields?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}
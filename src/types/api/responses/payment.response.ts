// Tipos auxiliares para mejor organización y reutilización
export type PaymentCurrency = 'COP' | 'USD' | 'EUR' ;

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'wire_transfer'
  | 'cash'
  | 'check'
  | 'digital_wallet'  // PayPal, Nequi, Mercado Pago, etc.
  | 'cryptocurrency'
  | 'pse'             // Pagos Seguros en Línea (Colombia)
  | 'other';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'disputed';

export type BPartnerType = 'customer' | 'supplier' | 'employee' | 'other';

export interface PaymentAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number; // Size in bytes
  url: string;
  uploadedAt: string; // ISO date string
  uploadedBy?: string; // ID of the user who uploaded
}

export interface RelatedInvoice {
  id: string;
  number: string;
  amount: number;
  paidAmount?: number; // Cantidad pagada específicamente de esta factura
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  dueDate: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface RelatedTransaction {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  date: string; // ISO date string
  description?: string;
  accountId?: string; // Cuenta bancaria asociada
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface PaymentProcessor {
  name: string; // Nombre del procesador (PSE, Nequi, Bancolombia, etc.)
  transactionId?: string; // ID de transacción del procesador
  authCode?: string; // Código de autorización
  fees?: number; // Comisiones del procesador
  responseCode?: string; // Código de respuesta
  responseMessage?: string; // Mensaje de respuesta
}

export interface PaymentResponse {
  // === Identificación ===
  id: string;
  number?: string; // Número de pago interno
  reference?: string; // Referencia externa (banco, procesador, etc.)
  
  // === Información Financiera ===
  amount: number; // Monto del pago (siempre positivo)
  currency: PaymentCurrency;
  exchangeRate?: number; // Tasa de cambio si aplica conversión
  
  // === Fechas ===
  date: string; // Fecha del pago (ISO date string)
  processedAt?: string; // Fecha de procesamiento (ISO date string)
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  
  // === Estado y Método ===
  method: PaymentMethod;
  status: PaymentStatus;
  
  // === Business Partner ===
  bpartner: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    type: BPartnerType;
  };
  
  // === Auditoría ===
  createdBy?: string; // ID del usuario que creó el pago
  lastUpdatedBy?: string; // ID del usuario que actualizó por última vez
  
  // === Información Adicional ===
  description?: string; // Descripción del pago
  notes?: string; // Notas adicionales
  tags?: string[]; // Tags para categorización
  
  // === Archivos Adjuntos ===
  attachments?: PaymentAttachment[];
  
  // === Relaciones ===
  relatedInvoices?: RelatedInvoice[];
  relatedTransactions?: RelatedTransaction[];
  
  // === Información del Procesador de Pagos ===
  processor?: PaymentProcessor;
  
  // === Extensibilidad ===
  metadata?: Record<string, unknown>; // Metadatos adicionales
  customFields?: Record<string, unknown>; // Campos personalizados
}
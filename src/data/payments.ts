import { PaymentResponse, PaymentMethod, PaymentStatus } from '../types/api/responses';

// Ejemplo de datos de pago con la nueva estructura
export const samplePaymentData: PaymentResponse = {
  // === Identificación ===
  id: "pay_2025_001",
  number: "PAY-2025-000001",
  reference: "TXN-BANK-123456789",
  
  // === Información Financiera ===
  amount: 1500000, // $1,500,000 COP
  currency: "COP",
  exchangeRate: 1.0,
  
  // === Fechas ===
  date: "2025-06-30T10:30:00Z",
  processedAt: "2025-06-30T10:32:15Z",
  createdAt: "2025-06-30T10:30:00Z",
  updatedAt: "2025-06-30T10:32:15Z",
  
  // === Estado y Método ===
  method: "bank_transfer",
  status: "completed",
  
  // === Business Partner ===
  bpartner: {
    id: "bp_001",
    name: "Empresa ABC S.A.S",
    email: "contabilidad@empresaabc.com",
    phone: "+57 300 123 4567",
    type: "customer"
  },
  
  // === Auditoría ===
  createdBy: "user_123",
  lastUpdatedBy: "user_123",
  
  // === Información Adicional ===
  description: "Pago de facturas pendientes - Servicios de consultoría",
  notes: "Pago realizado a través de transferencia bancaria. Cliente confirmó el pago vía email.",
  tags: ["consultoría", "servicios", "junio-2025"],
  
  // === Archivos Adjuntos ===
  attachments: [
    {
      id: "att_001",
      fileName: "comprobante_pago.pdf",
      fileType: "application/pdf",
      fileSize: 245678,
      url: "/api/attachments/att_001/download",
      uploadedAt: "2025-06-30T10:35:00Z",
      uploadedBy: "user_123"
    }
  ],
  
  // === Relaciones ===
  relatedInvoices: [
    {
      id: "inv_2025_001",
      number: "FAC-2025-000001",
      amount: 800000,
      paidAmount: 800000,
      status: "paid",
      dueDate: "2025-06-30T23:59:59Z",
      createdAt: "2025-06-15T08:00:00Z",
      updatedAt: "2025-06-30T10:32:15Z"
    },
    {
      id: "inv_2025_002",
      number: "FAC-2025-000002",
      amount: 700000,
      paidAmount: 700000,
      status: "paid",
      dueDate: "2025-07-15T23:59:59Z",
      createdAt: "2025-06-20T08:00:00Z",
      updatedAt: "2025-06-30T10:32:15Z"
    }
  ],
  
  relatedTransactions: [
    {
      id: "txn_001",
      type: "credit",
      amount: 1500000,
      date: "2025-06-30T10:32:15Z",
      description: "Pago recibido - Empresa ABC S.A.S",
      accountId: "acc_caja_principal",
      createdAt: "2025-06-30T10:32:15Z",
      updatedAt: "2025-06-30T10:32:15Z"
    }
  ],
  
  // === Información del Procesador ===
  processor: {
    name: "Bancolombia",
    transactionId: "BCO-2025-987654321",
    authCode: "AUTH-ABC123",
    fees: 5000, // $5,000 COP comisión bancaria
    responseCode: "00",
    responseMessage: "Transacción exitosa"
  },
  
  // === Extensibilidad ===
  metadata: {
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    source: "web_app"
  },
  
  customFields: {
    departamento: "Ventas",
    proyecto: "Consultoría Q2 2025",
    aprobadoPor: "gerente_ventas"
  }
};

// Ejemplo de datos de pago con PSE (Pagos Seguros en Línea)
export const samplePSEPayment: PaymentResponse = {
  id: "pay_2025_002",
  number: "PAY-2025-000002",
  reference: "PSE-789123456",
  
  amount: 250000,
  currency: "COP",
  
  date: "2025-06-30T14:15:00Z",
  processedAt: "2025-06-30T14:17:30Z",
  createdAt: "2025-06-30T14:15:00Z",
  updatedAt: "2025-06-30T14:17:30Z",
  
  method: "pse",
  status: "completed",
  
  bpartner: {
    id: "bp_003",
    name: "Juan Carlos Rodríguez",
    email: "juan.rodriguez@email.com",
    phone: "+57 301 234 5678",
    type: "customer"
  },
  
  createdBy: "user_456",
  lastUpdatedBy: "user_456",
  
  description: "Pago de servicios profesionales - Consultoría independiente",
  
  processor: {
    name: "PSE - Banco Davivienda",
    transactionId: "PSE-DAV-2025-456789",
    authCode: "PSE-AUTH-XYZ789",
    fees: 3500,
    responseCode: "00",
    responseMessage: "Pago exitoso PSE"
  },
  
  metadata: {
    banco: "Banco Davivienda",
    tipoTransaccion: "PSE",
    canalPago: "web"
  }
};

// Ejemplo de pago fallido
export const sampleFailedPayment: PaymentResponse = {
  id: "pay_2025_003",
  number: "PAY-2025-000003",
  reference: "FAIL-123456789",
  
  amount: 500000,
  currency: "COP",
  
  date: "2025-06-30T16:45:00Z",
  createdAt: "2025-06-30T16:45:00Z",
  updatedAt: "2025-06-30T16:47:00Z",
  
  method: "credit_card",
  status: "failed",
  
  bpartner: {
    id: "bp_004",
    name: "María González Consultores",
    email: "maria.gonzalez@consultores.com",
    phone: "+57 302 345 6789",
    type: "customer"
  },
  
  createdBy: "user_789",
  lastUpdatedBy: "user_789",
  
  description: "Intento de pago - Tarjeta de crédito",
  notes: "Pago rechazado por fondos insuficientes. Cliente contactado para método alternativo.",
  
  processor: {
    name: "Credibanco",
    transactionId: "CREDI-2025-FAIL-123",
    responseCode: "51",
    responseMessage: "Fondos insuficientes"
  },
  
  metadata: {
    motivoRechazo: "Fondos insuficientes",
    tipoTarjeta: "Visa",
    ultimosDigitos: "****1234"
  }
};

// Función helper para formatear pagos
export const formatPaymentAmount = (payment: PaymentResponse): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: payment.currency,
    minimumFractionDigits: 0
  }).format(payment.amount);
};

// Función helper para obtener el estado en español
export const getPaymentStatusText = (status: PaymentStatus): string => {
  const statusMap = {
    pending: 'Pendiente',
    processing: 'Procesando',
    completed: 'Completado',
    failed: 'Fallido',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
    disputed: 'En disputa'
  };
  
  return statusMap[status] || status;
};

// Función helper para obtener el método en español
export const getPaymentMethodText = (method: PaymentMethod): string => {
  const methodMap = {
    credit_card: 'Tarjeta de Crédito',
    debit_card: 'Tarjeta Débito',
    bank_transfer: 'Transferencia Bancaria',
    wire_transfer: 'Transferencia Internacional',
    cash: 'Efectivo',
    check: 'Cheque',
    digital_wallet: 'Billetera Digital',
    cryptocurrency: 'Criptomoneda',
    pse: 'PSE',
    other: 'Otro'
  };
  
  return methodMap[method] || method;
};

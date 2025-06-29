export interface BPartnerResponse {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    taxId?: string;
    type: 'customer' | 'supplier' | 'both';
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, unknown>;
    customFields?: Record<string, unknown>;
    attachments?: Array<{
        id: string;
        fileName: string;
        fileType: string;
        fileSize: number;
        url: string;
    }>;
    notes?: string;
    status?: 'active' | 'inactive';
    tags?: string[];
    lastContacted?: string; // Fecha del último contacto
    preferredContactMethod?: 'email' | 'phone' | 'in-person';
    socialMedia?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        other?: Record<string, string>; // Otros enlaces sociales
    };
    billingAddress?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    shippingAddress?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    notesHistory?: Array<{
        date: string;
        note: string;
    }>;
    contactPersons?: Array<{
        id: string;
        name: string;
        email?: string;
        phone?: string;
        position?: string;
        notes?: string;
        preferredContactMethod?: 'email' | 'phone' | 'in-person';
    }>;
    paymentTerms?: string; // Términos de pago específicos para este socio
    creditLimit?: number; // Límite de crédito asignado
    creditBalance?: number; // Saldo de crédito actual
    lastPurchaseDate?: string; // Fecha de la última compra
    lastSaleDate?: string; // Fecha de la última venta
    salesHistory?: Array<{
        date: string;
        amount: number;
        currency: string;
        description?: string;
    }>;
    purchaseHistory?: Array<{
        date: string;
        amount: number;
        currency: string;
        description?: string;
    }>;
    loyaltyPoints?: number; // Puntos de lealtad acumulados
    preferences?: {
        language?: string; // Idioma preferido
        communicationFrequency?: 'daily' | 'weekly' | 'monthly'; // Frecuencia de comunicación preferida
        marketingOptIn?: boolean; // Si el socio acepta recibir marketing
    };
    // 🏢 Información corporativa adicional
    legalName?: string; // Razón social oficial
    tradeName?: string; // Nombre comercial
    registrationNumber?: string; // Número de registro mercantil
    industry?: string; // Sector industrial
    companySize?: 'micro' | 'small' | 'medium' | 'large' | 'enterprise';
    website?: string;
    
    // 👥 Información de relaciones
    parentCompany?: string; // Empresa matriz
    referredBy?: string; // Referido por
    accountManager?: string; // Gerente de cuenta asignado
    salesRepresentative?: string; // Representante de ventas
    
    // 💰 Información financiera avanzada
    annualRevenue?: number;
    employeeCount?: number;
    riskLevel?: 'low' | 'medium' | 'high';
    defaultCurrency?: string;
    priceList?: string; // Lista de precios asignada
    discountLevel?: number; // Nivel de descuento porcentual
    
    // 📊 Segmentación y marketing
    segment?: 'vip' | 'premium' | 'standard' | 'basic';
    customerLifecycleStage?: 'prospect' | 'lead' | 'customer' | 'advocate' | 'churned';
    leadSource?: string; // Fuente del lead
    
    // 🌍 Información geográfica
    timezone?: string;
    territory?: string; // Territorio de ventas
    region?: string;
    
    // 📝 Compliance y legal
    gdprConsent?: boolean; // Consentimiento GDPR
    dataProcessingConsent?: boolean;
    blacklisted?: boolean;
    blacklistReason?: string;
    
    // 📈 Métricas de negocio
    totalLifetimeValue?: number; // Valor total del cliente
    averageOrderValue?: number;
    totalOrderCount?: number;
    churnRisk?: number; // Riesgo de abandono (0-100)
    
    // 🚚 Logística
    deliveryInstructions?: string;
    preferredDeliveryTime?: string;
    
    // 🏆 Programas de fidelidad
    loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
    membershipNumber?: string;
    memberSince?: string;
    
    // 🔄 Integración
    externalIds?: Record<string, string | undefined>; // IDs en sistemas externos
    source?: 'manual' | 'import' | 'api' | 'integration';
}
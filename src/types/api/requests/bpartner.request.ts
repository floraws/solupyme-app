export interface CreateBPartnerRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  type: 'customer' | 'supplier' | 'both';
  status?: 'active' | 'inactive' | 'pending';
  notes?: string;
  tags?: string[];
  preferredContactMethod?: 'email' | 'phone' | 'in-person';
  
  // Información adicional
  legalName?: string;
  tradeName?: string;
  registrationNumber?: string;
  industry?: string;
  companySize?: 'micro' | 'small' | 'medium' | 'large' | 'enterprise';
  website?: string;
  
  // Direcciones
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
  
  // Contactos
  contactPersons?: Array<{
    name: string;
    email?: string;
    phone?: string;
    position?: string;
    notes?: string;
    preferredContactMethod?: 'email' | 'phone' | 'in-person';
  }>;
  
  // Información financiera
  creditLimit?: number;
  paymentTerms?: string;
  defaultCurrency?: string;
  priceList?: string;
  discountLevel?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  
  // Segmentación
  segment?: 'vip' | 'premium' | 'standard' | 'basic';
  customerLifecycleStage?: 'prospect' | 'lead' | 'customer' | 'advocate' | 'churned';
  leadSource?: string;
  
  // Información geográfica
  timezone?: string;
  territory?: string;
  region?: string;
  
  // Compliance
  gdprConsent?: boolean;
  dataProcessingConsent?: boolean;
  
  // Información corporativa adicional
  annualRevenue?: number;
  employeeCount?: number;
  foundedYear?: number;
  
  // Relaciones
  parentCompany?: string;
  referredBy?: string;
  accountManager?: string;
  salesRepresentative?: string;
  
  // Preferencias
  preferences?: {
    language?: string;
    communicationFrequency?: 'daily' | 'weekly' | 'monthly';
    marketingOptIn?: boolean;
  };
  
  // Logística
  deliveryInstructions?: string;
  preferredDeliveryTime?: string;
  
  // Programas de fidelidad
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  membershipNumber?: string;
  
  // Social media
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    other?: Record<string, string>;
  };
  
  // Metadata y campos personalizados
  customFields?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface UpdateBPartnerRequest extends Partial<CreateBPartnerRequest> {
  id: string;
}

export interface BPartnerSearchRequest {
  query?: string;
  type?: 'customer' | 'supplier' | 'both';
  status?: 'active' | 'inactive' | 'pending';
  segment?: 'vip' | 'premium' | 'standard' | 'basic';
  city?: string;
  country?: string;
  industry?: string;
  companySize?: 'micro' | 'small' | 'medium' | 'large' | 'enterprise';
  riskLevel?: 'low' | 'medium' | 'high';
  customerLifecycleStage?: 'prospect' | 'lead' | 'customer' | 'advocate' | 'churned';
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BPartnerStatsRequest {
  dateFrom?: string;
  dateTo?: string;
  type?: 'customer' | 'supplier' | 'both';
  segment?: 'vip' | 'premium' | 'standard' | 'basic';
}

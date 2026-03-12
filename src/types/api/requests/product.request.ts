export interface ProductCreateRequest {
  // 🆔 Identificación única (sku es requerido, los demás opcionales)
  sku: string;
  barcode?: string;
  productCode?: string;
  
  // 📝 Información básica (name es requerido)
  name: string;
  description?: string;
  shortDescription?: string;
  specifications?: string;
  
  // 🏷️ Categorización (category es requerido)
  category: string;
  subcategory?: string;
  brand?: string;
  manufacturer?: string;
  model?: string;
  
  // 💰 Información de precios (price es requerido)
  price: number;
  currency: string;
  costPrice?: number;
  wholesalePrice?: number;
  retailPrice?: number;
  discountPrice?: number;
  taxRate?: number;
  
  // 📦 Inventario y stock (stock es requerido)
  stock: number;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  stockLocation?: string;
  
  // 📏 Dimensiones y peso
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  
  // 🎯 Estado y disponibilidad (valores por defecto: active, true, public)
  status?: 'active' | 'inactive' | 'discontinued' | 'out-of-stock' | 'pre-order';
  available?: boolean;
  visibility?: 'public' | 'private' | 'hidden';
  
  // 🖼️ Multimedia
  images?: Array<{
    id: string;
    url: string;
    altText?: string;
    isPrimary?: boolean;
    order?: number;
  }>;
  
  // 🔗 Relaciones
  supplierId?: string;
  alternativeSuppliers?: string[];
  relatedProducts?: string[];
  bundleProducts?: Array<{
    productId: string;
    quantity: number;
  }>;
  
  // 🔄 Configuración de venta
  isTaxable?: boolean;
  allowBackorders?: boolean;
  trackInventory?: boolean;
  requiresShipping?: boolean;
  isDigital?: boolean;
  downloadable?: boolean;
  
  // ⚙️ Configuración avanzada
  warranty?: {
    duration: number;
    type: 'manufacturer' | 'store' | 'extended';
    terms?: string;
  };
  
  // 🏷️ Etiquetas y metadatos
  tags?: string[];
  keywords?: string[];
  customFields?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  
  // 📊 SEO y marketing
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  slug?: string;
  
  // 📋 Atributos variables
  variations?: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  
  // 🌍 Configuración multiregional
  region?: string;
  countryOfOrigin?: string;
  hsCode?: string;
  
  // 🚚 Información de envío
  shippingClass?: string;
  shippingWeight?: number;
  shippingDimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  // 🎫 Promociones y descuentos
  activePromotions?: Array<{
    id: string;
    name: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startDate: string;
    endDate: string;
  }>;
}

export interface ProductUpdateRequest {
  // Todos los campos son opcionales para actualización
  sku?: string;
  barcode?: string;
  productCode?: string;
  
  name?: string;
  description?: string;
  shortDescription?: string;
  specifications?: string;
  
  category?: string;
  subcategory?: string;
  brand?: string;
  manufacturer?: string;
  model?: string;
  
  price?: number;
  currency?: string;
  costPrice?: number;
  wholesalePrice?: number;
  retailPrice?: number;
  discountPrice?: number;
  taxRate?: number;
  
  stock?: number;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  stockLocation?: string;
  
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  
  status?: 'active' | 'inactive' | 'discontinued' | 'out-of-stock' | 'pre-order';
  available?: boolean;
  visibility?: 'public' | 'private' | 'hidden';
  
  images?: Array<{
    id: string;
    url: string;
    altText?: string;
    isPrimary?: boolean;
    order?: number;
  }>;
  
  supplierId?: string;
  alternativeSuppliers?: string[];
  relatedProducts?: string[];
  bundleProducts?: Array<{
    productId: string;
    quantity: number;
  }>;
  
  isTaxable?: boolean;
  allowBackorders?: boolean;
  trackInventory?: boolean;
  requiresShipping?: boolean;
  isDigital?: boolean;
  downloadable?: boolean;
  
  warranty?: {
    duration: number;
    type: 'manufacturer' | 'store' | 'extended';
    terms?: string;
  };
  
  tags?: string[];
  keywords?: string[];
  customFields?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  slug?: string;
  
  variations?: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  
  region?: string;
  countryOfOrigin?: string;
  hsCode?: string;
  
  shippingClass?: string;
  shippingWeight?: number;
  shippingDimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  activePromotions?: Array<{
    id: string;
    name: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startDate: string;
    endDate: string;
  }>;
}

export interface ProductFiltersRequest {
  // Búsqueda de texto
  search?: string;
  
  // Filtros de categorización
  category?: string;
  subcategory?: string;
  brand?: string;
  manufacturer?: string;
  
  // Filtros de precios
  minPrice?: number;
  maxPrice?: number;
  
  // Filtros de stock
  lowStock?: boolean;
  outOfStock?: boolean;
  
  // Filtros de estado
  status?: 'active' | 'inactive' | 'discontinued' | 'out-of-stock' | 'pre-order';
  available?: boolean;
  visibility?: 'public' | 'private' | 'hidden';
  
  // Filtros de proveedores
  supplierId?: string;
  
  // Filtros de fechas
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  
  // Filtros de características especiales
  hasImages?: boolean;
  hasVariations?: boolean;
  hasPromotions?: boolean;
  isDigital?: boolean;
  trackInventory?: boolean;
  
  // Filtros de región
  region?: string;
  countryOfOrigin?: string;
  
  // Filtros de etiquetas
  tags?: string[];
  
  // Ordenamiento
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt' | 'popularity' | 'salesCount';
  sortOrder?: 'asc' | 'desc';
  
  // Paginación
  page?: number;
  limit?: number;
}

export interface ProductStockUpdateRequest {
  stock: number;
  reason?: string;
  location?: string;
}

export interface ProductBulkUpdateRequest {
  productIds: string[];
  updates: Partial<ProductUpdateRequest>;
}

export interface ProductSearchRequest {
  query: string;
  filters?: Partial<ProductFiltersRequest>;
  includeInactive?: boolean;
}

export interface ProductStatsRequest {
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  includeInactive?: boolean;
  groupBy?: 'category' | 'brand' | 'manufacturer' | 'region';
}

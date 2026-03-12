export interface ProductResponse {
  // 🆔 Identificación única
  id: string;
  sku: string; // Código único del producto
  barcode?: string; // Código de barras
  productCode?: string; // Código interno de la empresa
  
  // 📝 Información básica
  name: string;
  description?: string;
  shortDescription?: string;
  specifications?: string; // Especificaciones técnicas detalladas
  
  // 🏷️ Categorización
  category: string; // Categoría principal
  subcategory?: string;
  brand?: string;
  manufacturer?: string;
  model?: string;
  
  // 💰 Información de precios
  price: number;
  currency: string;
  costPrice?: number; // Precio de costo
  wholesalePrice?: number; // Precio mayorista
  retailPrice?: number; // Precio minorista
  discountPrice?: number; // Precio con descuento
  taxRate?: number; // Tasa de impuesto (%)
  
  // 📦 Inventario y stock
  stock: number;
  minStock?: number; // Stock mínimo
  maxStock?: number; // Stock máximo
  reorderPoint?: number; // Punto de reorden
  stockLocation?: string; // Ubicación en almacén
  
  // 📏 Dimensiones y peso
  weight?: number; // En gramos
  dimensions?: {
    length?: number; // cm
    width?: number; // cm
    height?: number; // cm
  };
  
  // 🎯 Estado y disponibilidad
  status: 'active' | 'inactive' | 'discontinued' | 'out-of-stock' | 'pre-order';
  available: boolean;
  visibility: 'public' | 'private' | 'hidden'; // Visibilidad en catálogos
  
  // 🖼️ Multimedia
  images?: Array<{
    id: string;
    url: string;
    altText?: string;
    isPrimary?: boolean;
    order?: number;
  }>;
  
  // 🔗 Relaciones
  supplierId?: string; // Proveedor principal
  alternativeSuppliers?: string[]; // Proveedores alternativos
  relatedProducts?: string[]; // Productos relacionados
  bundleProducts?: Array<{ // Productos en conjunto
    productId: string;
    quantity: number;
  }>;
  
  // 🏪 Información de ventas
  salesCount?: number; // Número de ventas
  revenue?: number; // Ingresos generados
  averageRating?: number; // Calificación promedio
  reviewCount?: number; // Número de reseñas
  
  // 🔄 Configuración de venta
  isTaxable?: boolean;
  allowBackorders?: boolean; // Permitir pedidos pendientes
  trackInventory?: boolean; // Seguir inventario
  requiresShipping?: boolean; // Requiere envío
  isDigital?: boolean; // Producto digital
  downloadable?: boolean; // Descargable
  
  // ⚙️ Configuración avanzada
  warranty?: {
    duration: number; // En meses
    type: 'manufacturer' | 'store' | 'extended';
    terms?: string;
  };
  
  // 🏷️ Etiquetas y metadatos
  tags?: string[];
  keywords?: string[]; // Para búsqueda
  customFields?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  
  // 📊 SEO y marketing
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  slug?: string; // URL amigable
  
  // 📅 Fechas importantes
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  discontinuedAt?: string;
  lastSoldAt?: string;
  lastRestockedAt?: string;
  
  // 👤 Auditoría
  createdBy?: string;
  updatedBy?: string;
  
  // 🔄 Historial de precios
  priceHistory?: Array<{
    price: number;
    effectiveDate: string;
    reason?: string;
    changedBy?: string;
  }>;
  
  // 📋 Atributos variables (para productos con variaciones)
  variations?: Array<{
    id: string;
    name: string; // Ej: "Color", "Talla"
    values: string[]; // Ej: ["Rojo", "Azul"], ["S", "M", "L"]
  }>;
  
  // 🌍 Configuración multiregional
  region?: string;
  countryOfOrigin?: string;
  hsCode?: string; // Código arancelario
  
  // 🚚 Información de envío
  shippingClass?: string;
  shippingWeight?: number;
  shippingDimensions?: {
    length: number;
    width: number;
    height: number;
  };
  
  // 📈 Análisis y métricas
  popularity?: number; // Índice de popularidad
  profitMargin?: number; // Margen de ganancia
  turnoverRate?: number; // Rotación de inventario
  
  // 🎫 Promociones y descuentos
  activePromotions?: Array<{
    id: string;
    name: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startDate: string;
    endDate: string;
  }>;
  
  // ⚠️ Alertas y notificaciones
  alerts?: Array<{
    type: 'low-stock' | 'out-of-stock' | 'price-change' | 'discontinue';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    createdAt: string;
  }>;
}

// 📊 Interfaz para estadísticas de productos
export interface ProductStatsResponse {
  // 📋 Estadísticas generales
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  
  // 📦 Estadísticas de stock
  outOfStock: number;
  lowStock: number;
  totalValue: number; // Valor total del inventario
  totalRevenue: number; // Ingresos totales
  averagePrice: number; // Precio promedio
  
  // 🏷️ Top categorías y marcas
  topCategories: Array<{
    name: string;
    count: number;
  }>;
  topBrands: Array<{
    name: string;
    count: number;
  }>;
  
  // 📈 Actividad reciente
  recentActivity: {
    recentlyAdded: ProductResponse[];
    recentlyUpdated: ProductResponse[];
    recentlySold: ProductResponse[];
  };
  
  // 📊 Métricas de rendimiento (opcional)
  performance?: {
    bestSelling: ProductResponse[];
    mostProfitable: ProductResponse[];
    slowMoving: ProductResponse[];
  };
}
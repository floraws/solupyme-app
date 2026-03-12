"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  PageHeader, 
  SearchBar, 
  Button, 
  Table, 
  TableColumn, 
  StatsCard, 
  SelectField,
  EmptyState,
  LoadingState,
  Alert
} from "@/components/ui";
import { productService } from "@/services";
import { ProductResponse, ProductStatsResponse, ProductFiltersRequest } from "@/types/api";

// Delete action handler
const handleDeleteProduct = async (id: string, name: string) => {
  if (confirm(`¿Estás seguro de que deseas eliminar el producto "${name}"?`)) {
    try {
      const success = await productService.delete(id);
      if (success) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  }
};

const columns: TableColumn<ProductResponse>[] = [
  {
    key: 'image',
    label: 'Imagen',
    render: (product) => (
      <div className="flex-shrink-0 h-12 w-12">
        {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
          <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            <img 
              className="h-full w-full object-cover" 
              src={product.images.find((img: { isPrimary?: boolean; url: string; altText?: string }) => img.isPrimary)?.url || product.images[0]?.url} 
              alt={product.images.find((img: { isPrimary?: boolean; url: string; altText?: string }) => img.isPrimary)?.altText || product.name}
            />
          </div>
        ) : (
          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500">
              {product.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
        )}
      </div>
    )
  },
  {
    key: 'name',
    label: 'Producto',
    render: (product) => (
      <div className="flex flex-col">
        <Link 
          href={`/products/${product.id}`}
          className="font-medium text-gray-900 hover:text-blue-600 truncate"
        >
          {product.name || 'Sin nombre'}
        </Link>
        <span className="text-sm text-gray-500">{product.sku || 'Sin SKU'}</span>
        {product.brand && (
          <span className="text-xs text-gray-400">{product.brand}</span>
        )}
      </div>
    )
  },
  {
    key: 'category',
    label: 'Categoría',
    render: (product) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">{product.category || 'Sin categoría'}</span>
        {product.subcategory && (
          <span className="text-xs text-gray-500">{product.subcategory}</span>
        )}
      </div>
    )
  },
  {
    key: 'price',
    label: 'Precio',
    render: (product) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">
          {new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: product.currency || 'COP'
          }).format(product.price || 0)}
        </span>
        {product.discountPrice && product.discountPrice < (product.price || 0) && (
          <span className="text-xs text-green-600">
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: product.currency || 'COP'
            }).format(product.discountPrice)} (Oferta)
          </span>
        )}
      </div>
    )
  },
  {
    key: 'stock',
    label: 'Stock',
    render: (product) => {
      const stock = product.stock || 0;
      const reorderPoint = product.reorderPoint || 0;
      const isLowStock = stock <= reorderPoint;
      const isOutOfStock = stock === 0;
      
      return (
        <div className="flex flex-col">
          <span className={`font-medium ${
            isOutOfStock ? 'text-red-600' : 
            isLowStock ? 'text-yellow-600' : 'text-gray-900'
          }`}>
            {stock} unidades
          </span>
          {product.stockLocation && (
            <span className="text-xs text-gray-500">{product.stockLocation}</span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="text-xs text-yellow-600">Stock bajo</span>
          )}
          {isOutOfStock && (
            <span className="text-xs text-red-600">Sin stock</span>
          )}
        </div>
      );
    }
  },
  {
    key: 'status',
    label: 'Estado',
    render: (product) => {
      const statusConfig: Record<string, { color: string; label: string }> = {
        active: { color: 'bg-green-100 text-green-800', label: 'Activo' },
        inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactivo' },
        discontinued: { color: 'bg-red-100 text-red-800', label: 'Descontinuado' },
        'out-of-stock': { color: 'bg-red-100 text-red-800', label: 'Sin Stock' },
        'pre-order': { color: 'bg-blue-100 text-blue-800', label: 'Pre-orden' }
      };
      
      const status = product.status || 'inactive';
      const config = statusConfig[status] || statusConfig.inactive;
      
      return (
        <div className="flex flex-col">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
          {product.available === false && (
            <span className="text-xs text-gray-500 mt-1">No disponible</span>
          )}
        </div>
      );
    }
  },
  {
    key: 'actions',
    label: 'Acciones',
    render: (product) => (
      <div className="flex space-x-2">
        <Link
          href={`/products/${product.id}`}
          className="text-blue-600 hover:text-blue-900 text-sm"
        >
          Ver
        </Link>
        <Link
          href={`/products/${product.id}/edit`}
          className="text-green-600 hover:text-green-900 text-sm"
        >
          Editar
        </Link>
        <button
          onClick={() => handleDeleteProduct(product.id, product.name || 'producto')}
          className="text-red-600 hover:text-red-900 text-sm"
        >
          Eliminar
        </button>
      </div>
    )
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [stats, setStats] = useState<ProductStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);

  // Load data functions
  const loadProducts = useCallback(async () => {
    try {
      const filters: ProductFiltersRequest = {};
      
      if (searchQuery.trim()) filters.search = searchQuery.trim();
      if (selectedCategory) filters.category = selectedCategory;
      if (selectedBrand) filters.brand = selectedBrand;
      if (selectedStatus) filters.status = selectedStatus as ProductFiltersRequest['status'];
      if (showLowStock) filters.lowStock = true;

      const productsData = await productService.getAll(filters);
      setProducts(productsData);
      return productsData;
    } catch (err) {
      console.error('Error loading products:', err);
      throw new Error('Error al cargar productos');
    }
  }, [searchQuery, selectedCategory, selectedBrand, selectedStatus, showLowStock]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statsData = await productService.getStats();
      await loadProducts();
      
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload products when filters change
  useEffect(() => {
    if (!loading) {
      loadProducts().catch(err => {
        setError(err instanceof Error ? err.message : 'Error al cargar productos');
      });
    }
  }, [loadProducts, loading]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedStatus("");
    setShowLowStock(false);
  };

  // Get unique categories and brands for filters
  const allProducts = products;
  const categories = Array.from(new Set(allProducts.map(p => p.category))).filter(Boolean);
  const brands = Array.from(new Set(allProducts.map(p => p.brand))).filter(Boolean) as string[];

  if (loading) {
    return (
      <LoadingState loading={true} error={null}>
        <div />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Alert type="error" title="Error" message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <PageHeader
        title="Gestión de Productos"
        subtitle="Administra tu catálogo de productos"
        actions={
          <Link href="/products/create">
            <Button>
              + Nuevo Producto
            </Button>
          </Link>
        }
      />

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Productos"
            value={stats.totalProducts.toString()}
            icon="📦"
          />
          <StatsCard
            title="Productos Activos"
            value={stats.activeProducts.toString()}
            icon="✅"
          />
          <StatsCard
            title="Stock Bajo"
            value={stats.lowStock.toString()}
            icon="⚠️"
          />
          <StatsCard
            title="Valor Inventario"
            value={new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(stats.totalValue)}
            icon="💰"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar productos..."
            className="lg:col-span-2"
          />
          
          <SelectField
            label=""
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: "", label: "Todas las categorías" },
              ...categories.map(cat => ({ value: cat, label: cat }))
            ]}
          />
          
          <SelectField
            label=""
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            options={[
              { value: "", label: "Todas las marcas" },
              ...brands.map(brand => ({ value: brand, label: brand }))
            ]}
          />
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <SelectField
            label=""
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: "", label: "Todos los estados" },
              { value: "active", label: "Activo" },
              { value: "inactive", label: "Inactivo" },
              { value: "discontinued", label: "Descontinuado" },
              { value: "out-of-stock", label: "Sin Stock" },
              { value: "pre-order", label: "Pre-orden" }
            ]}
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="lowStock"
              checked={showLowStock}
              onChange={(e) => setShowLowStock(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="lowStock" className="ml-2 text-sm text-gray-700">
              Solo stock bajo
            </label>
          </div>
          
          <Button 
            variant="secondary" 
            onClick={clearFilters}
            className="ml-auto"
          >
            Limpiar filtros
          </Button>
        </div>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <EmptyState
          title="No hay productos"
          description="No se encontraron productos que coincidan con los filtros aplicados."
          action={
            <Link href="/products/create">
              <Button>
                + Crear primer producto
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
        </div>
      )}
    </div>
  );
}

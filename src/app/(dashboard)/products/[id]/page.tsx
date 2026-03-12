"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  PageHeader, 
  Button, 
  Card, 
  LoadingState, 
  Alert
} from "@/components/ui";
import { ProductService } from "@/services";
import { ProductResponse } from "@/types/api";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadProduct(params.id as string);
    }
  }, [params.id]);

  const loadProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const productData = await ProductService.getById(id);
      if (!productData) {
        setError("Producto no encontrado");
        return;
      }
      
      setProduct(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    
    if (confirm(`¿Estás seguro de que deseas eliminar el producto "${product.name}"?`)) {
      try {
        const success = await ProductService.delete(product.id);
        if (success) {
          router.push('/products');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  if (loading) {
    return (
      <LoadingState loading={true} error={null}>
        <div />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Alert type="error" title="Error" message={error} />
        <div className="mt-4">
          <Link href="/products">
            <Button variant="secondary">← Volver a productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Alert type="error" title="Error" message="Producto no encontrado" />
        <div className="mt-4">
          <Link href="/products">
            <Button variant="secondary">← Volver a productos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      active: { color: 'bg-green-100 text-green-800', label: 'Activo' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactivo' },
      discontinued: { color: 'bg-red-100 text-red-800', label: 'Descontinuado' },
      'out-of-stock': { color: 'bg-red-100 text-red-800', label: 'Sin Stock' },
      'pre-order': { color: 'bg-blue-100 text-blue-800', label: 'Pre-orden' }
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

  const statusConfig = getStatusConfig(product.status);
  const isLowStock = product.stock <= (product.reorderPoint || 0);
  const isOutOfStock = product.stock === 0;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <PageHeader
        title={product.name}
        subtitle={`SKU: ${product.sku}`}
        backButton={{
          href: "/products",
          label: "← Volver a productos"
        }}
        actions={
          <div className="flex space-x-3">
            <Link href={`/products/${product.id}/edit`}>
              <Button>Editar Producto</Button>
            </Link>
            <Button variant="danger" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          {product.images && product.images.length > 0 && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Imágenes del Producto</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image.url}
                          alt={image.altText || product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {image.isPrimary && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Principal
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Product Information */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Producto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <p className="text-gray-900">{product.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <p className="text-gray-900">{product.sku}</p>
                </div>

                {product.barcode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código de Barras
                    </label>
                    <p className="text-gray-900">{product.barcode}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <p className="text-gray-900">
                    {product.category}
                    {product.subcategory && ` > ${product.subcategory}`}
                  </p>
                </div>

                {product.brand && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marca
                    </label>
                    <p className="text-gray-900">{product.brand}</p>
                  </div>
                )}

                {product.manufacturer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fabricante
                    </label>
                    <p className="text-gray-900">{product.manufacturer}</p>
                  </div>
                )}
              </div>

              {product.description && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <p className="text-gray-900">{product.description}</p>
                </div>
              )}

              {product.specifications && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especificaciones
                  </label>
                  <pre className="text-gray-900 whitespace-pre-wrap text-sm">
                    {product.specifications}
                  </pre>
                </div>
              )}
            </div>
          </Card>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Availability */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estado</h3>
              <div className="space-y-4">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Disponible</span>
                  <span className={`text-sm font-medium ${product.available ? 'text-green-600' : 'text-red-600'}`}>
                    {product.available ? 'Sí' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Visibilidad</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {product.visibility}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Precios</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Precio</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: product.currency
                    }).format(product.price)}
                  </span>
                </div>
                
                {product.costPrice && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Precio de Costo</span>
                    <span className="text-sm text-gray-900">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: product.currency
                      }).format(product.costPrice)}
                    </span>
                  </div>
                )}
                
                {product.discountPrice && product.discountPrice < product.price && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Precio con Descuento</span>
                    <span className="text-sm text-green-600">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: product.currency
                      }).format(product.discountPrice)}
                    </span>
                  </div>
                )}
                
                {product.profitMargin && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Margen de Ganancia</span>
                    <span className="text-sm text-gray-900">
                      {product.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Inventory */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Inventario</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Stock Actual</span>
                  <span className={`text-sm font-medium ${
                    isOutOfStock ? 'text-red-600' : 
                    isLowStock ? 'text-yellow-600' : 'text-gray-900'
                  }`}>
                    {product.stock} unidades
                  </span>
                </div>
                
                {product.reorderPoint && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Punto de Reorden</span>
                    <span className="text-sm text-gray-900">
                      {product.reorderPoint} unidades
                    </span>
                  </div>
                )}
                
                {product.stockLocation && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Ubicación</span>
                    <span className="text-sm text-gray-900">
                      {product.stockLocation}
                    </span>
                  </div>
                )}
                
                {(isLowStock || isOutOfStock) && (
                  <div className="mt-4 p-3 rounded-md bg-yellow-50 border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      {isOutOfStock ? '⚠️ Producto sin stock' : '📦 Stock bajo'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Sales Info */}
          {(product.salesCount || product.revenue || product.averageRating) && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Ventas</h3>
                <div className="space-y-3">
                  {product.salesCount && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Ventas</span>
                      <span className="text-sm text-gray-900">
                        {product.salesCount} unidades
                      </span>
                    </div>
                  )}
                  
                  {product.revenue && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Ingresos</span>
                      <span className="text-sm text-gray-900">
                        {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: product.currency
                        }).format(product.revenue)}
                      </span>
                    </div>
                  )}
                  
                  {product.averageRating && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Calificación</span>
                      <span className="text-sm text-gray-900">
                        ⭐ {product.averageRating.toFixed(1)}
                        {product.reviewCount && ` (${product.reviewCount} reseñas)`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

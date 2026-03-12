"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  PageHeader, 
  Button, 
  Card, 
  InputField,
  SelectField,
  LoadingState, 
  Alert
} from "@/components/ui";
import { ProductService } from "@/services";
import { ProductResponse, ProductUpdateRequest } from "@/types/api";

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<ProductUpdateRequest>({});

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
      setFormData({
        name: productData.name,
        sku: productData.sku,
        barcode: productData.barcode,
        productCode: productData.productCode,
        description: productData.description,
        shortDescription: productData.shortDescription,
        specifications: productData.specifications,
        category: productData.category,
        subcategory: productData.subcategory,
        brand: productData.brand,
        manufacturer: productData.manufacturer,
        model: productData.model,
        price: productData.price,
        currency: productData.currency,
        costPrice: productData.costPrice,
        wholesalePrice: productData.wholesalePrice,
        retailPrice: productData.retailPrice,
        discountPrice: productData.discountPrice,
        taxRate: productData.taxRate,
        stock: productData.stock,
        minStock: productData.minStock,
        maxStock: productData.maxStock,
        reorderPoint: productData.reorderPoint,
        stockLocation: productData.stockLocation,
        weight: productData.weight,
        status: productData.status,
        available: productData.available,
        visibility: productData.visibility,
        isTaxable: productData.isTaxable,
        allowBackorders: productData.allowBackorders,
        trackInventory: productData.trackInventory,
        requiresShipping: productData.requiresShipping,
        isDigital: productData.isDigital,
        downloadable: productData.downloadable,
        region: productData.region,
        countryOfOrigin: productData.countryOfOrigin,
        hsCode: productData.hsCode,
        shippingClass: productData.shippingClass,
        shippingWeight: productData.shippingWeight
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    try {
      setSaving(true);
      setError(null);

      const updatedProduct = await ProductService.update(product.id, formData);
      
      if (updatedProduct) {
        router.push(`/products/${product.id}`);
      } else {
        setError("Error al actualizar el producto");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProductUpdateRequest, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={`Editar Producto: ${product.name}`}
        subtitle={`SKU: ${product.sku}`}
        backButton={{
          href: `/products/${product.id}`,
          label: "← Volver al producto"
        }}
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Nombre del Producto *"
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                
                <InputField
                  label="SKU *"
                  type="text"
                  value={formData.sku || ''}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  required
                />
                
                <InputField
                  label="Código de Barras"
                  type="text"
                  value={formData.barcode || ''}
                  onChange={(e) => handleInputChange('barcode', e.target.value)}
                />
                
                <InputField
                  label="Código del Producto"
                  type="text"
                  value={formData.productCode || ''}
                  onChange={(e) => handleInputChange('productCode', e.target.value)}
                />
              </div>

              <div className="mt-6">
                <InputField
                  label="Descripción Corta"
                  type="text"
                  value={formData.shortDescription || ''}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especificaciones
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows={6}
                  value={formData.specifications || ''}
                  onChange={(e) => handleInputChange('specifications', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Categorization */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Categorización</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Categoría *"
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  required
                />
                
                <InputField
                  label="Subcategoría"
                  type="text"
                  value={formData.subcategory || ''}
                  onChange={(e) => handleInputChange('subcategory', e.target.value)}
                />
                
                <InputField
                  label="Marca"
                  type="text"
                  value={formData.brand || ''}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                />
                
                <InputField
                  label="Fabricante"
                  type="text"
                  value={formData.manufacturer || ''}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                />
                
                <InputField
                  label="Modelo"
                  type="text"
                  value={formData.model || ''}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Precios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Precio de Venta *"
                  type="number"
                  step="0.01"
                  value={formData.price || 0}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  required
                />
                
                <SelectField
                  label="Moneda *"
                  value={formData.currency || 'COP'}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  options={[
                    { value: 'COP', label: 'Peso Colombiano (COP)' },
                    { value: 'USD', label: 'Dólar Americano (USD)' },
                    { value: 'EUR', label: 'Euro (EUR)' }
                  ]}
                  required
                />
                
                <InputField
                  label="Precio de Costo"
                  type="number"
                  step="0.01"
                  value={formData.costPrice || 0}
                  onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || 0)}
                />
                
                <InputField
                  label="Precio Mayorista"
                  type="number"
                  step="0.01"
                  value={formData.wholesalePrice || 0}
                  onChange={(e) => handleInputChange('wholesalePrice', parseFloat(e.target.value) || 0)}
                />
                
                <InputField
                  label="Precio con Descuento"
                  type="number"
                  step="0.01"
                  value={formData.discountPrice || 0}
                  onChange={(e) => handleInputChange('discountPrice', parseFloat(e.target.value) || 0)}
                />
                
                <InputField
                  label="Tasa de Impuesto (%)"
                  type="number"
                  step="0.01"
                  value={formData.taxRate || 0}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </Card>

          {/* Inventory */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Inventario</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Stock Actual *"
                  type="number"
                  value={formData.stock || 0}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                  required
                />
                
                <InputField
                  label="Stock Mínimo"
                  type="number"
                  value={formData.minStock || 0}
                  onChange={(e) => handleInputChange('minStock', parseInt(e.target.value) || 0)}
                />
                
                <InputField
                  label="Stock Máximo"
                  type="number"
                  value={formData.maxStock || 0}
                  onChange={(e) => handleInputChange('maxStock', parseInt(e.target.value) || 0)}
                />
                
                <InputField
                  label="Punto de Reorden"
                  type="number"
                  value={formData.reorderPoint || 0}
                  onChange={(e) => handleInputChange('reorderPoint', parseInt(e.target.value) || 0)}
                />
                
                <InputField
                  label="Ubicación en Almacén"
                  type="text"
                  value={formData.stockLocation || ''}
                  onChange={(e) => handleInputChange('stockLocation', e.target.value)}
                />
                
                <InputField
                  label="Peso (gramos)"
                  type="number"
                  value={formData.weight || 0}
                  onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </Card>

          {/* Status & Configuration */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Estado y Configuración</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Estado *"
                  value={formData.status || 'active'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  options={[
                    { value: 'active', label: 'Activo' },
                    { value: 'inactive', label: 'Inactivo' },
                    { value: 'discontinued', label: 'Descontinuado' },
                    { value: 'out-of-stock', label: 'Sin Stock' },
                    { value: 'pre-order', label: 'Pre-orden' }
                  ]}
                  required
                />
                
                <SelectField
                  label="Visibilidad *"
                  value={formData.visibility || 'public'}
                  onChange={(e) => handleInputChange('visibility', e.target.value)}
                  options={[
                    { value: 'public', label: 'Público' },
                    { value: 'private', label: 'Privado' },
                    { value: 'hidden', label: 'Oculto' }
                  ]}
                  required
                />
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available || false}
                    onChange={(e) => handleInputChange('available', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="available" className="ml-2 text-sm text-gray-700">
                    Disponible para la venta
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isTaxable"
                    checked={formData.isTaxable || false}
                    onChange={(e) => handleInputChange('isTaxable', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isTaxable" className="ml-2 text-sm text-gray-700">
                    Sujeto a impuestos
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="trackInventory"
                    checked={formData.trackInventory !== false}
                    onChange={(e) => handleInputChange('trackInventory', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="trackInventory" className="ml-2 text-sm text-gray-700">
                    Seguir inventario
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requiresShipping"
                    checked={formData.requiresShipping !== false}
                    onChange={(e) => handleInputChange('requiresShipping', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requiresShipping" className="ml-2 text-sm text-gray-700">
                    Requiere envío
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDigital"
                    checked={formData.isDigital || false}
                    onChange={(e) => handleInputChange('isDigital', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDigital" className="ml-2 text-sm text-gray-700">
                    Producto digital
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <div className="p-6">
              <div className="flex justify-end space-x-4">
                <Link href={`/products/${product.id}`}>
                  <Button variant="secondary" type="button">
                    Cancelar
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className={saving ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </div>
          </Card>
        </form>
    </div>
  );
}

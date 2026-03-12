"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  PageHeader, 
  Button, 
  Card, 
  InputField,
  SelectField,
  Alert
} from "@/components/ui";
import { ProductService } from "@/services";
import { ProductCreateRequest } from "@/types/api";

export default function ProductCreatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<ProductCreateRequest>({
    name: '',
    sku: '',
    category: '',
    price: 0,
    currency: 'COP',
    stock: 0,
    status: 'active',
    visibility: 'public',
    available: true,
    isTaxable: true,
    trackInventory: true,
    requiresShipping: true,
    isDigital: false,
    taxRate: 19
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name?.trim()) {
      setError("El nombre del producto es requerido");
      return;
    }
    
    if (!formData.sku?.trim()) {
      setError("El SKU es requerido");
      return;
    }
    
    if (!formData.category?.trim()) {
      setError("La categoría es requerida");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const newProduct = await ProductService.create(formData);
      
      if (newProduct) {
        router.push(`/products/${newProduct.id}`);
      } else {
        setError("Error al crear el producto");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProductCreateRequest, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Crear Nuevo Producto"
        subtitle="Completa la información del producto"
        backButton={{
          href: "/products",
          label: "← Volver a productos"
        }}
      />

      {error && (
        <div className="mb-6">
          <Alert type="error" title="Error" message={error} />
        </div>
      )}

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
                placeholder="Ej: PROD-001"
              />
              
              <InputField
                label="Código de Barras"
                type="text"
                value={formData.barcode || ''}
                onChange={(e) => handleInputChange('barcode', e.target.value)}
                placeholder="Ej: 1234567890123"
              />
              
              <InputField
                label="Código del Producto"
                type="text"
                value={formData.productCode || ''}
                onChange={(e) => handleInputChange('productCode', e.target.value)}
                placeholder="Código interno"
              />
            </div>

            <div className="mt-6">
              <InputField
                label="Descripción Corta"
                type="text"
                value={formData.shortDescription || ''}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Descripción breve del producto"
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
                placeholder="Descripción detallada del producto"
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
                placeholder="Ej: Electrónicos"
              />
              
              <InputField
                label="Subcategoría"
                type="text"
                value={formData.subcategory || ''}
                onChange={(e) => handleInputChange('subcategory', e.target.value)}
                placeholder="Ej: Smartphones"
              />
              
              <InputField
                label="Marca"
                type="text"
                value={formData.brand || ''}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="Ej: Samsung"
              />
              
              <InputField
                label="Modelo"
                type="text"
                value={formData.model || ''}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="Ej: Galaxy S21"
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
                min="0"
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
                min="0"
                value={formData.costPrice || 0}
                onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || 0)}
              />
              
              <InputField
                label="Tasa de Impuesto (%)"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.taxRate || 19}
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
                label="Stock Inicial *"
                type="number"
                min="0"
                value={formData.stock || 0}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                required
              />
              
              <InputField
                label="Stock Mínimo"
                type="number"
                min="0"
                value={formData.minStock || 0}
                onChange={(e) => handleInputChange('minStock', parseInt(e.target.value) || 0)}
              />
              
              <InputField
                label="Punto de Reorden"
                type="number"
                min="0"
                value={formData.reorderPoint || 0}
                onChange={(e) => handleInputChange('reorderPoint', parseInt(e.target.value) || 0)}
              />
              
              <InputField
                label="Peso (gramos)"
                type="number"
                min="0"
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
                  checked={formData.available !== false}
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
                  checked={formData.isTaxable !== false}
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
              <Link href="/products">
                <Button variant="secondary" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={saving}
                className={saving ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {saving ? 'Creando...' : 'Crear Producto'}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}

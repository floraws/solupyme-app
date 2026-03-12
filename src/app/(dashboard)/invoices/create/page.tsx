"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  PageHeader,
  Button,
  InputField,
  Alert,
  LoadingSpinner,
  SelectField,
  SearchableSelect,
} from "@/components/ui";
import type { SearchableOption } from "@/components/ui";
import { BPartnerInvoiceOption } from "@/types/api";
// import { invoicesService } from "@/services/invoices.service";

// Esquema de validación
const createInvoiceSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Nombre del cliente es requerido"),
    email: z.string().email("Email válido requerido"),
    phone: z.string().min(1, "Teléfono es requerido")
  }),
  date: z.string().min(1, "Fecha es requerida"),
  dueDate: z.string().min(1, "Fecha de vencimiento es requerida"),
  currency: z.string().min(1, "Moneda es requerida"),
  taxRate: z.number().min(0).max(1),
  discount: z.number().min(0),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1, "Descripción es requerida"),
    quantity: z.number().min(1, "Cantidad debe ser mayor a 0"),
    unitPrice: z.number().min(0, "Precio unitario debe ser mayor o igual a 0")
  })).min(1, "Debe agregar al menos un item")
});

type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;

const CreateInvoicePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [bpartners, setBPartners] = useState<SearchableOption[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CreateInvoiceFormData>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      customer: {
        name: "",
        email: "",
        phone: ""
      },
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días
      currency: "COP",
      taxRate: 0,
      discount: 0,
      paymentTerms: "Pago a 30 días calendario",
      notes: "",
      items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  useEffect(() => {

    const fetchBPartners = async () => {
      try {
        // Simular llamada al servicio de business partners
        // const bpartnersData = await invoicesService.getBPartners();
        // Simulación de datos para SearchableSelect
        const bpartnersData: BPartnerInvoiceOption[] = [
          {
            label: "Empresa ABC S.A.S",
            value: "bp_001",
            description: "NIT: 900123456-1 - Servicios de Consultoría",
            category: "Empresas",
            email: "hola@gmail.com",
          },
          {
            label: "Corporación XYZ Ltda",
            value: "bp_002",
            description: "NIT: 900654321-2 - Distribución y Comercialización",
            category: "Empresas",
            email: "hola1@gmail.com",
          },
          {
            label: "Juan Carlos Rodríguez",
            value: "bp_003",
            description: "CC: 1234567890 - Consultor Independiente",
            category: "Personas Naturales",
            email: "hola2@gmail.com",
          },
          {
            label: "Distribuidora El Sol S.A.",
            value: "bp_004",
            description: "NIT: 900987654-3 - Productos de Consumo",
            category: "Empresas",
            email: "hola3@gmail.com",
          },
          {
            label: "María González Consultores",
            value: "bp_005",
            description: "CC: 0987654321 - Servicios Profesionales",
            category: "Personas Naturales",
            email: "hola4@gmail.com",

          },
          {
            label: "Tecnología Avanzada SAS",
            value: "bp_006",
            description: "NIT: 900111222-4 - Desarrollo de Software",
            category: "Empresas",
            email: "hola5@gmail.com",

          },
          {
            label: "Constructora Los Andes",
            value: "bp_007",
            description: "NIT: 900333444-5 - Construcción e Ingeniería",
            category: "Empresas",
            email: "hola6@gmail.com",

          },
          {
            label: "Ana Patricia Morales",
            value: "bp_008",
            description: "CC: 1122334455 - Diseño Gráfico y Publicitario",
            category: "Personas Naturales"
          },
          {
            label: "Comercializadora del Norte",
            value: "bp_009",
            description: "NIT: 900555666-7 - Venta al por Mayor",
            category: "Empresas"
          },
          {
            label: "Luis Fernando Vargas",
            value: "bp_010",
            description: "CC: 9988776655 - Servicios Contables",
            category: "Personas Naturales"
          }
        ];
        setBPartners(bpartnersData);
      } catch (error) {
        console.error("Error fetching business partners:", error);
        setError("Error al cargar los clientes. Inténtalo de nuevo.");
      }
    };
    fetchBPartners();
  }, [])

  const watchedItems = watch("items");
  const watchedTaxRate = watch("taxRate");
  const watchedDiscount = watch("discount");

  // Calcular totales
  const subtotal = watchedItems.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);

  const taxAmount = subtotal * watchedTaxRate;
  const total = subtotal + taxAmount - watchedDiscount;

  const onSubmit = async (data: CreateInvoiceFormData) => {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      // Generar ID y número de factura
      const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      // Preparar datos de la factura
      const invoiceData = {
        id: invoiceId,
        number: invoiceNumber,
        date: new Date(data.date).toISOString(),
        dueDate: new Date(data.dueDate).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "draft",
        paymentStatus: "pending",
        customer: {
          id: `customer_${Date.now()}`,
          ...data.customer
        },
        items: data.items.map((item, index) => ({
          id: `item_${index + 1}`,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice
        })),
        currency: data.currency,
        exchangeRate: 1.0,
        subtotal,
        taxRate: data.taxRate,
        taxAmount,
        discount: data.discount,
        total,
        paymentTerms: data.paymentTerms,
        notes: data.notes
      };

      // TODO: Implementar create en el servicio
      // await invoicesService.create(invoiceData);

      console.log("Nueva factura:", invoiceData);
      setMessage("Factura creada exitosamente");

      setTimeout(() => {
        router.push("/invoices");
      }, 1500);

    } catch (error) {
      console.error("Error creating invoice:", error);
      setError("Error al crear la factura. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    append({
      description: "",
      quantity: 1,
      unitPrice: 0
    });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const currencyOptions = [
    { value: "COP", label: "Peso Colombiano (COP)" },
    { value: "USD", label: "Dólar Americano (USD)" },
    { value: "EUR", label: "Euro (EUR)" }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="md" />
            <span className="text-gray-600">Creando factura...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Nueva Factura"
        subtitle="Crea una nueva factura para tus clientes"
        backButton={{
          href: "/invoices",
          label: "Volver a Facturas"
        }}
      />

      {error && (
        <Alert type="error" message={error} className="mb-6" />
      )}

      {message && (
        <Alert type="success" message={message} className="mb-6" />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Información del Cliente */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información del Cliente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <SearchableSelect
              label="Seleccionar Cliente"
              options={bpartners}
              value={selectedCustomer}
              onChange={(value) => {
                setSelectedCustomer(value);
                const selected = bpartners.find(bp => bp.value === value) as BPartnerInvoiceOption;
                if (selected) {
                  // Actualizar el nombre del cliente en el formulario
                  setValue("customer.name", selected.label);

                  // Actualizar los campos del formulario
                  setValue("customer.email", selected.email || "");
                  setValue("customer.phone", selected.phone || "");
                }
              }}
              placeholder="Buscar y seleccionar un cliente..."
              searchPlaceholder="Buscar cliente por nombre, NIT o descripción..."
              emptyMessage="No se encontraron clientes"
              showCategories={true}
              clearable={true}
              error={errors.customer?.name?.message}
              required
            />
          </div>
          <InputField
            label="Email"
            type="email"
            {...register("customer.email")}
            error={errors.customer?.email?.message}
            disabled={true} 
          />
          <InputField
            label="Teléfono"
            {...register("customer.phone")}
            error={errors.customer?.phone?.message}
            disabled={true} 
          />
        </div>

        {/* Información de la Factura */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Detalles de la Factura
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Fecha de Factura"
            type="date"
            {...register("date")}
            error={errors.date?.message}
          />
          <InputField
            label="Fecha de Vencimiento"
            type="date"
            {...register("dueDate")}
            error={errors.dueDate?.message}
          />
          <SelectField
            label="Moneda"
            {...register("currency")}
            options={currencyOptions}
            error={errors.currency?.message}
          />
          <InputField
            label="Tasa de Impuesto (%)"
            type="number"
            step="0.01"
            min="0"
            max="1"
            {...register("taxRate", { valueAsNumber: true })}
            error={errors.taxRate?.message}
            placeholder="0.19"
          />
        </div>

        {/* Items de la Factura */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Items de la Factura
          </h3>
          <Button
            type="button"
            variant="secondary"
            onClick={addItem}
          >
            Agregar Item
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="md:col-span-5">
                <InputField
                  label="Descripción"
                  {...register(`items.${index}.description`)}
                  error={errors.items?.[index]?.description?.message}
                  placeholder="Descripción del producto/servicio"
                />
              </div>
              <div className="md:col-span-2">
                <InputField
                  label="Cantidad"
                  type="number"
                  min="1"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.quantity?.message}
                />
              </div>
              <div className="md:col-span-3">
                <InputField
                  label="Precio Unitario"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.unitPrice?.message}
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={fields.length === 1}
                >
                  ✕
                </Button>
              </div>
              <div className="md:col-span-1 flex items-center">
                <span className="text-sm font-medium text-gray-700">
                  {formatCurrency(watchedItems[index]?.quantity * watchedItems[index]?.unitPrice || 0)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen de Totales */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos:</span>
                <span className="font-medium">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Descuento:</span>
                <span className="font-medium">-{formatCurrency(watchedDiscount)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-semibold">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <InputField
            label="Descuento"
            type="number"
            min="0"
            step="0.01"
            {...register("discount", { valueAsNumber: true })}
            error={errors.discount?.message}
            placeholder="0"
          />
        </div>

        {/* Términos y Notas */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Términos y Condiciones
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Términos de Pago
            </label>
            <textarea
              {...register("paymentTerms")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Términos y condiciones de pago"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas Adicionales
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notas adicionales para el cliente"
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/invoices")}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            Crear Factura
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoicePage;

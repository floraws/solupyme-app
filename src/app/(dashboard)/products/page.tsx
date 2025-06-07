"use client";

import { PageHeader, Table, TableColumn } from "@/components/ui";

interface Product {
  code: string;
  description: string;
}

const products: Product[] = [
  { code: "P001", description: "Producto A" },
  { code: "P002", description: "Producto B" },
  { code: "P003", description: "Producto C" },
];

const columns: TableColumn<Product>[] = [
  {
    key: 'code',
    label: 'Código',
    render: (product) => product.code
  },
  {
    key: 'description',
    label: 'Descripción',
    render: (product) => product.description
  }
];

export default function ProductPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Lista de Productos"
        subtitle="Gestiona el catálogo de productos"
      />
        <Table
        data={products}
        columns={columns}
      />
    </div>
  );
}

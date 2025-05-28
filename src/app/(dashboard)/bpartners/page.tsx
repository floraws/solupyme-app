"use client";

import { useAuth } from "@/hooks/useAuth";

const products = [
  { code: "P001", description: "Producto A" },
  { code: "P002", description: "Producto B" },
  { code: "P003", description: "Producto C" },
];

export default function BPartnersPage() {
  useAuth();
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Lista de Productos</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Código</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.code} className="border-b last:border-b-0">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

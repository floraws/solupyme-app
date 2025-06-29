"use client";

import {
  BuildingOfficeIcon,
  ArchiveBoxIcon
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui";
import Link from "next/link";

const settings = [
  {
    id: "P001",
    name: "Pedidos",
    link: "/orders",
    description: "Configuración de países",
    icon: BuildingOfficeIcon
  },
  {
    id: "P002",
    name: "Facturas",	
    link: "/invoices",
    description: "Configuración de departamentos",
    icon: ArchiveBoxIcon
  },
];

export default function DocumentPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((setting) => {
          const IconComponent = setting.icon;
          return (
            <Card key={setting.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <IconComponent className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">{setting.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{setting.description}</p>
              <Link
                href={setting.link}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                Ir a {setting.name}
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

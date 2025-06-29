"use client";
import {
  BuildingOfficeIcon,
  ArchiveBoxIcon,
  UsersIcon,
  ShieldCheckIcon,
  CogIcon,
  LinkIcon,
  BellIcon,
  LockClosedIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const settings = [
  {
    id: "P001",
    name: "Crear Paises",
    link: "/integrations/create-countries",
    description: "Configuración de la empresa",
    icon: BuildingOfficeIcon
  },
  {
    id: "P002",
    name: "Departamentos Colombia",
    link: "/integrations/create-states-colombia",
    description: "Configuración de catálogos",
    icon: ArchiveBoxIcon
  },
  {
    id: "P003",
    name: "Ciudades Colombia",
    link: "/integrations/create-cities-colombia",
    description: "Gestión de usuarios y permisos",
    icon: UsersIcon
  }
];

export default function IntegrationsPage() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((setting) => {
          const IconComponent = setting.icon;
          return (
            <div key={setting.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <IconComponent className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">{setting.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{setting.description}</p>
              <a
                href={setting.link}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                Ir a {setting.name}
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
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
} from "@heroicons/react/24/outline";

const settings = [
  {
    id: "P001",
    name: "Paises",
    link: "/countries",
    description: "Configuración de países",
    icon: BuildingOfficeIcon
  },
  {
    id: "P002",
    name: "Departamentos",	
    link: "/states",
    description: "Configuración de departamentos",
    icon: ArchiveBoxIcon
  },
  {
    id: "P003",
    name: "Municipios",
    link: "/cities",
    description: "Configuración de municipios",
    icon: UsersIcon
  },
  {
    id: "P004",
    name: "Unidades de medida",
    link: "/units",
    description: "Configuración de unidades de medida",
    icon: ShieldCheckIcon
  },
  {
    id: "P005",
    name: "Configuración",
    link: "/configurations",
    description: "Ajustes generales del sistema",
    icon: CogIcon
  },
  {
    id: "P006",
    name: "Integraciones",
    link: "/integrations",
    description: "Conexiones con servicios externos",
    icon: LinkIcon
  },
  {
    id: "P007",
    name: "Notificaciones",
    link: "/notifications",
    description: "Configuración de notificaciones",
    icon: BellIcon
  },
  {
    id: "P008",
    name: "Seguridad",
    link: "/security",
    description: "Ajustes de seguridad y privacidad",
    icon: LockClosedIcon
  },
];

export default function SettingsPage() {
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
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
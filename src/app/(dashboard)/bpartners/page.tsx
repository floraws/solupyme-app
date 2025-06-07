"use client";

import { useAuth } from "@/hooks/useAuth";
import { PageHeader, Table, TableColumn } from "@/components/ui";

interface BPartner {
  code: string;
  description: string;
}

const bpartners: BPartner[] = [
  { code: "BP001", description: "Socio de Negocio A" },
  { code: "BP002", description: "Socio de Negocio B" },
  { code: "BP003", description: "Socio de Negocio C" },
];

const columns: TableColumn<BPartner>[] = [
  {
    key: 'code',
    label: 'Código',
    render: (bpartner) => bpartner.code
  },
  {
    key: 'description',
    label: 'Descripción',
    render: (bpartner) => bpartner.description
  }
];

export default function BPartnersPage() {
  useAuth();
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Socios de Negocio"
        subtitle="Gestiona la información de socios comerciales"
      />
        <Table
        data={bpartners}
        columns={columns}
      />
    </div>
  );
}

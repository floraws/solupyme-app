const ORGANIZATION_TYPE_DISPLAY_NAMES: Record<string, string> = {
  NATURAL_PERSON: "Persona Natural",
  LEGAL_ENTITY: "Persona Jurídica",
  LIMITED_COMPANY: "Sociedad Limitada",
  CORPORATION: "Sociedad Anónima",
  PARTNERSHIP: "Sociedad en Comandita",
  SIMPLIFIED_CORPORATION: "Sociedad por Acciones Simplificada",
  COOPERATIVE: "Cooperativa",
  FOUNDATION: "Fundación",
  ASSOCIATION: "Asociación",
  SOLE_PROPRIETORSHIP: "Empresa Unipersonal",
  JOINT_VENTURE: "Empresa en Participación",
  FOREIGN_COMPANY: "Empresa Extranjera",
  GOVERNMENT_ENTITY: "Entidad Gubernamental",
  MUNICIPAL_ENTITY: "Entidad Municipal",
  EDUCATIONAL_INSTITUTION: "Institución Educativa",
  HEALTHCARE_INSTITUTION: "Institución de Salud",
  NON_PROFIT: "Organización sin Ánimo de Lucro",
  TRUST: "Fideicomiso",
  OTHER: "Otro",
};

export function getOrganizationTypeDisplayName(type: string): string | undefined {
  return ORGANIZATION_TYPE_DISPLAY_NAMES[type];
}

const IDENTIFIER_TYPE_DISPLAY_NAMES: Record<string, string> = {
  CC: "Cédula de Ciudadanía",
  CE: "Cédula de Extranjería",
  TI: "Tarjeta de Identidad",
  RC: "Registro Civil",
  PA: "Pasaporte",
  DNI: "Documento Nacional de Identidad",
  CURP: "CURP",
  RUT: "RUT",
  RUN: "RUN",
  NIT: "NIT",
  RUC: "RUC",
  RFC: "RFC",
  CUIT: "CUIT",
  CNPJ: "CNPJ",
  RIF: "RIF",
  PEP: "Permiso Especial de Permanencia",
  DI: "Documento Internacional",
  SC: "Salvoconducto",
  DE: "Documento Extranjero",
  NUIP: "NUIP",
  OTHER: "Otro",
};

export function getIdentifierTypeDisplayName(type: string): string | undefined {
  return IDENTIFIER_TYPE_DISPLAY_NAMES[type];
}
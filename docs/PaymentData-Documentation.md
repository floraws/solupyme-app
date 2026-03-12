# Datos de Ejemplo - Pagos (payments.json)

## Descripción

Este archivo contiene 8 registros de ejemplo que representan diferentes tipos de pagos que puede manejar el sistema, siguiendo la estructura definida en `PaymentResponse`.

## Contenido del Archivo

### 📊 **Resumen de Registros**

| ID | Método de Pago | Monto | Estado | Cliente | Descripción |
|---|---|---|---|---|---|
| pay_2025_001 | Transferencia Bancaria | $1,500,000 | Completado | Empresa ABC S.A.S | Pago múltiples facturas |
| pay_2025_002 | PSE | $250,000 | Completado | Juan Carlos Rodríguez | Consultoría independiente |
| pay_2025_003 | Nequi | $150,000 | Completado | María González | Servicios de diseño |
| pay_2025_004 | Efectivo | $500,000 | Completado | Constructora Los Andes | Consultoría técnica |
| pay_2025_005 | Tarjeta Crédito | $300,000 | **Fallido** | Ana Patricia Morales | Fondos insuficientes |
| pay_2025_006 | DaviPlata | $180,000 | Completado | Comercializadora del Norte | Productos inventario |
| pay_2025_007 | Cheque | $850,000 | Completado | Luis Fernando Vargas | Servicios contables |
| pay_2025_008 | Transferencia Int. | $2,500,000 | **Pendiente** | Corporación XYZ | Consultoría internacional |

### 🎯 **Tipos de Pago Representados**

#### **Pagos Digitales Modernos**
- **PSE (Pagos Seguros en Línea)**: Integración con sistema bancario colombiano
- **Nequi**: Billetera digital popular en Colombia
- **DaviPlata**: Plataforma de pagos del Banco Davivienda

#### **Métodos Tradicionales**
- **Transferencia Bancaria**: Pago corporativo con múltiples facturas
- **Efectivo**: Pago presencial en oficinas
- **Cheque**: Con documentos adjuntos y proceso de compensación

#### **Pagos Internacionales**
- **Transferencia SWIFT**: Pago internacional pendiente

#### **Casos de Error**
- **Tarjeta de Crédito Rechazada**: Fondos insuficientes con metadata detallada

### 💡 **Características Destacadas**

#### **1. Información Detallada del Procesador**
```json
"processor": {
  "name": "Bancolombia",
  "transactionId": "BCO-2025-987654321",
  "authCode": "AUTH-ABC123",
  "fees": 5000,
  "responseCode": "00",
  "responseMessage": "Transacción exitosa"
}
```

#### **2. Relaciones con Facturas**
- Pagos que cubren múltiples facturas
- Seguimiento de montos pagados vs. monto total
- Estados de facturas actualizados automáticamente

#### **3. Archivos Adjuntos**
- Comprobantes bancarios
- Recibos de efectivo
- Cheques escaneados
- Comprobantes de consignación

#### **4. Metadatos Contextuales**
```json
"metadata": {
  "banco": "Banco Davivienda",
  "tipoTransaccion": "PSE",
  "canalPago": "web"
}
```

#### **5. Campos Personalizados**
```json
"customFields": {
  "departamento": "Ventas",
  "proyecto": "Consultoría Q2 2025",
  "aprobadoPor": "gerente_ventas"
}
```

### 🏷️ **Sistema de Etiquetas**

Las etiquetas permiten categorización y búsqueda:
- **Por tipo de servicio**: `consultoría`, `diseño`, `contabilidad`
- **Por método**: `pse`, `nequi`, `efectivo`, `cheque`
- **Por período**: `junio-2025`, `mensual`
- **Por estado**: `fallido`, `pendiente`

### 📈 **Estados de Pago**

- **completed** (6 registros): Pagos exitosos
- **failed** (1 registro): Pago rechazado por fondos insuficientes
- **pending** (1 registro): Transferencia internacional en proceso

### 💰 **Distribución de Montos**

- **Total procesado**: $6,425,000 COP
- **Promedio por pago**: $803,125 COP
- **Rango**: $150,000 - $2,500,000 COP

### 🕐 **Distribución Temporal**

Los pagos están distribuidos en los últimos días de junio 2025:
- **27 de junio**: 1 pago (cheque)
- **28 de junio**: 1 pago (efectivo)
- **29 de junio**: 2 pagos (Nequi, DaviPlata)
- **30 de junio**: 4 pagos (bancarios, PSE, tarjeta, internacional)

### 🔧 **Casos de Uso Cubiertos**

1. **Pago único de factura simple**
2. **Pago múltiple cubriendo varias facturas**
3. **Pagos con documentos adjuntos**
4. **Manejo de errores y rechazos**
5. **Pagos pendientes de confirmación**
6. **Diferentes métodos de pago colombianos**
7. **Pagos internacionales**
8. **Auditoría completa con metadatos**

### 📋 **Validaciones Incluidas**

- Todos los montos son positivos
- Fechas en formato ISO válido
- Referencias únicas por método de pago
- Estados consistentes entre pagos y facturas relacionadas
- Metadatos apropiados para cada método de pago

### 🚀 **Uso Recomendado**

Este archivo es ideal para:
- **Desarrollo y testing**: Datos realistas para pruebas
- **Demos**: Mostrar capacidades del sistema
- **Documentación**: Ejemplos de estructura de datos
- **Validación**: Verificar que el sistema maneja todos los casos

### 📝 **Notas Técnicas**

- Todas las fechas están en formato ISO 8601
- Los IDs siguen patrones consistentes
- Los montos están en pesos colombianos (COP)
- Los archivos adjuntos incluyen metadatos completos
- Las transacciones relacionadas mantienen integridad referencial

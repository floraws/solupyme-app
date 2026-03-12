# SearchableSelect - Componente Avanzado para Selecciones con Búsqueda

## Descripción

El componente `SearchableSelect` es una versión avanzada del componente de selección estándar, diseñado específicamente para manejar listas grandes de opciones con funcionalidades de búsqueda, navegación por teclado y categorización.

## Características Principales

### 🔍 Búsqueda Inteligente
- Búsqueda en tiempo real por etiquetas y valores
- Filtrado instantáneo de opciones
- Placeholder personalizable para el campo de búsqueda

### ⌨️ Navegación por Teclado
- **↑/↓**: Navegar entre opciones
- **Enter**: Seleccionar opción resaltada
- **Escape**: Cerrar el dropdown
- **Tab**: Salir del componente

### 🗂️ Categorización
- Agrupación visual de opciones por categorías
- Separadores visuales entre categorías
- Opción para mostrar/ocultar categorías

### 🎨 Interfaz Avanzada
- Diseño responsivo y moderno
- Estados visuales claros (hover, focus, selected)
- Animaciones suaves
- Scroll automático para elementos resaltados

### 🧹 Funcionalidad de Limpieza
- Botón de limpieza opcional
- Opción para limpiar la selección actual

## Implementación en el Formulario de Facturas

### Antes (SelectField básico):
```tsx
<SelectField
  label="Seleccionar Cliente"
  {...register("customer.name")}
  options={bpartners}
  error={errors.customer?.name?.message}
  required
/>
```

### Después (SearchableSelect avanzado):
```tsx
<SearchableSelect
  label="Seleccionar Cliente"
  options={bpartners}
  value={selectedCustomer}
  onChange={(value) => {
    setSelectedCustomer(value);
    const selected = bpartners.find(bp => bp.value === value);
    if (selected) {
      setValue("customer.name", selected.label);
      setValue("customer.email", `contacto@${selected.label.toLowerCase().replace(/\s+/g, '')}.com`);
      setValue("customer.phone", "+57 300 123 4567");
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
```

## Estructura de Datos Mejorada

### Tipo SearchableOption:
```typescript
interface SearchableOption {
  value: string;
  label: string;
  description?: string;  // Información adicional
  category?: string;     // Categoría para agrupación
}
```

### Ejemplo de Datos:
```typescript
const bpartnersData: SearchableOption[] = [
  { 
    label: "Empresa ABC S.A.S", 
    value: "bp_001",
    description: "NIT: 900123456-1 - Servicios de Consultoría",
    category: "Empresas"
  },
  { 
    label: "Juan Carlos Rodríguez", 
    value: "bp_003",
    description: "CC: 1234567890 - Consultor Independiente",
    category: "Personas Naturales"
  }
];
```

## Beneficios de la Implementación

### 1. Mejor Experiencia de Usuario
- **Búsqueda rápida**: Los usuarios pueden encontrar clientes escribiendo cualquier parte del nombre o descripción
- **Navegación intuitiva**: Uso del teclado para una experiencia más fluida
- **Información contextual**: Las descripciones ayudan a identificar mejor cada opción

### 2. Escalabilidad
- **Listas grandes**: Maneja eficientemente cientos o miles de registros
- **Rendimiento optimizado**: Solo renderiza las opciones visibles
- **Memoria eficiente**: Filtrado inteligente sin duplicar datos

### 3. Accesibilidad
- **Compatible con lectores de pantalla**: Etiquetas y roles ARIA apropiados
- **Navegación por teclado**: Totalmente accesible sin mouse
- **Contraste adecuado**: Colores que cumplen estándares de accesibilidad

### 4. Integración con React Hook Form
- **Auto-completado**: Llena automáticamente campos relacionados
- **Validación**: Integración completa con el sistema de validación
- **Estado sincronizado**: Mantiene consistencia con el formulario

## Casos de Uso Ideales

- **Selección de clientes/proveedores** con grandes bases de datos
- **Listas de productos** con categorías y descripciones
- **Selección de empleados** con información de departamento
- **Catálogos de servicios** organizados por tipo
- Cualquier selección que requiera búsqueda y categorización

## Personalización Disponible

### Props Principales:
- `maxHeight`: Altura máxima del dropdown
- `showCategories`: Mostrar/ocultar agrupación por categorías
- `clearable`: Permitir limpiar la selección
- `searchPlaceholder`: Texto del placeholder de búsqueda
- `emptyMessage`: Mensaje cuando no hay resultados
- `disabled`: Deshabilitar el componente

### Estilos Personalizables:
- Colores de tema mediante clases CSS
- Tamaños y espaciados
- Efectos de hover y focus
- Animaciones de transición

## Mejores Prácticas

1. **Datos estructurados**: Usar categorías significativas para organizar opciones
2. **Descripciones útiles**: Incluir información que ayude a distinguir opciones similares
3. **Placeholders descriptivos**: Explicar qué pueden buscar los usuarios
4. **Manejo de errores**: Proporcionar mensajes claros cuando no hay resultados
5. **Carga perezosa**: Para listas muy grandes, considerar cargar datos bajo demanda

## Próximas Mejoras

- [ ] Soporte para selección múltiple
- [ ] Carga perezosa de opciones
- [ ] Caché de búsquedas frecuentes
- [ ] Integración con APIs externas
- [ ] Temas personalizables
- [ ] Soporte para opciones con imágenes

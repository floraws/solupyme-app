# Hook useRegions

El hook `useRegions` es una solución reutilizable para cargar y manejar regiones/estados en toda la aplicación. Soporta tanto carga de todas las regiones como filtrado por país.

## Características

- ✅ Carga automática de regiones al montar el componente
- ✅ Filtrado por país (opcional)
- ✅ Manejo granular de errores con `ServiceError`
- ✅ Estados de carga apropiados
- ✅ Funciones de reintento y refrescar
- ✅ Redirección automática en casos de sesión expirada
- ✅ Integración con `useMessages` para mostrar errores
- ✅ Propiedades calculadas útiles
- ✅ Control de carga automática

## Importación

```typescript
import { useRegions } from "@/hooks/useRegions";
// o desde el índice
import { useRegions } from "@/hooks";
```

## Parámetros

| Parámetro | Tipo | Por Defecto | Descripción |
|-----------|------|-------------|-------------|
| `countryId` | `string \| null \| undefined` | `undefined` | ID del país para filtrar regiones |
| `autoLoad` | `boolean` | `true` | Si debe cargar automáticamente al montar |

## Uso Básico

### Cargar Todas las Regiones

```typescript
const MyComponent = () => {
  const { regions, loading, hasRegions, isEmpty } = useRegions();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isEmpty) {
    return <div>No hay regiones disponibles</div>;
  }

  return (
    <select>
      {regions.map(region => (
        <option key={region.value} value={region.value}>
          {region.label}
        </option>
      ))}
    </select>
  );
};
```

### Filtrar por País

```typescript
const RegionsForCountry = ({ countryId }: { countryId: string }) => {
  const { regions, loading, hasRegions } = useRegions(countryId);

  return (
    <div>
      {loading && <p>Cargando regiones...</p>}
      {hasRegions && (
        <select>
          {regions.map(region => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
```

### Sin Carga Automática

```typescript
const ManualRegionsComponent = () => {
  const { regions, loading, loadRegions } = useRegions(undefined, false);

  const handleLoadRegions = async (countryId?: string) => {
    try {
      await loadRegions(countryId);
    } catch (error) {
      console.error('Error al cargar regiones:', error);
    }
  };

  return (
    <div>
      <button onClick={() => handleLoadRegions()}>
        Cargar Todas las Regiones
      </button>
      <button onClick={() => handleLoadRegions('CO')}>
        Cargar Regiones de Colombia
      </button>
    </div>
  );
};
```

## API del Hook

### Estados Retornados

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `regions` | `LabelValuePair[]` | Array de regiones con `value` y `label` |
| `loading` | `boolean` | Indica si está cargando regiones |
| `hasRegions` | `boolean` | `true` si hay regiones disponibles |
| `isEmpty` | `boolean` | `true` si no hay regiones y no está cargando |

### Funciones Retornadas

| Función | Parámetros | Descripción |
|---------|------------|-------------|
| `loadRegions(countryId?)` | `string \| null` | Carga regiones, opcionalmente filtradas por país |
| `retryLoadRegions()` | - | Reintenta la carga en caso de error |
| `refreshRegions(countryId?)` | `string \| null` | Refresca la lista de regiones |
| `clearRegions()` | - | Limpia la lista de regiones |

## Ejemplos de Uso

### En un Formulario Jerárquico (País → Región → Ciudad)

```typescript
const CreateCityForm = () => {
  const { register, watch, setValue } = useForm();
  const countryId = watch("countryId");
  
  // Cargar países
  const { countries, loading: loadingCountries } = useCountries();
  
  // Cargar regiones basadas en el país seleccionado
  const { regions, loading: loadingRegions, hasRegions } = useRegions(countryId);

  // Limpiar región cuando cambia el país
  useEffect(() => {
    setValue("regionId", "");
  }, [countryId, setValue]);

  return (
    <form>
      <SelectField
        label="País"
        {...register("countryId")}
        options={countries}
        disabled={loadingCountries}
      />
      
      {countryId && (
        <SelectField
          label="Región/Estado"
          {...register("regionId")}
          options={regions}
          disabled={loadingRegions}
        />
      )}
      
      {countryId && !hasRegions && !loadingRegions && (
        <Alert 
          type="warning"
          message="No hay regiones disponibles para el país seleccionado."
        />
      )}
    </form>
  );
};
```

### En una Lista de Administración

```typescript
const RegionsListPage = () => {
  const { regions, loading, refreshRegions, retryLoadRegions } = useRegions();
  
  const handleRefresh = async () => {
    try {
      await refreshRegions();
      showSuccess('Regiones actualizadas exitosamente');
    } catch (error) {
      // El error ya se maneja automáticamente por el hook
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Cargando regiones...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Gestión de Regiones</h1>
        <Button onClick={handleRefresh} disabled={loading}>
          Actualizar
        </Button>
      </div>
      
      {regions.length > 0 ? (
        <RegionsTable regions={regions} />
      ) : (
        <EmptyState
          title="No hay regiones"
          message="No se encontraron regiones en el sistema."
          action={
            <Button onClick={retryLoadRegions}>
              Reintentar Carga
            </Button>
          }
        />
      )}
    </div>
  );
};
```

### Con Manejo de Estados Específicos

```typescript
const RegionSelector = ({ countryId, value, onChange }: Props) => {
  const { 
    regions, 
    loading, 
    hasRegions, 
    isEmpty, 
    retryLoadRegions 
  } = useRegions(countryId);

  if (!countryId) {
    return <p className="text-gray-500">Selecciona un país primero</p>;
  }

  if (loading) {
    return (
      <div className="flex items-center text-sm text-gray-500">
        <LoadingSpinner size="sm" className="mr-2" />
        Cargando regiones...
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm text-yellow-800">
              No hay regiones disponibles para este país.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={retryLoadRegions}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <select value={value} onChange={onChange}>
      <option value="">Selecciona una región</option>
      {regions.map(region => (
        <option key={region.value} value={region.value}>
          {region.label}
        </option>
      ))}
    </select>
  );
};
```

## Comportamientos del Hook

### Cuando countryId cambia:

- **undefined**: Carga todas las regiones
- **string válido**: Carga regiones del país específico
- **null**: Limpia la lista de regiones
- **cambio de valor**: Recarga automáticamente con el nuevo país

### Manejo de Errores

El hook maneja automáticamente diferentes tipos de errores:

- **NETWORK_ERROR**: Error de conexión
- **UNAUTHORIZED**: Sesión expirada con redirección al login
- **FORBIDDEN**: Permisos insuficientes
- **NOT_FOUND**: No se encontraron regiones para el país
- **INTERNAL_SERVER_ERROR**: Error del servidor
- **Error genérico**: Error inesperado

## Casos de Uso Comunes

1. **Formularios de direcciones**: País → Región → Ciudad
2. **Filtros de búsqueda**: Filtrar por ubicación geográfica
3. **Administración**: Gestión de regiones por país
4. **Reportes**: Agrupación por región
5. **Configuración**: Selección de regiones activas

## Integración con otros Hooks

```typescript
// Ejemplo completo con países, regiones y ciudades
const AddressForm = () => {
  const { countries } = useCountries();
  const { register, watch, setValue } = useForm();
  
  const countryId = watch("countryId");
  const regionId = watch("regionId");
  
  const { regions } = useRegions(countryId);
  const { cities } = useCities(regionId); // Hook similar para ciudades

  // Limpiar campos dependientes
  useEffect(() => {
    setValue("regionId", "");
    setValue("cityId", "");
  }, [countryId, setValue]);

  useEffect(() => {
    setValue("cityId", "");
  }, [regionId, setValue]);

  return (
    <form>
      <SelectField label="País" {...register("countryId")} options={countries} />
      <SelectField label="Región" {...register("regionId")} options={regions} />
      <SelectField label="Ciudad" {...register("cityId")} options={cities} />
    </form>
  );
};
```

## Beneficios

1. **Flexibilidad**: Soporta carga global y filtrada por país
2. **Reutilización**: Un solo hook para múltiples casos de uso
3. **Performance**: Carga automática optimizada
4. **UX**: Manejo graceful de estados vacíos y errores
5. **Mantenibilidad**: Lógica centralizada
6. **Tipado**: Completamente tipado con TypeScript

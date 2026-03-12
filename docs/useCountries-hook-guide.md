# Hook useCountries

El hook `useCountries` es una solución reutilizable para cargar y manejar países en toda la aplicación.

## Características

- ✅ Carga automática de países al montar el componente
- ✅ Manejo granular de errores con `ServiceError`
- ✅ Estados de carga apropiados
- ✅ Funciones de reintento y refrescar
- ✅ Redirección automática en casos de sesión expirada
- ✅ Integración con `useMessages` para mostrar errores
- ✅ Propiedades calculadas útiles

## Importación

```typescript
import { useCountries } from "@/hooks/useCountries";
// o desde el índice
import { useCountries } from "@/hooks";
```

## Uso Básico

```typescript
const MyComponent = () => {
  const { countries, loading, hasCountries, isEmpty } = useCountries();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isEmpty) {
    return <div>No hay países disponibles</div>;
  }

  return (
    <select>
      {countries.map(country => (
        <option key={country.value} value={country.value}>
          {country.label}
        </option>
      ))}
    </select>
  );
};
```

## API del Hook

### Estados Retornados

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `countries` | `LabelValuePair[]` | Array de países con `value` y `label` |
| `loading` | `boolean` | Indica si está cargando países |
| `hasCountries` | `boolean` | `true` si hay países disponibles |
| `isEmpty` | `boolean` | `true` si no hay países y no está cargando |

### Funciones Retornadas

| Función | Descripción |
|---------|-------------|
| `loadCountries()` | Carga países manualmente |
| `retryLoadCountries()` | Reintenta la carga en caso de error |
| `refreshCountries()` | Refresca la lista de países |
| `clearCountries()` | Limpia la lista de países |

## Ejemplos de Uso

### En un Formulario de Creación

```typescript
const CreateUserForm = () => {
  const { countries, loading: loadingCountries, hasCountries, retryLoadCountries } = useCountries();
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Campo País */}
      {hasCountries && (
        <SelectField
          label="País"
          {...register("countryId")}
          options={countries}
          disabled={loadingCountries}
        />
      )}
      
      {!hasCountries && !loadingCountries && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                No hay países disponibles.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={retryLoadCountries}
              disabled={loadingCountries}
            >
              Reintentar
            </Button>
          </div>
        </div>
      )}
      
      {loadingCountries && (
        <div className="flex items-center text-sm text-gray-500">
          <LoadingSpinner size="sm" className="mr-2" />
          Cargando países...
        </div>
      )}
    </form>
  );
};
```

### En un Formulario de Edición

```typescript
const EditAccountPage = () => {
  const { countries, loading: loadingCountries } = useCountries();
  const { register, setValue } = useForm();

  // Los países se cargan automáticamente
  // Puedes usar setValue para establecer el valor inicial cuando tengas los datos
  
  return (
    <form>
      <SelectField
        label="País"
        {...register("countryId")}
        options={countries}
        disabled={loadingCountries}
      />
    </form>
  );
};
```

### Carga Manual

```typescript
const ManualLoadComponent = () => {
  const { countries, loading, loadCountries, clearCountries } = useCountries();

  const handleRefresh = async () => {
    try {
      await loadCountries();
      console.log('Países cargados exitosamente');
    } catch (error) {
      console.error('Error al cargar países:', error);
    }
  };

  return (
    <div>
      <button onClick={handleRefresh} disabled={loading}>
        {loading ? 'Cargando...' : 'Recargar Países'}
      </button>
      <button onClick={clearCountries}>
        Limpiar Lista
      </button>
      {/* Mostrar países */}
    </div>
  );
};
```

## Manejo de Errores

El hook maneja automáticamente diferentes tipos de errores:

- **NETWORK_ERROR**: Muestra mensaje de error de conexión
- **UNAUTHORIZED**: Muestra mensaje de sesión expirada y redirige al login
- **FORBIDDEN**: Muestra mensaje de permisos insuficientes
- **INTERNAL_SERVER_ERROR**: Muestra mensaje de error del servidor
- **Error genérico**: Muestra mensaje de error inesperado

## Integración con useMessages

El hook utiliza `useMessages` internamente para mostrar errores, por lo que:

- Los errores se muestran automáticamente
- Los mensajes se auto-limpian después de un tiempo
- Mantiene consistencia con el resto de la aplicación

## Páginas que ya lo usan

- `src/app/(dashboard)/accounts/[id]/edit/page.tsx`
- `src/app/(dashboard)/cities/create/page.tsx`

## Hook Relacionado

- **useRegions**: Hook similar para cargar regiones/estados
- **useMessages**: Hook para manejo de mensajes (usado internamente)

## Beneficios

1. **Reutilización**: Un solo hook para todos los componentes que necesiten países
2. **Consistencia**: Manejo uniforme de errores y estados de carga
3. **Mantenibilidad**: Lógica centralizada y fácil de actualizar
4. **Performance**: Carga automática optimizada
5. **UX**: Manejo graceful de errores con opciones de reintento
6. **Tipado**: Completamente tipado con TypeScript

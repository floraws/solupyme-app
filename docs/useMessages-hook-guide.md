# Guía del Hook useMessages

El hook `useMessages` es una solución reutilizable para el manejo consistente de mensajes de error, éxito e informativos en toda la aplicación.

## Importación

```typescript
import { useMessages } from "@/hooks/useMessages";
```

## Uso Básico

```typescript
const MyComponent = () => {
  const { error, message, showError, showSuccess, showInfo, clearAllMessages } = useMessages();

  // En el JSX
  return (
    <div>
      {error && (
        <Alert type="error" title="Error" message={error} />
      )}
      {message && (
        <Alert type="success" title="Éxito" message={message} />
      )}
      {/* Resto del componente */}
    </div>
  );
};
```

## API del Hook

### Estados
- `error`: Mensaje de error actual (string | null)
- `message`: Mensaje de éxito/info actual (string | null)

### Funciones Principales

#### `showError(errorMessage: string, autoClear?: boolean)`
Muestra un mensaje de error. Por defecto se auto-limpia después de 5 segundos.

```typescript
// Con auto-limpieza (por defecto)
showError('Error al cargar los datos');

// Sin auto-limpieza
showError('Sesión expirada', false);
```

#### `showSuccess(successMessage: string, autoClear?: boolean)`
Muestra un mensaje de éxito. Por defecto se auto-limpia después de 3 segundos.

```typescript
// Con auto-limpieza (por defecto)
showSuccess('Usuario creado exitosamente');

// Sin auto-limpieza
showSuccess('Operación completada', false);
```

#### `showInfo(infoMessage: string, autoClear?: boolean)`
Muestra un mensaje informativo. Por defecto se auto-limpia después de 4 segundos.

```typescript
showInfo('Cargando datos...');
```

#### `clearAllMessages()`
Limpia inmediatamente todos los mensajes.

```typescript
clearAllMessages();
```

#### `clearMessages(delay?: number)`
Limpia los mensajes después del delay especificado (por defecto 5 segundos).

```typescript
clearMessages(2000); // Limpia después de 2 segundos
```

### Funciones Avanzadas

#### `setError(error: string | null)`
Control manual del estado de error.

#### `setMessage(message: string | null)`
Control manual del estado de mensaje.

## Ejemplos de Uso

### En un Formulario

```typescript
const CreateUserForm = () => {
  const { error, message, showError, showSuccess, clearAllMessages } = useMessages();

  const onSubmit = async (data: UserFormData) => {
    clearAllMessages(); // Limpiar mensajes previos
    
    try {
      await userService.create(data);
      showSuccess('Usuario creado exitosamente');
      setTimeout(() => router.push('/users'), 1500);
    } catch (error) {
      if (error instanceof ServiceError) {
        switch (error.code) {
          case 'VALIDATION_ERROR':
            showError(`Error de validación: ${error.message}`);
            break;
          case 'CONFLICT':
            showError('Ya existe un usuario con este email');
            break;
          default:
            showError('Error inesperado al crear usuario');
        }
      } else {
        showError('Error de conexión. Intenta nuevamente.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert type="error" message={error} />}
      {message && <Alert type="success" message={message} />}
      {/* Campos del formulario */}
    </form>
  );
};
```

### En un Efecto de Carga

```typescript
const DataList = () => {
  const { error, showError, clearAllMessages } = useMessages();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      clearAllMessages();
      try {
        const result = await dataService.getAll();
        setData(result);
      } catch (error) {
        showError('Error al cargar los datos');
      }
    };
    
    fetchData();
  }, [showError, clearAllMessages]);

  return (
    <div>
      {error && <Alert type="error" message={error} />}
      {/* Lista de datos */}
    </div>
  );
};
```

## Ventajas del Hook

1. **Reutilización**: Un solo hook para todos los componentes
2. **Consistencia**: Comportamiento uniforme en toda la app
3. **Auto-limpieza**: Los mensajes se limpian automáticamente
4. **Flexibilidad**: Control sobre cuándo y cómo mostrar mensajes
5. **Tipado**: Totalmente tipado con TypeScript
6. **Rendimiento**: Optimizado con useCallback para evitar re-renders

## Páginas Refactorizadas

- `src/app/(dashboard)/accounts/[id]/edit/page.tsx`
- `src/app/(dashboard)/regions/create/page.tsx`
- `src/app/(dashboard)/cities/create/page.tsx`

Puedes usar este hook en cualquier componente que necesite mostrar mensajes de estado al usuario.

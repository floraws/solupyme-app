# Error Handler Utilities

Este archivo contiene utilidades robustas para el manejo de errores en servicios, validaciones y operaciones de red.

## Clases de Error

### ServiceError
Error base para todos los errores de servicios.

```typescript
throw new ServiceError('Mensaje de error', 'ERROR_CODE', 500, { detail: 'info' });
```

### ValidationError
Para errores de validación de datos.

```typescript
throw new ValidationError('El nombre es requerido', 'name');
```

### NotFoundError
Para recursos no encontrados.

```typescript
throw new NotFoundError('Usuario', 'user-123');
```

### ConflictError
Para conflictos de datos (duplicados, etc.).

```typescript
throw new ConflictError('El email ya existe', 'email');
```

### UnauthorizedError y ForbiddenError
Para errores de autenticación y autorización.

```typescript
throw new UnauthorizedError('Token inválido');
throw new ForbiddenError('Sin permisos para esta operación');
```

### NetworkError
Para errores de conectividad.

```typescript
throw new NetworkError('Sin conexión a internet');
```

## ErrorHandler

### handleHttpError()
Convierte errores HTTP en errores tipados con logging automático.

```typescript
try {
    const response = await fetch('/api/users');
    // ...
} catch (error) {
    ErrorHandler.handleHttpError(error, 'obtener usuarios', 'Usuario', {
        userId: 'user-123',
        requestId: 'req-456'
    });
}
```

### Validaciones

```typescript
// Validar campo requerido
ErrorHandler.validateRequired(value, 'Nombre');

// Validar longitud de string
ErrorHandler.validateLength(password, 'Contraseña', 8, 50);

// Validar email
ErrorHandler.validateEmail(email, 'Email');

// Validar ID
ErrorHandler.validateId(userId, 'ID de usuario');

// Validar URL
ErrorHandler.validateUrl(website, 'Sitio web');

// Validar rango numérico
ErrorHandler.validateRange(age, 'Edad', 0, 150);

// Validar valores permitidos
ErrorHandler.validateEnum(status, ['active', 'inactive'], 'Estado');

// Validaciones múltiples
const errors = ErrorHandler.validateMultiple([
    () => ErrorHandler.validateRequired(name, 'Nombre'),
    () => ErrorHandler.validateEmail(email, 'Email'),
    () => ErrorHandler.validateLength(password, 'Contraseña', 8)
]);

// Ejecutar validaciones (lanza el primer error)
ErrorHandler.validate([
    () => ErrorHandler.validateRequired(name, 'Nombre'),
    () => ErrorHandler.validateEmail(email, 'Email')
]);

// Ejecutar validaciones (lanza todos los errores juntos)
ErrorHandler.validate([
    () => ErrorHandler.validateRequired(name, 'Nombre'),
    () => ErrorHandler.validateEmail(email, 'Email')
], true);
```

## QueryBuilder

### build()
Construye query strings para URLs.

```typescript
const queryString = QueryBuilder.build({
    page: 1,
    limit: 10,
    search: 'john',
    sortBy: 'name',
    sortOrder: 'asc',
    filters: { active: true }
});
// Resultado: "page=1&limit=10&search=john&sortBy=name&sortOrder=asc&filters=%7B%22active%22%3Atrue%7D"
```

### toPlainObject()
Convierte opciones a objeto plano.

```typescript
const params = QueryBuilder.toPlainObject({
    page: 1,
    limit: 10,
    search: 'john'
});
// Resultado: { page: 1, limit: 10, search: 'john' }
```

## RetryHandler

### withRetry()
Ejecuta operaciones con retry automático.

```typescript
const result = await RetryHandler.withRetry(
    async () => {
        return await fetch('/api/data');
    },
    {
        maxRetries: 3,
        delayMs: 1000,
        exponentialBackoff: true,
        retryCondition: RetryHandler.networkErrorCondition
    }
);
```

### Condiciones de retry predefinidas

```typescript
// Para errores de red
RetryHandler.networkErrorCondition(error)

// Para errores temporales del servidor (5xx)
RetryHandler.serverErrorCondition(error)
```

## ErrorLogger

### configure()
Configura el comportamiento del logger.

```typescript
ErrorLogger.configure({
    logLevel: 'error',
    logToConsole: true,
    sensitiveFields: ['password', 'token', 'secret'],
    logToExternal: (error, context) => {
        // Enviar a servicio de logging externo
        console.log('Logging to external service:', error, context);
    }
});
```

### logError()
Registra errores con contexto.

```typescript
ErrorLogger.logError(
    new ServiceError('Error de conexión', 'NETWORK_ERROR'),
    'user-service.getUser',
    {
        userId: 'user-123',
        sessionId: 'session-456',
        requestId: 'req-789'
    }
);
```

## Interfaces Útiles

### StandardQueryOptions
```typescript
interface StandardQueryOptions {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, unknown>;
}
```

### PaginatedResponse
```typescript
interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
```

### StandardDeleteResult
```typescript
interface StandardDeleteResult {
    success: boolean;
    message: string;
    deletedId?: string;
    deletedAt?: string;
    error?: string;
}
```

### OperationResult
```typescript
interface OperationResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    code?: string;
    message?: string;
}
```

## Ejemplo de Uso en un Servicio

```typescript
import { 
    ErrorHandler, 
    StandardQueryOptions, 
    PaginatedResponse,
    RetryHandler,
    QueryBuilder 
} from '@/helpers/error-handler';

class UserService {
    async getUsers(options?: StandardQueryOptions): Promise<User[]> {
        try {
            // Validar parámetros
            if (options?.page) {
                ErrorHandler.validateRange(options.page, 'Página', 1);
            }
            
            const queryString = QueryBuilder.build(options || {});
            const url = \`/api/users?\${queryString}\`;
            
            // Operación con retry
            const response = await RetryHandler.withRetry(
                () => fetch(url),
                {
                    maxRetries: 2,
                    delayMs: 500,
                    exponentialBackoff: true,
                    retryCondition: RetryHandler.networkErrorCondition
                }
            );
            
            return response.json();
        } catch (error) {
            ErrorHandler.handleHttpError(error, 'obtener usuarios', 'Usuario');
        }
    }
    
    async createUser(userData: CreateUserRequest): Promise<User> {
        try {
            // Validaciones
            ErrorHandler.validate([
                () => ErrorHandler.validateRequired(userData.name, 'Nombre'),
                () => ErrorHandler.validateEmail(userData.email, 'Email'),
                () => ErrorHandler.validateLength(userData.password, 'Contraseña', 8, 50)
            ]);
            
            const response = await fetch('/api/users', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            
            return response.json();
        } catch (error) {
            ErrorHandler.handleHttpError(error, 'crear usuario', 'Usuario', {
                operation: 'create',
                timestamp: new Date().toISOString()
            });
        }
    }
}
```

Este sistema de manejo de errores proporciona:

1. **Consistencia** en el manejo de errores
2. **Logging automático** con contexto
3. **Validaciones robustas** y reutilizables
4. **Retry automático** para operaciones de red
5. **Tipado fuerte** para mejor developer experience
6. **Flexibilidad** para diferentes casos de uso

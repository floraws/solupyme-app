# Copilot Instructions – SoluPYME App

## Project Overview

**SoluPYME** is a web-based ERP/management system for small and medium-sized businesses (PyMEs) in the Latin American market. The UI language is **Spanish**. It is a **Next.js 16 App Router** application backed by an external REST API (typically a Spring Boot service).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| UI | React 19, Tailwind CSS 4 |
| Server state | TanStack React Query 5 |
| Client state | Zustand 5 |
| Forms | React Hook Form 7 + Zod 4 |
| HTTP client | Custom `fetchWrapper` (`src/helpers/fetch-wrapper.ts`) |
| Auth | JWT in cookies (`js-cookie`) + localStorage fallback, CSRF tokens |
| Icons | `@heroicons/react` v2 |

---

## Repository Layout

```
src/
  app/               # Next.js App Router pages
    (auth)/          # Login and public pages (no auth required)
    (clients)/       # Client-facing pages
    (dashboard)/     # Main authenticated app
      accounts/
      bpartners/
      catalogs/
      cities/
      countries/
      dashboards/
      documents/
      employees/
      integrations/
      invoices/
      products/
      regions/
      settings/
    api/             # Next.js route handlers
  components/
    ui/              # Reusable UI component library (see below)
    auth/            # Auth-specific components
    dashboard/       # Dashboard-specific components
  constants/
    apisUrls.ts      # All API endpoint definitions
    index.ts         # Token keys, enums, re-exports
  data/              # Static/mock JSON data
  helpers/
    fetch-wrapper.ts # Central HTTP client
    error-handler.ts # Error classes, ErrorHandler, RetryHandler, QueryBuilder
  hooks/             # Custom React hooks
  interfaces/        # Misc TypeScript interfaces
  lib/
    utils.ts         # JWT decode, utility functions
  middleware.ts      # Route protection + security headers
  services/          # API service modules (one per domain)
  types/
    api/
      requests/      # Request DTOs
      responses/     # Response DTOs
      common.ts      # SpringBaseEntity, LabelValuePair, PaginatedResponse
    common.ts        # Shared types
```

---

## Development Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
npm run start    # Start production server
```

**Required environment variable:**
```
NEXT_PUBLIC_URL_API=http://localhost:8080   # Backend API base URL
```

---

## Architecture & Key Patterns

### Route Groups and Authentication

- `(auth)` – unauthenticated routes (e.g., `/login`)
- `(dashboard)` – all authenticated routes; protected via `src/middleware.ts` which redirects to `/login` if no `access_token` cookie is present
- `(clients)` – client-facing section

The `(dashboard)/layout.tsx` uses the `useAuth` hook to verify token validity client-side and wraps children in a `QueryClientProvider`.

### Path Aliases

`@/` maps to `src/`. Always use this alias for imports.

### Service Layer (`src/services/`)

One service file per domain (e.g., `country.service.ts`, `region.service.ts`). Each service exports an object with standard CRUD functions using `fetchWrapper`:

```ts
export const countryService = {
  getAll,           // fetchWrapper.get(apiUrls.countries.getAll)
  getById,          // fetchWrapper.get(apiUrls.countries.getById(id))
  create,           // fetchWrapper.post(apiUrls.countries.insert, data)
  update,           // fetchWrapper.put(apiUrls.countries.update(id), data)
  delete: (id) => fetchWrapper.delete(apiUrls.countries.delete(id)),
  getLabelValuesList, // returns LabelValuePair[]
}
```

### API URL Definitions (`src/constants/apisUrls.ts`)

All endpoints live here. Add new endpoints to the appropriate domain object. Functions receive IDs for parameterised paths:

```ts
countries: {
  getAll: '/countries',
  getById: (id: string) => `/countries/${id}`,
  insert: '/countries',
  update: (id: string) => `/countries/${id}`,
  delete: (id: string) => `/countries/${id}`,
  labelValuesList: '/countries/label-value-list',
}
```

### HTTP Client (`src/helpers/fetch-wrapper.ts`)

`fetchWrapper` handles:
- Automatic `Authorization: Bearer <token>` and `X-Client-Id` headers
- CSRF token fetching for `POST`/`PUT`/`DELETE`
- Automatic token refresh on `401`
- Redirect to `/login` on persistent `401`

Use `fetchWrapper.get/post/put/delete(path, body?)` — never call `fetch` directly in services.

### Type System (`src/types/api/`)

- **Requests**: `CountryRequest`, `RegionRequest`, etc.
- **Responses**: `CountryResponse`, `RegionResponse`, etc. All extend `SpringBaseEntity` (which adds `id`, `createdDate`, `lastModifiedDate`, `createdBy`, `lastModifiedBy`)
- **Common**: `LabelValuePair { label: string; value: string }` (used for dropdowns), `PaginatedResponse<T>`, `SpringBaseEntity`, `SpringErrorResponse`

### Authentication (`src/hooks/useAuth.ts`, `src/services/auth.service.ts`)

- Token is stored in `js-cookie` (key: `access_token`) and mirrored to `localStorage`
- `authService.isLoggedIn` validates token expiry via JWT decode
- `useAuth()` hook exposes: `isAuthenticated`, `isLoading`, `user`, `tokenExpiringSoon`, `login()`, `logout()`, `refreshTokenIfNeeded()`
- Token is refreshed automatically every 60 seconds if it is within 5 minutes of expiry

### Reusable UI Components (`src/components/ui/`)

Import from `@/components/ui` (barrel export). Key components:

| Component | Usage |
|---|---|
| `PageHeader` | Page title, subtitle, back button, action buttons |
| `SearchBar` | Controlled search input |
| `Table` | Generic data table with `columns` (key, label, render) and `data` |
| `ActionButtonGroup` | Row-level view/edit/delete action buttons |
| `ConfirmDialog` | Modal confirmation for destructive actions |
| `EmptyState` | Shown when list is empty, accepts optional `action` |
| `Alert` | Error/success/info messages (`type="error"` etc.) |
| `LoadingSpinner` / `LoadingState` | Loading indicators |
| `InputField` | Controlled text input with label + error |
| `SelectField` | `<select>` with label, options as `LabelValuePair[]` |
| `SearchableSelect` | Searchable dropdown |
| `FormLayout` | Consistent form wrapper |
| `Card` | Content card |
| `Breadcrumb` | Navigation breadcrumb |
| `StatsCard` / `StatsGrid` | Dashboard statistics cards |
| `Tabs` | Tab navigation |
| `CheckboxGroup` | Multiple checkbox selection |
| `Button` | Styled button with variants |

### Standard List Page Pattern

Each list page (`page.tsx`) follows this pattern:
1. `"use client"` directive
2. State: `items`, `loading`, `error`, `searchTerm`, `deletingId`, `showDeleteDialog`, `itemToDelete`
3. `useEffect` → calls service `getAll()` or equivalent
4. Filter logic with `.filter()` on `searchTerm`
5. `tableColumns` array with `key`, `label`, `render` for custom cells
6. Render: loading spinner → `PageHeader` → `SearchBar` → `Alert` (if error) → `Table` or `EmptyState` → `ConfirmDialog`

### Standard Form Page Pattern

Create/edit pages use `react-hook-form` + `zod` for validation:
1. Define Zod schema
2. Use `useForm` with `zodResolver`
3. On submit: call `service.create()` or `service.update()` then redirect
4. Use `InputField`, `SelectField`, `FormLayout` components

### Error Handling (`src/helpers/error-handler.ts`)

Provides typed error classes: `ServiceError`, `ValidationError`, `NotFoundError`, `ConflictError`, `UnauthorizedError`, `ForbiddenError`, `NetworkError`.

Use `ErrorHandler.handleHttpError(error, 'action', 'EntityName')` in service catch blocks. For input validation, use `ErrorHandler.validate([...])` or individual `ErrorHandler.validateRequired/validateEmail/validateRange/validateEnum` methods.

---

## Important Conventions

- **All user-facing text is in Spanish.** Keep comments, labels, messages, and UI strings in Spanish.
- **No direct `fetch` calls** outside of `fetchWrapper`.
- **Always use `@/` path alias** for imports.
- All API endpoints must be added to `src/constants/apisUrls.ts` before using them.
- New response/request types go in `src/types/api/responses/` and `src/types/api/requests/` respectively, and must be re-exported from `src/types/api/index.ts`.
- New services must be added to `src/services/index.ts` if it exists, or imported directly.
- Security headers and auth middleware are in `src/middleware.ts` — do not weaken these.
- Pages under `(dashboard)` that need the backend must be `"use client"` components.
- `src/app/api/` contains Next.js Route Handlers if server-side proxying is needed.
- The backend returns Spring-style entities; response types extend `SpringBaseEntity`.
- `LabelValuePair` is the standard format for all dropdown/select option data from the API.

---

## Known Issues & Workarounds

- `src/constants/apisUrls.ts` has a duplicate `employees` key. The second one (lower) overrides the first. When editing this file, consolidate duplicates.
- `src/services/auth.service.ts` has an unused import (`import { set } from "zod/v4"`). This can be removed.
- No test framework is currently configured. `TODO.md` documents the intent to add Jest + Cypress.
- `(dashboard)/layout.tsx` uses `<a>` tags for navigation instead of Next.js `<Link>` — this causes full-page reloads. Prefer `<Link>` for in-app navigation.
- `output: 'standalone'` is set in `next.config.ts` for Docker/production deployments.

---

## Pending Work (from `TODO.md`)

- City management pages: create, detail, edit (`/cities/create`, `/cities/[id]`, `/cities/[id]/edit`)
- Password recovery and 2FA
- Pagination for large tables (currently loads all records)
- Dark mode
- Global state migration to Zustand (partially done)
- Jest + Cypress test setup
- Storybook for component documentation

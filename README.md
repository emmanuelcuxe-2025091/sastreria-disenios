# Expert — Catálogo de Prendas

Aplicación web editorial desarrollada con **Angular 22**, **TypeScript estricto** y arquitectura desacoplada preparada para **PostgreSQL + PostgREST**. Está diseñada como catálogo de exhibición para mostrar opciones de prendas y prendas creadas por la empresa **Expert**, incluyendo un apartado para registrar nuevas opciones de prendas y prendas creadas.

---

## Arquitectura y Buenas Prácticas

- **Angular 22 moderno (Standalone + Signals + Zoneless):** Componentes standalone con `ChangeDetectionStrategy.OnPush`, estado reactivo basado en `signal()` / `computed()`, nuevo flujo de control (`@if`, `@for`) y carga perezosa (`loadComponent`) por ruta.
- **TypeScript estricto:** Modelos de dominio inmutables (`readonly`), tipos unión discriminados (`GarmentCategory`, `GarmentEra`, `CatalogSortOption`) e inyección por `InjectionToken`.
- **Patrón Repository para desacoplar persistencia:**
  - `CatalogRepository` define el contrato de lectura del catálogo.
  - `LocalCatalogRepository` sirve el archivo curado de forma inmediata sin requerir infraestructura adicional.
  - `PostgrestCatalogRepository` consume vistas de solo lectura de **PostgreSQL vía PostgREST** con fallback automático y resiliente al archivo local si la API no está disponible.
- **UX de catálogo profesional:** Filtros combinables (búsqueda sin sensibilidad a tildes, especialidad, época histórica y ordenamiento) sincronizados con *query params* de URL para compartir enlaces filtrados.
- **Accesibilidad y SEO técnico:** Landmarks HTML5 semánticos, enlace de salto al contenido principal, `aria-live` para conteo de resultados, estrategia de títulos por ruta (`AtelierTitleStrategy`) y contraste cuidado.
- **Pruebas unitarias con Vitest:** Cobertura de lógica de filtrado, estado reactivo, shell de aplicación y cliente PostgREST con fallback.

---

## ¿Es necesario PostgreSQL + PostgREST para esta página?

Para un **catálogo institucional de solo lectura**, no es estrictamente obligatorio desplegar una base de datos desde el primer día: el modo `local` permite publicar el sitio como aplicación estática con latencia mínima y costo cero de servidor.

Sin embargo, el proyecto incluye toda la capa de base de datos lista para producción en [`database/`](./database) por si la empresa desea gestionar nuevas prendas dinámicamente desde PostgreSQL sin recompilar el frontend:

- [`database/schema.sql`](./database/schema.sql): Esquema normalizado PostgreSQL 16 (`core.*`) y vistas públicas de solo lectura (`api.catalog_garments`, `api.company_milestones`).
- [`database/postgrest_roles.sql`](./database/postgrest_roles.sql): Rol anónimo de mínimo privilegio (`web_anon`) con acceso exclusivamente `SELECT` sobre el esquema `api` y Row-Level Security (RLS) sobre `is_published = true`.
- [`database/seed.sql`](./database/seed.sql): Datos iniciales del archivo de prendas e hitos de trayectoria.
- [`database/docker-compose.yml`](./database/docker-compose.yml): Stack listo con PostgreSQL 16 + PostgREST v12.

### Activar el modo PostgreSQL + PostgREST (opcional)

1. Levantar la base de datos y PostgREST:
   ```bash
   cd database
   cp .env.example .env
   docker compose up -d
   ```
2. Cambiar `dataSource` de `'local'` a `'postgrest'` en `src/environments/environment.ts` (o `environment.production.ts`).

---

## Estructura del Proyecto

```text
sastreria-disenios/
├── database/                         # Esquema PostgreSQL 16, roles PostgREST, seed y Docker Compose
├── public/images/catalog/            # Fotografía editorial del catálogo
└── src/
    ├── environments/                 # Configuración local y producción (modo local / postgrest)
    └── app/
        ├── core/
        │   ├── config/               # InjectionTokens (APP_ENVIRONMENT, CATALOG_REPOSITORY)
        │   ├── data/                 # Archivo curado de prendas, categorías e hitos
        │   ├── models/               # Contratos TypeScript de dominio
        │   ├── repositories/         # CatalogRepository, LocalCatalogRepository y PostgrestCatalogRepository
        │   └── services/             # CatalogStateService (Signals) y AtelierTitleStrategy
        ├── shared/components/        # Header, GarmentCard y SectionHeader
        └── features/
            ├── home/                 # Secciones "Opciones de prendas" y "Prendas creadas" con búsqueda y filtros múltiples
            ├── add-garment/          # Apartado para agregar opciones de prendas y prendas creadas (/agregar)
            ├── garment-detail/       # Ficha técnica completa y galería por prenda (/prenda/:slug)
            └── not-found/            # Página 404
```

---

## Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:4200)
npm start

# Ejecutar pruebas unitarias (Vitest)
npm test -- --watch=false

# Compilar build de producción
npm run build
```

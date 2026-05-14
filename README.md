# Asklepios Order Service

## Startanleitung

### Lokaler Start

```bash
npm install
```

Umgebungsvariablen: eine `.env` im Projektroot mit mindestens:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3000
```

Datenbankschema anwenden und Prisma Client erzeugen:

```bash
npx prisma generate
npx prisma migrate deploy
```

Entwicklung scripts:

```bash
npm run start:dev
```

- HTTP-API: `http://localhost:3000`
- **Swagger UI**: `http://localhost:3000/api`

Production-Build:

```bash
npm run build
npm run start:prod
```

## API Endpoints

- POST /orders → Create order
- GET /orders → Get all orders
- GET /orders/:id → Get order by ID
- PATCH /orders/:id → Update order
- PATCH /orders/:id/status → Change order status
- DELETE /orders/:id → Delete order
- DELETE /orders → Delete all orders

## Getroffene Entscheidungen

- **Einheitliche Erfolgsantworten**: Ein globaler `TransformResponseInterceptor` wrappt Erfolgsdaten in ein einheitliches `{ success, message, data }`-Format (`ApiResponse`).

- **Keine Pagination**: Liste der Orders lädt alle Datensätze; Sortierung nach `createdAt` absteigend im Repository.

- **Schichten**: Controller → Service → Repository (Prisma).

- **Validierung**: Globaler `ValidationPipe` mit `whitelist` und `transform`

whitelist: entfernt alle Properties, die nicht im DTO definiert sind  
transform: wandelt Payloads in DTO-Instanzen um (z. B. string → number)

- **Fehler**: Nest-Standard ( `NotFoundException` , `BadRequestException`)

## Start mit Docker

```bash
docker-compose up --build
```

- App: http://localhost:3000
- Swagger: http://localhost:3000/api
- Database: localhost:5430

## In der begrenzten Zeit nicht (oder nur rudimentär) umgesetzt

- **Swagger-Deklaration** der Response-Hülle und konsistente `@ApiResponse`-Dokumentation pro Endpoint
- Pagination wurde bewusst nicht implementiert, um Fokus auf Core-Business-Logic zu legen

## TODO

- [ ] Pagination
- [ ] Fitler and Search
- [ ] Tests

# DDL Backend

REST API for the DDL rental catalog: Go + [Gin](https://gin-gonic.com/) + PostgreSQL 17 (via [pgx](https://github.com/jackc/pgx)).

## Stack

- Go 1.25, Gin router
- PostgreSQL 17 (Docker Compose, isolated from any system Postgres)
- `jackc/pgx/v5` — driver + connection pool, no ORM
- Plain embedded SQL migrations, applied automatically on startup

## Getting started

```bash
cp .env.example .env       # adjust ports/credentials if needed
docker compose up -d       # starts Postgres 17 on localhost:5434
go run ./cmd/api           # applies migrations + seed data, serves on :8080 (see HTTP_PORT in .env)
```

The API listens on `HTTP_PORT` (default `8080`; the dev instance for this
project runs on `8082` because `8080`/`8090` were already taken locally —
adjust `.env` and the frontend's `NEXT_PUBLIC_API_URL` together).

## Project layout

```
cmd/api/main.go          entrypoint: config, DB pool, migrations, HTTP server
internal/config          env var loading
internal/db               connection pool + embedded SQL migration runner
internal/db/migrations    *.up.sql / *.down.sql files (schema + seed data)
internal/models           API/domain structs
internal/repository        all SQL lives here (pgx queries)
internal/handlers          Gin handlers — request validation, HTTP status codes
internal/router             route table + CORS
```

## API

| Method | Path                              | Notes |
| ------ | --------------------------------- | ----- |
| GET    | `/api/health`                     | liveness check |
| GET    | `/api/categories`                 | |
| GET    | `/api/categories/:id/subcategories` | |
| GET    | `/api/products?category=&subcategory=&limit=` | |
| GET    | `/api/products/:id`               | includes `gallery` + `related` |
| POST   | `/api/phone/send`                 | `{phone, channel}` → mock code, see below |
| POST   | `/api/phone/verify`               | `{phone, code}` → `{verified, token}` |
| POST   | `/api/cart/quote`                 | live totals for the cart page, no side effects |
| POST   | `/api/orders`                     | validates stock, decrements it, persists the order atomically |
| GET    | `/api/orders/:publicId`           | order lookup (confirmation screens) |

### Admin API (session-cookie auth)

| Method | Path                                    | Notes |
| ------ | ---------------------------------------- | ----- |
| POST   | `/api/admin/auth/login`                  | `{email, password}` → sets an httpOnly JWT cookie |
| POST   | `/api/admin/auth/logout`                 | clears the cookie |
| GET    | `/api/admin/auth/me`                     | 🔒 current admin user |
| GET    | `/api/admin/products`                    | 🔒 full product list (no filters) |
| POST   | `/api/admin/products`                    | 🔒 create |
| PUT    | `/api/admin/products/:id`                | 🔒 update |
| DELETE | `/api/admin/products/:id`                | 🔒 delete |
| GET    | `/api/admin/orders?status=`              | 🔒 list all orders |
| PATCH  | `/api/admin/orders/:publicId/status`     | 🔒 `{status: new\|confirmed\|cancelled}` |
| GET    | `/api/admin/users`                       | 🔒 list admin accounts |
| POST   | `/api/admin/users`                       | 🔒 create another admin account |

🔒 = requires the session cookie from `/api/admin/auth/login`, checked by the
`RequireAdmin` middleware. Passwords are bcrypt-hashed (`internal/auth`).

Seed admin account (see `0003_admin.up.sql`): **admin@ddl.ru / admin12345** —
change or remove this before any real deployment. The admin UI lives at
`/admin` on the frontend.

### Phone verification is mocked

There's no real Telegram/WhatsApp/SMS provider wired up. `POST /api/phone/send`
generates a 4-digit code, stores it, and returns it as `debugCode` in the
response so the flow is testable end-to-end without a real gateway. Swap
`internal/handlers/phone.go` for a real provider call before shipping this to
production, and drop `debugCode` from the response at that point.

### Pricing and stock are server-authoritative

`POST /api/orders` re-reads `price_day` and locks/checks `stock` inside the
same transaction as the insert (`SELECT ... FOR UPDATE`), so concurrent
checkouts can't oversell inventory and a tampered client-side price never
makes it into a persisted order.

## Migrations

Plain SQL files under `internal/db/migrations`, embedded into the binary and
applied in filename order on every startup (tracked in a `schema_migrations`
table, so re-running is a no-op). `0001_init.*` is the schema, `0002_seed.*`
seeds the catalog data that mirrors the frontend's original static dataset.

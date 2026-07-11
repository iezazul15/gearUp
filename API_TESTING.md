# GearUp API Testing Guide

## Base Setup

- **Base URL:** `http://localhost:<PORT>/api`
- **Content-Type:** `application/json`
- **Auth:** Protected routes accept:
  - `Authorization: Bearer <accessToken>`
  - or auth cookies (`accessToken`, `refreshToken`)

## Required Environment Variables

From `src/config/index.ts`:

- `DATABASE_URL`
- `PORT`
- `NODE_ENV`
- `APP_URL`
- `BCRYPT_SALT_ROUNDS`
- `JWT_ACCESS_TOKEN_SECRET`
- `JWT_ACCESS_TOKEN_EXPIRES_IN`
- `JWT_REFRESH_TOKEN_SECRET`
- `JWT_REFRESH_TOKEN_EXPIRES_IN`
- `STORE_ID`
- `STORE_PASSWORD`
- `SSLCOMMERZ_BASE_URL`

## Standard Response Shape

Success:

```json
{
  "success": true,
  "message": "Some message",
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Enums Used in Requests

- **Role:** `CUSTOMER | PROVIDER | ADMIN` (registration blocks ADMIN)
- **UserStatus:** `ACTIVE | SUSPENDED`
- **RentalStatus:** `PLACED | CONFIRMED | PAID | PICKED_UP | RETURNED | CANCELLED`

---

## 1) Health Check

### GET `/`

```bash
curl -X GET "http://localhost:8000/api/"
```

---

## 2) Auth

### POST `/auth/register`

```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahim",
    "email": "rahim.customer@example.com",
    "password": "Pass@1234",
    "role": "CUSTOMER"
  }'
```

### POST `/auth/login`

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rahim.customer@example.com",
    "password": "Pass@1234"
  }'
```

### GET `/auth/me` (Protected)

```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### PATCH `/auth/me` (Protected)

```bash
curl -X PATCH "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahim Updated",
    "phone": "01700000000",
    "address": "Dhaka",
    "bio": "Cycling enthusiast"
  }'
```

### POST `/auth/refresh-token`

Uses `refreshToken` cookie.

```bash
curl -X POST "http://localhost:8000/api/auth/refresh-token" \
  --cookie "refreshToken=<REFRESH_TOKEN>"
```

---

## 3) Categories

### GET `/categories`

```bash
curl -X GET "http://localhost:8000/api/categories"
```

### GET `/categories/:id`

```bash
curl -X GET "http://localhost:8000/api/categories/<CATEGORY_ID>"
```

### GET `/categories/admin/all` (ADMIN)

```bash
curl -X GET "http://localhost:8000/api/categories/admin/all" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

### POST `/categories` (ADMIN)

```bash
curl -X POST "http://localhost:8000/api/categories" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Camping",
    "description": "Camping and trekking gear"
  }'
```

### PATCH `/categories/:id` (ADMIN)

```bash
curl -X PATCH "http://localhost:8000/api/categories/<CATEGORY_ID>" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Camping & Hiking"
  }'
```

### DELETE `/categories/:id` (ADMIN)

```bash
curl -X DELETE "http://localhost:8000/api/categories/<CATEGORY_ID>" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

---

## 4) Gear (Public)

### GET `/gear`

Supported query params from service:
`search`, `categoryId`, `brand`, `minPrice`, `maxPrice`, `isAvailable`, `page`, `limit`

```bash
curl -X GET "http://localhost:8000/api/gear?search=tent&brand=Decathlon&minPrice=200&maxPrice=1500&isAvailable=true&page=1&limit=10"
```

### GET `/gear/:id`

```bash
curl -X GET "http://localhost:8000/api/gear/<GEAR_ID>"
```

---

## 5) Provider (PROVIDER)

### POST `/provider/gear`

```bash
curl -X POST "http://localhost:8000/api/provider/gear" \
  -H "Authorization: Bearer <PROVIDER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mountain Bike",
    "description": "27.5 inch hardtail",
    "brand": "Trek",
    "pricePerDay": 1200,
    "stock": 3,
    "isAvailable": true,
    "imageUrl": "https://example.com/bike.jpg",
    "categoryId": "<CATEGORY_ID>"
  }'
```

### PUT `/provider/gear/:id`

```bash
curl -X PUT "http://localhost:8000/api/provider/gear/<GEAR_ID>" \
  -H "Authorization: Bearer <PROVIDER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "pricePerDay": 1300,
    "stock": 5
  }'
```

### DELETE `/provider/gear/:id`

```bash
curl -X DELETE "http://localhost:8000/api/provider/gear/<GEAR_ID>" \
  -H "Authorization: Bearer <PROVIDER_ACCESS_TOKEN>"
```

### GET `/provider/orders`

```bash
curl -X GET "http://localhost:8000/api/provider/orders" \
  -H "Authorization: Bearer <PROVIDER_ACCESS_TOKEN>"
```

### PATCH `/provider/orders/:id`

```bash
curl -X PATCH "http://localhost:8000/api/provider/orders/<RENTAL_ORDER_ID>" \
  -H "Authorization: Bearer <PROVIDER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CONFIRMED"
  }'
```

---

## 6) Rentals (CUSTOMER unless noted)

### POST `/rentals`

```bash
curl -X POST "http://localhost:8000/api/rentals" \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2026-07-15T00:00:00.000Z",
    "endDate": "2026-07-18T00:00:00.000Z",
    "items": [
      { "gearItemId": "<GEAR_ID_1>", "quantity": 1 },
      { "gearItemId": "<GEAR_ID_2>", "quantity": 2 }
    ]
  }'
```

### GET `/rentals`

```bash
curl -X GET "http://localhost:8000/api/rentals" \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>"
```

### GET `/rentals/:id`

```bash
curl -X GET "http://localhost:8000/api/rentals/<RENTAL_ORDER_ID>" \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>"
```

### GET `/rentals/admin/all` (ADMIN)

```bash
curl -X GET "http://localhost:8000/api/rentals/admin/all" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

---

## 7) Reviews (CUSTOMER)

Only allowed when the rental order is `RETURNED`, belongs to the customer, and has no existing review.

### POST `/reviews`

```bash
curl -X POST "http://localhost:8000/api/reviews" \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "rentalOrderId": "<RENTAL_ORDER_ID>",
    "gearItemId": "<GEAR_ID_FROM_ORDER>",
    "rating": 5,
    "comment": "Great quality gear."
  }'
```

---

## 8) Payments

### POST `/payments/create` (CUSTOMER)

Current body from controller:

```json
{
  "rentalOrderId": "<RENTAL_ORDER_ID>"
}
```

Current service rules:

- rental order must exist
- rental order must belong to requester
- rental order status must be `PLACED`

```bash
curl -X POST "http://localhost:8000/api/payments/create" \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "rentalOrderId": "<RENTAL_ORDER_ID>"
  }'
```

### GET `/payments` (CUSTOMER)

```bash
curl -X GET "http://localhost:8000/api/payments" \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>"
```

### GET `/payments/:id` (CUSTOMER)

```bash
curl -X GET "http://localhost:8000/api/payments/<PAYMENT_ID>" \
  -H "Authorization: Bearer <CUSTOMER_ACCESS_TOKEN>"
```

---

## 9) Admin (ADMIN)

### GET `/admin/users`

```bash
curl -X GET "http://localhost:8000/api/admin/users" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

### PATCH `/admin/users/:id`

```bash
curl -X PATCH "http://localhost:8000/api/admin/users/<USER_ID>" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SUSPENDED"
  }'
```

### GET `/admin/gear`

```bash
curl -X GET "http://localhost:8000/api/admin/gear" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

### GET `/admin/rentals`

```bash
curl -X GET "http://localhost:8000/api/admin/rentals" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

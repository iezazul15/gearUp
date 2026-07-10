# GearUp API

A RESTful backend API for an outdoor gear rental platform where customers can rent equipment, providers can manage rental inventory, and administrators can oversee the entire system.

## Features

- 🔐 JWT Authentication
- 🍪 Cookie-based Authentication
- 🔄 Refresh Token Support
- 👥 Role-based Authorization (Customer, Provider, Admin)
- 🏕️ Gear Management
- 📂 Category Management
- 📦 Rental Order Management
- 💳 SSLCommerz Payment Integration
- ⭐ Review System
- 🔍 Search & Filtering
- 📄 Pagination & Sorting
- ✅ Request Validation
- ⚠️ Global Error Handling

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- Bcrypt
- SSLCommerz

---

## User Roles

### Customer

- Register and login
- Browse available gear
- Search and filter gear
- Place rental orders
- Make payments
- View rental history
- Leave reviews after completed rentals

### Provider

- Add rental gear
- Update gear information
- Manage inventory
- View incoming rental orders
- Update rental order status

### Admin

- Manage users
- Manage categories
- Monitor all gear
- View all rental orders
- Suspend or activate users

---

## Project Structure

```text
.
├── prisma
│   ├── category.prisma
│   ├── enum.prisma
│   ├── gearItem.prisma
│   ├── payment.prisma
│   ├── profile.prisma
│   ├── rentalOrder.prisma
│   ├── review.prisma
│   ├── schema.prisma
│   └── user.prisma
│
├── src
│   ├── config
│   ├── lib
│   ├── middlewares
│   ├── modules
│   ├── routes
│   ├── types
│   ├── utils
│   ├── app.ts
│   └── server.ts
│
├── .env.example
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

---

## Database

- PostgreSQL
- Prisma ORM

### Main Models

- User
- Profile
- Category
- GearItem
- RentalOrder
- Payment
- Review

---

## Getting Started

### Clone the repository

```bash
git clone <repository-url>
cd GearUp
```

### Install dependencies

Using pnpm

```bash
pnpm install
```

or npm

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
DATABASE_URL=YOUR_DATABASE_URL
PORT=YOUR_PORT
NODE_ENV=YOUR_NODE_ENV
APP_URL=YOUR_APP_URL

BCRYPT_SALT_ROUNDS=YOUR_BCRYPT_SALT_ROUNDS

JWT_ACCESS_TOKEN_SECRET=YOUR_JWT_ACCESS_TOKEN_SECRET
JWT_ACCESS_TOKEN_EXPIRES_IN=YOUR_JWT_ACCESS_TOKEN_EXPIRES_IN

JWT_REFRESH_TOKEN_SECRET=YOUR_JWT_REFRESH_TOKEN_SECRET
JWT_REFRESH_TOKEN_EXPIRES_IN=YOUR_JWT_REFRESH_TOKEN_EXPIRES_IN

SSLCOMMERZ_BASE_URL=SSLCOMMERZ_BASE_URL
STORE_ID=YOUR_STORE_ID
STORE_PASSWORD=YOUR_STORE_PASSWORD
```

---

## Prisma

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

---

## Run the Application

Development

```bash
pnpm dev
```

Build

```bash
pnpm build
```

Production

```bash
pnpm start
```

The server will start at

```
http://localhost:<PORT>/api
```

---

## API Modules

- Authentication
- Categories
- Gear
- Provider
- Rentals
- Reviews
- Payments
- Admin

---

## Authentication

Protected routes require an access token.

```
Authorization: Bearer <access_token>
```

The API also supports authentication using cookies for access and refresh tokens.

---

## Standard Response Format

### Success

```json
{
  "success": true,
  "message": "Request successful",
  "data": {},
  "meta": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}
```

---

## Available Scripts

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start development server |
| `pnpm build` | Build the project        |
| `pnpm start` | Start production server  |

---

## Future Improvements

- Image upload for gear items
- Email notifications
- Wishlist functionality
- Provider analytics dashboard
- Unit and integration tests
- Docker support

---

## License

This project is licensed under the ISC License.

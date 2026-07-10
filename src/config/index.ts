import dotenv from "dotenv";
import path from "path";
import { cwd } from "process";

dotenv.config({
  quiet: true,
  path: path.join(cwd(), ".env"),
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables");
}

if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables");
}

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is not defined in the environment variables");
}

if (!process.env.APP_URL) {
  throw new Error("APP_URL is not defined in the environment variables");
}

if (!process.env.BCRYPT_SALT_ROUNDS) {
  throw new Error(
    "BCRYPT_SALT_ROUNDS is not defined in the environment variables",
  );
}

if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
  throw new Error(
    "JWT_ACCESS_TOKEN_SECRET is not defined in the environment variables",
  );
}

if (!process.env.JWT_ACCESS_TOKEN_EXPIRES_IN) {
  throw new Error(
    "JWT_ACCESS_TOKEN_EXPIRES_IN is not defined in the environment variables",
  );
}

if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
  throw new Error(
    "JWT_REFRESH_TOKEN_SECRET is not defined in the environment variables",
  );
}

if (!process.env.JWT_REFRESH_TOKEN_EXPIRES_IN) {
  throw new Error(
    "JWT_REFRESH_TOKEN_EXPIRES_IN is not defined in the environment variables",
  );
}

if (!process.env.STORE_ID) {
  throw new Error("STORE_ID is not defined in the environment variables");
}

if (!process.env.STORE_PASSWORD) {
  throw new Error("STORE_PASSWORD is not defined in the environment variables");
}

if (!process.env.SSLCOMMERZ_BASE_URL) {
  throw new Error("STORE_URL is not defined in the environment variables");
}

const config = {
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT || 8000,
  node_env: process.env.NODE_ENV,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
  jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET!,
  jwt_refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  store_id: process.env.STORE_ID!,
  store_password: process.env.STORE_PASSWORD!,
  sslcommerz_base_url: process.env.SSLCOMMERZ_BASE_URL!,
};

export default config;

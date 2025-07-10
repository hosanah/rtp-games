import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (DB_HOST && DB_PORT && DB_NAME && DB_USER && DB_PASSWORD) {
    process.env.DATABASE_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  }
}

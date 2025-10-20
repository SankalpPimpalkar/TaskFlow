import { configDotenv } from "dotenv";
configDotenv({ path: `.env.${process.env.NODE_ENV || 'development'}` })

export const PORT = process.env.PORT || 5050
export const NODE_ENV = process.env.NODE_ENV

export const DB_NAME = process.env.DB_NAME
export const DB_URL = process.env.DB_URL
export const JWT_SECRET = process.env.JWT_SECRET
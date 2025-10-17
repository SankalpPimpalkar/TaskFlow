import { configDotenv } from "dotenv";
configDotenv()

export const PORT = process.env.PORT || 5050

export const DB_NAME = process.env.DB_NAME
export const DB_URL = process.env.DB_URL
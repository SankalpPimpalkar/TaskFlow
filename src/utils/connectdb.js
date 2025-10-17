import mongoose from "mongoose";
import { DB_NAME, DB_URL } from "../constants/index.js";

export default async function connectdb() {
    try {

        const url = DB_URL || null;

        if (!url) {
            throw new Error("Mongodb URI not found")
        }

        const response = await mongoose.connect(url, { dbName: DB_NAME })

        console.group('\nDB LOGS')
        console.log('Mongodb Connection established')
        console.log(`Host: ${response.connection.host}`)
        console.log(`Name: ${response.connection.name}`)
        console.groupEnd()

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Mongodb Connection Failed ${error.message}`)
        } else {
            throw new Error("Mongodb Connection Failed (Unknown error)")
        }
    }
}
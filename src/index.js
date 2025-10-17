import express from "express";
import connectdb from "./utils/connectdb.js";
import { PORT } from "./constants/index.js";
import { seedDatabase } from "./controllers/seed.controller.js";

const app = express()

// Seeding
app.get('/api/v1/seed', seedDatabase)

app.listen(PORT, async () => {
    await connectdb();
    console.log(`\nServer is listening at http://localhost:${PORT}`);
})
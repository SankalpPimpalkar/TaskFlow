import express from "express";
import connectdb from "./utils/connectdb.js";
import AuthRouter from "./routes/auth.route.js";
import { PORT } from "./constants/index.js";
import { seedDatabase } from "./controllers/seed.controller.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from "path";
import cors from "cors";
import fs from "fs";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import ProjectRouter from "./routes/project.route.js";
import TaskRouter from "./routes/task.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Check if openapi.json exists first
const swaggerPath = join(__dirname, 'doc', 'openapi.json');
console.log(swaggerPath)

if (!fs.existsSync(swaggerPath)) {
    console.error("Error: openapi.json not found at", swaggerPath);
    process.exit(1);
}

const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Routes
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/project', ProjectRouter);
app.use('/api/v1/task', TaskRouter);

// Serve Swagger UI at home route
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Optional: raw JSON route
app.use('/openapi.json', express.static(swaggerPath));

// Seed route
app.get('/api/v1/seed', seedDatabase);

// Start server
app.listen(PORT, async () => {
    await connectdb();
    console.log(`\nServer is listening at http://localhost:${PORT}`);
});

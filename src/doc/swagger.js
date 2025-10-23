import swaggerAutogen from "swagger-autogen";
import { PORT } from "../constants/index.js";

const doc = {
    info: {
        title: 'My Backend API',
        description: 'API documentation for my backend project',
    },
    servers: [
        {
            url: process.env.NODE_ENV === 'production'
                ? 'https://taskflow-0qa3.onrender.com'
                : `http://localhost:${PORT}`,
            description: process.env.NODE_ENV === 'production'
                ? 'Production server'
                : 'Local dev server'
        }
    ],
    schemes: ['http', 'https'],
    // tags: [
    //     {
    //         name: 'Auth',
    //         description: 'Endpoints related to user authentication (register, login, logout)',
    //     },
    //     {
    //         name: 'Database',
    //         description: 'Endpoints related to seeding and database operations',
    //     },
    // ],
};

const outputFile = './openapi.json';

const endpointsFiles = [
    '../index.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc);

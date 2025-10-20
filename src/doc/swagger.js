import swaggerAutogen from "swagger-autogen";
import { PORT } from "../src/constants/index.js";

const doc = {
    info: {
        title: 'My Backend API',
        description: 'API documentation for my backend project',
    },
    host: `localhost:${PORT}`,
    schemes: ['http', 'https'],
    tags: [
        {
            name: 'Auth',
            description: 'Endpoints related to user authentication (register, login, logout)',
        },
        {
            name: 'Database',
            description: 'Endpoints related to seeding and database operations',
        },
    ],
};

const outputFile = './openapi.json';

const endpointsFiles = [
    '../src/index.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc);

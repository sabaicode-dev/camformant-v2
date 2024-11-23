import { globalErrorHandler } from '@/src/middlewares/global-error';
import loggerMiddleware from '@/src/middlewares/logger-middleware';
import { RegisterRoutes } from '@/src/routes/v1/routes';
import cookieParser from 'cookie-parser';
import express from 'express';
import fs from 'fs';
import path from 'path'
import cors from "cors";
import swaggerUi from "swagger-ui-express";

// Dynamically load swagger.json & Initialize Sentry
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'docs/swagger.json'), 'utf8'));


const app = express()
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: 'GET,POST,PUT,DELETE', // Specify allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization' // Specify allowed headers
};
app.use(cors(corsOptions));
// ================================
// Security Middleware
// ================================

// ================================
// Global Middleware
// ================================
app.use(cookieParser())
app.use(express.json());
app.use(loggerMiddleware);


// ================================
// Global Routes
// ================================
RegisterRoutes(app);

// ========================
// API Documentations
// ========================
app.use("/jobs-api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// ================================
// Global Error Handler
// ================================
app.use(globalErrorHandler);

export default app;
import express from 'express';
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from '@/src/routes/v1/routes';
import fs from 'fs';
import path from 'path'
import { globalErrorHandler } from '@/src/middlewares/global-error';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Dynamically load swagger.json
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'docs/swagger.json'), 'utf8'));

// ========================
// Initialize App Express
// ========================

const app = express();
  // CORS configuration
  const corsOptions = {
    origin: ' http://localhost:3000', // Allow requests from all origin
    methods: 'GET,POST,PUT,DELETE', // Specify allowed HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Specify allowed headers
    credentials: true,
  };
  
  // Apply the CORS middleware
  app.use(cors(corsOptions))
// =======================
// Security Middlewares
// =======================
app.use(cookieParser())


// ========================
// Commons Middleware
// ========================
app.use(express.json());


// ========================
// Global API V1
// ========================
RegisterRoutes(app)


// ========================
// API Documentations
// ========================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// ========================
// ERROR Handler
// ========================
app.use(globalErrorHandler)

export default app;
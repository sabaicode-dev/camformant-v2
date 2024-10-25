// MUST ADD THIS SENTRY ABOVE ALL OTHER MODULES
import "@/src/utils/sentry";

import express from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "@/src/routes/v1/routes";
import fs from "fs";
import path from "path";
import { globalErrorHandler } from "@/src/middewares/global-error";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";
// import cors from "cors";
// Dynamically load swagger.json & Initialize Sentry
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "docs/swagger.json"), "utf8")
);

// ========================
// Initialize App Express
// ========================
const app = express();
// CORS configuration
// const corsOptions = {
//   origin: '*', // Allow requests from all origin
//   methods: 'GET,POST,PUT,DELETE', // Specify allowed HTTP methods
//   allowedHeaders: 'Content-Type,Authorization' // Specify allowed headers
// };

// // Apply the CORS middleware
// app.use(cors(corsOptions))
// ========================
// Security Middleware
// ========================
app.use(cookieParser());

// ========================
// Global Middleware
// ========================
app.use(express.json());

// ========================
// Global API V1
// ========================
RegisterRoutes(app);

// ========================
// API Documentations
// ========================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ========================
// ERROR Handler
// ========================
Sentry.setupExpressErrorHandler(app);
app.use(globalErrorHandler);

export default app;

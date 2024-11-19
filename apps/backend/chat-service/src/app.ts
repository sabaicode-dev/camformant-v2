import express from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "@/src/routes/v1/routes";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
// import cors from "cors"
// Dynamically load swagger.json
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
//   allowedHeaders: 'Content-Type,Authorization' ,// Specify allowed headers
//   Credential:true
// };

// Apply the CORS middleware
// app.use(cors(corsOptions))
// ========================
// Global Middleware
// ========================
app.use(cookieParser());
app.use(express.json()); // Help to get the json from request body

// ========================
// Global API V1
// ========================
RegisterRoutes(app);

// ========================
// API Documentations
// ========================
app.use("/v1/chat/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ========================
// ERROR Handler
// ========================
// Handle Later

export default app;

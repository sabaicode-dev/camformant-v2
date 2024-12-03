import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import { RegisterRoutes } from "@/src/routes/v1/routes";
import { globalErrorHandler } from "@/src/middlewares/global-error";
// import cors from "cors";
// Dynamically load swagger.json
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "docs/swagger.json"), "utf8")
);

// ========================
// Initialize App Express
// ========================
const app = express();
app.use((_req, _res, next) => {
  console.log("reached notiiiiiiii service");
  next();
});
// CORS configuration
// const corsOptions = {
//   origin: "*", // Allow requests from all origin
//   methods: "GET,POST,PUT,DELETE", // Specify allowed HTTP methods
//   allowedHeaders: "Content-Type,Authorization", // Specify allowed headers
// };

// Apply the CORS middleware
// app.use(cors(corsOptions));
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
app.use("/user-api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ========================
// ERROR Handler
// ========================
app.use(globalErrorHandler);

export default app;

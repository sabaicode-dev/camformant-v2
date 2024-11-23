import express, { Request, Response } from "express";
import { globalErrorHandler } from "@/src/middlewares/global-error";
import applyProxy from "@/src/middlewares/proxy";
import cookieParser from "cookie-parser";
import {
  authenticateToken,
  authorizeRole,
  routeConfigMiddleware,
} from "@/src/middlewares/auth";
import cors from "cors";
import corsOptions from "@/src/middlewares/cors";

// ========================
// Initialize App Express
// ========================
const app = express();

// ========================
// Security Middleware
// ========================
app.use((_req, _res, next) => {
  console.log("Reach api getway1");
  next();
});
//
app.use(cors(corsOptions));
//
app.use(cookieParser());
app.use((_req, _res, next) => {
  console.log("Reach api getway");
  next();
});
// ========================
// Gateway Health
// ========================
app.get("/v1/gateway-health", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "OK",
  });
});

// ================G========
// Auth Middleware
// ========================
app.use(routeConfigMiddleware);
app.use(authenticateToken);
//bug: stuck auth role
app.use(authorizeRole);
app.use((_req, _res, next) => {
  console.log("Reach api getway 3");
  next();
});
// =======================
// Proxy Routes
// =======================
applyProxy(app);

// ========================
// ERROR Handler
// ========================
app.use(globalErrorHandler);

export default app;

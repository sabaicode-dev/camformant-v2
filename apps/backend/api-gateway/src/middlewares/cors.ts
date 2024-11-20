import configs from "@/src/config";
import { CorsOptions } from "cors";

// Define the two allowed origins
export const allowedOrigins: string[] = [
  configs.clientUrl,
  "http://localhost:5000",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin!) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS!"));
    }
  },
  credentials: true, // Allow credentials like cookies
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"], // Allowed HTTP methods
};

export const corsOptions2 = {
  origin: [configs.clientUrl],
  // origin: ["http://localhost:5000"],
  credentials: true, // Request includes credentials like cookies
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
};

console.log("Allowed Origins:", allowedOrigins);

export default corsOptions;

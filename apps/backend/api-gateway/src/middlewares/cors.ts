import configs from "@/src/config";
import { CorsOptions } from "cors";

// Define the two allowed origins
export const allowedOrigins: string[] = [
  configs.clientUrl,
  configs.corporatorUrl,
  configs.adminUrl,
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin!) || !origin) {
      callback(null, true);
    } else {
      console.log("error origin cors");

      callback(new Error("Not allowed by CORS!"));
    }
  },
  credentials: true, // Allow credentials like cookies
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"], // Allowed HTTP methods
};

// console.log("Allowed Origins:", allowedOrigins);

export default corsOptions;

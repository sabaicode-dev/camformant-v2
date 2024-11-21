import configs from "@/src/config";

const corsOptions = {
  origin: [configs.clientUrl],
  // origin: ["http://localhost:5000"],
  credentials: true, // Request includes credentials like cookies
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
};

console.log("corsOption:::", corsOptions);

export default corsOptions;

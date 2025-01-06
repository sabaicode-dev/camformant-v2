import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

type Config = {
  port: number;
  mongodbUrl: string;
  clientUrl: string;
  notification_api_endpoint: string;
  corporator_api_endpoint: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
};

// Function to load and validate environment variables
function loadConfig(): Config {
  // Determine the environment and set the appropriate .env file
  const env = process.env.NODE_ENV || "development";
  console.log("env", env);
  const envPath = path.resolve(__dirname, `./configs/.env.${env}`);
  dotenv.config({ path: envPath });

  // Define a schema for the environment variables
  const envVarsSchema = Joi.object({
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required(),
    CLIENT_URL: Joi.string().required(),
    CORPORATOR_API_ENDPOINT: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    NOTIFICATION_SERVICE_API_ENDPOINT: Joi.string().required(),
  })
    .unknown()
    .required();

  // Validate the environment variables
  const { value: envVars, error } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    port: envVars.PORT,
    mongodbUrl: envVars.MONGODB_URL,
    clientUrl: envVars.CLIENT_URL,
    corporator_api_endpoint: envVars.CORPORATOR_API_ENDPOINT,
    awsAccessKeyId: envVars.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    notification_api_endpoint: envVars.NOTIFICATION_SERVICE_API_ENDPOINT,
  };
}

// Export the loaded configuration
const configs = loadConfig();
export default configs;

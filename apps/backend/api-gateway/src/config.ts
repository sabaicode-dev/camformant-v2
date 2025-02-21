import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

type Config = {
  env: string;
  port: number;
  clientUrl: string;
  corporatorUrl: string;
  adminUrl:string
  authServiceUrl: string;
  userServiceUrl: string;
  jobServiceUrl: string;
  chatServiceUrl: string;
  awsCloudwatchLogsRegion: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsCloudwatchLogsGroupName: string;
  awsCognitoUserPoolId: string;
  awsCognitoClientId: string;
  notificationServiceUrl: string;
};

// Function to load and validate environment variables
function loadConfig(): Config {
  // Determine the environment and set the appropriate .env file
  const env = process.env.NODE_ENV || "development";
  const envPath = path.resolve(__dirname, `./configs/.env.${env}`);
  dotenv.config({ path: envPath });

  // Define a schema for the environment variables
  const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().required(),
    PORT: Joi.number().default(3000),
    CLIENT_URL: Joi.string().required(),
    CORPORATOR_URL: Joi.string().required(),
    ADMIN_URL:Joi.string().required(),
    AUTH_SERVICE_URL: Joi.string().required(),
    USER_SERVICE_URL: Joi.string().required(),
    JOB_SERVICE_URL: Joi.string().required(),
    CHAT_SERVICE_URL: Joi.string().required(),
    AWS_CLOUDWATCH_LOGS_REGION: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_CLOUDWATCH_LOGS_GROUP_NAME: Joi.string().required(),
    AWS_COGNITO_USER_POOL_ID: Joi.string().required(),
    AWS_COGNITO_CLIENT_ID: Joi.string().required(),
    NOTIFICATION_SERVICE_URL: Joi.string().required(),
  })
    .unknown()
    .required();

  // Validate the environment variables
  const { value: envVars, error } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    clientUrl: envVars.CLIENT_URL,
    corporatorUrl: envVars.CORPORATOR_URL,
    adminUrl:envVars.ADMIN_URL,
    authServiceUrl: envVars.AUTH_SERVICE_URL,
    userServiceUrl: envVars.USER_SERVICE_URL,
    jobServiceUrl: envVars.JOB_SERVICE_URL,
    chatServiceUrl: envVars.CHAT_SERVICE_URL,
    awsCloudwatchLogsRegion: envVars.AWS_CLOUDWATCH_LOGS_REGION,
    awsAccessKeyId: envVars.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    awsCloudwatchLogsGroupName: envVars.AWS_CLOUDWATCH_LOGS_GROUP_NAME,
    awsCognitoUserPoolId: envVars.AWS_COGNITO_USER_POOL_ID,
    awsCognitoClientId: envVars.AWS_COGNITO_CLIENT_ID,
    notificationServiceUrl: envVars.NOTIFICATION_SERVICE_URL,
  };
}

// Export the loaded configuration
const configs = loadConfig();
export default configs;

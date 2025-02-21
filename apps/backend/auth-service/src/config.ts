import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

type Config = {
  port: number;
  awsCognitoRegion: string;
  awsCognitoUserPoolId: string;
  awsCognitoClientId: string;
  awsCognitoClientSecret: string;
  awsCognitoDomain: string;
  awsRedirectUri: string;
  corporatorUrl: string;
  userServiceUrl: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  gmailUser: string;
  gmailAppPassowrd: string;
  clientUrl: string;
};

// Function to load and validate environment variables
function loadConfig(): Config {
  // Determine the environment and set the appropriate .env file
  const env = process.env.NODE_ENV || "development";
  const envPath = path.resolve(__dirname, `./configs/.env.${env}`);
  dotenv.config({ path: envPath });

  // Define a schema for the environment variables
  const envVarsSchema = Joi.object({
    PORT: Joi.number().default(3000),
    AWS_COGNITO_REGION: Joi.string().required(),
    AWS_COGNITO_USER_POOL_ID: Joi.string().required(),
    AWS_COGNITO_CLIENT_ID: Joi.string().required(),
    AWS_COGNITO_CLIENT_SECRET: Joi.string().required(),
    AWS_COGNITO_DOMAIN: Joi.string().required(),
    AWS_REDIRECT_URI: Joi.string().required(),
    USER_SERVICE_URL: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    GMAIL_USER: Joi.string().required(),
    GMAIL_APP_PASSWORD: Joi.string().required(),
    CLIENT_URL: Joi.string().required(),
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
    awsCognitoRegion: envVars.AWS_COGNITO_REGION,
    awsCognitoUserPoolId: envVars.AWS_COGNITO_USER_POOL_ID,
    awsCognitoClientId: envVars.AWS_COGNITO_CLIENT_ID,
    awsCognitoClientSecret: envVars.AWS_COGNITO_CLIENT_SECRET,
    awsCognitoDomain: envVars.AWS_COGNITO_DOMAIN,
    awsRedirectUri: envVars.AWS_REDIRECT_URI,
    corporatorUrl: envVars.CORPORATOR_URL,
    userServiceUrl: envVars.USER_SERVICE_URL,
    awsAccessKeyId: envVars.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    gmailUser: envVars.GMAIL_USER,
    gmailAppPassowrd: envVars.GMAIL_APP_PASSWORD,
    clientUrl: envVars.CLIENT_URL,
  };
}

// Export the loaded configuration
const configs = loadConfig();
export default configs;

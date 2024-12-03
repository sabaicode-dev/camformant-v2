import * as Sentry from "@sentry/node";
import configs from "@/src/config";
// import { nodeProfilingIntegration } from "@sentry/profiling-node";


// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: configs.glitchtipDNS,
  environment: configs.env || 'development',
  integrations: [
    // Add our Profiling integration
    // nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

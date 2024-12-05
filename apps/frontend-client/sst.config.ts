import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "camformant-client-app",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        environment: {
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
          NEXT_PUBLIC_AUTH_ENDPOINT:
            process.env.NEXT_PUBLIC_AUTH_ENDPOINT || "",
          NEXT_PUBLIC_CORPORATE_ENDPOINT:
            process.env.NEXT_PUBLIC_CORPORATE_ENDPOINT || "",
          NEXT_PUBLIC_USER_ENDPOINT:
            process.env.NEXT_PUBLIC_USER_ENDPOINT || "",
          NEXT_PUBLIC_JOB_ENDPOINT: process.env.NEXT_PUBLIC_JOB_ENDPOINT || "",
          NEXT_PUBLIC_COMPANY_ENDPOINT:
            process.env.NEXT_PUBLIC_COMPANY_ENDPOINT || "",
          NEXT_PUBLIC_PUSH_NOTIFICATION_ENDPOINT:
            process.env.NEXT_PUBLIC_PUSH_NOTIFICATION_ENDPOINT || "",
          NEXT_PUBLIC_CONVERSATION_ENDPOINT:
            process.env.NEXT_PUBLIC_CONVERSATION_ENDPOINT || "",
          UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN || "",
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;

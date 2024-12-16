/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "camformant-client",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("MyWeb", {
      environment: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
        NEXT_PUBLIC_AUTH_ENDPOINT: process.env.NEXT_PUBLIC_AUTH_ENDPOINT || "",
        NEXT_PUBLIC_USER_ENDPOINT: process.env.NEXT_PUBLIC_USER_ENDPOINT || "",
        NEXT_PUBLIC_JOB_ENDPOINT: process.env.NEXT_PUBLIC_JOB_ENDPOINT || "",
        NEXT_PUBLIC_COMPANY_ENDPOINT:
          process.env.NEXT_PUBLIC_COMPANY_ENDPOINT || "",
        NEXT_PUBLIC_PUSH_NOTIFICATION_ENDPOINT:
          process.env.NEXT_PUBLIC_PUSH_NOTIFICATION_ENDPOINT || "",
        NEXT_PUBLIC_VAPID_PUBLIC_KEY:
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
        NEXT_PUBLIC_CONVERSATION_ENDPOINT:
          process.env.NEXT_PUBLIC_CONVERSATION_ENDPOINT || "",
        UPLOADTHING_TOKEN: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      },
    });
  },
});

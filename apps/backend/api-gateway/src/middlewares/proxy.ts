import ROUTE_PATHS from "@/src/route-defs";
// import { logRequest } from "@/src/utils/logger";
import express, { Response } from "express";
import { ClientRequest, IncomingMessage } from "http";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
// import { gatewayLogger } from "@/src/server";
import corsOptions, { allowedOrigins } from "@/src/middlewares/cors";

interface ProxyConfig {
  [context: string]: Options<IncomingMessage, Response>;
}

const proxyConfigs: ProxyConfig = {
  [ROUTE_PATHS.AUTH_SERVICE.path]: {
    target: ROUTE_PATHS.AUTH_SERVICE.target,
    pathRewrite: (path, _req) => {
      return `${ROUTE_PATHS.AUTH_SERVICE.path}${path}`;
    },
    on: {
      proxyReq: (
        _proxyReq: ClientRequest,
        _req: IncomingMessage,
        _res: Response
      ) => {
        // @ts-ignore
        // logRequest(gatewayLogger, proxyReq, {
        //   protocol: proxyReq.protocol,
        //   host: proxyReq.getHeader('host'),
        //   path: proxyReq.path
        // });
      },
      proxyRes: (_proxyRes, req, res) => {
        const requestOrigin = req.headers.origin;
        if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
          res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          (corsOptions!.methods as string[]).join(", ")
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
      },
    },
  },

  [ROUTE_PATHS.JOB_SERVICE.path]: {
    target: ROUTE_PATHS.JOB_SERVICE.target,
    pathRewrite: (path, _req) => `${ROUTE_PATHS.JOB_SERVICE.path}${path}`,
    on: {
      proxyReq: (
        _proxyReq: ClientRequest,
        _req: IncomingMessage,
        _res: Response
      ) => {
        // @ts-ignore
        // logRequest(gatewayLogger, proxyReq, {
        //   protocol: proxyReq.protocol,
        //   host: proxyReq.getHeader("host"),
        //   path: proxyReq.path,
        // });
      },
      proxyRes: (_proxyRes, req, res) => {
        const requestOrigin = req.headers.origin;
        if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
          res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          (corsOptions!.methods as string[]).join(", ")
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
      },
    },
  },
  [ROUTE_PATHS.NOTIFICATION_SERVICE.path]: {
    target: ROUTE_PATHS.NOTIFICATION_SERVICE.target,
    pathRewrite: (path, _req) => {
      return `${ROUTE_PATHS.NOTIFICATION_SERVICE.path}${path}`;
    },
    on: {
      proxyReq: (
        proxyReq: ClientRequest,
        req: IncomingMessage & {
          currentUser?: {
            username?: string;
            role: string[] | undefined;
          };
        },
        _res: Response
      ) => {
        const { currentUser } = req;

        if (currentUser) {
          // Add headers to proxyReq for forwarding to the target service
          proxyReq.setHeader("currentUser", JSON.stringify(currentUser)); // Another header as specified
        }

        // @ts-ignore
        // logRequest(gatewayLogger, proxyReq, {
        //   protocol: proxyReq.protocol,
        //   host: proxyReq.getHeader("host"),
        //   path: proxyReq.path,
        // });
      },
      proxyRes: (_proxyRes, req, res) => {
        const requestOrigin = req.headers.origin;
        if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
          res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          (corsOptions!.methods as string[]).join(", ")
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
      },
    },
  },
  [ROUTE_PATHS.USER_SERVICE.path]: {
    target: ROUTE_PATHS.USER_SERVICE.target,
    pathRewrite: (path, _req) => `${ROUTE_PATHS.USER_SERVICE.path}${path}`,
    on: {
      proxyReq: (
        _proxyReq: ClientRequest,
        _req: IncomingMessage,
        _res: Response
      ) => {
        // @ts-ignore
        // logRequest(gatewayLogger, proxyReq, {
        //   protocol: proxyReq.protocol,
        //   host: proxyReq.getHeader("host"),
        //   path: proxyReq.path,
        // });
      },
      proxyRes: (_proxyRes, req, res) => {
        const requestOrigin = req.headers.origin;
        if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
          res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          (corsOptions!.methods as string[]).join(", ")
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
      },
    },
  },
  [ROUTE_PATHS.JOB_SERVICE.path]: {
    target: ROUTE_PATHS.JOB_SERVICE.target,
    pathRewrite: (path, _req) => `${ROUTE_PATHS.JOB_SERVICE.path}${path}`,
    on: {
      proxyReq: (
        _proxyReq: ClientRequest,
        _req: IncomingMessage,
        _res: Response
      ) => {
        // @ts-ignore
        // logRequest(gatewayLogger, proxyReq, {
        //   protocol: proxyReq.protocol,
        //   host: proxyReq.getHeader("host"),
        //   path: proxyReq.path,
        // });
      },
      proxyRes: (_proxyRes, req, res) => {
        const requestOrigin = req.headers.origin;
        if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
          res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          (corsOptions!.methods as string[]).join(", ")
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
      },
    },
  },
  [ROUTE_PATHS.COMPANY_SERVICE.path]: {
    target: ROUTE_PATHS.COMPANY_SERVICE.target,
    pathRewrite: (path, _req) => `${ROUTE_PATHS.COMPANY_SERVICE.path}${path}`,
    on: {
      proxyReq: (
        _proxyReq: ClientRequest,
        _req: IncomingMessage,
        _res: Response
      ) => {
        // @ts-ignore
        // logRequest(gatewayLogger, proxyReq, {
        //   protocol: proxyReq.protocol,
        //   host: proxyReq.getHeader("host"),
        //   path: proxyReq.path,
        // });
      },
      proxyRes: (_proxyRes, req, res) => {
        const requestOrigin = req.headers.origin;
        if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
          res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          (corsOptions!.methods as string[]).join(", ")
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
      },
    },
  },

  [ROUTE_PATHS.CONVERSATION.path]: {
    target: ROUTE_PATHS.CONVERSATION.target,
    pathRewrite: (path, _req) => `${ROUTE_PATHS.CONVERSATION.path}${path}`,
    on: {
      proxyReq: (
        proxyReq: ClientRequest,
        req: IncomingMessage & {
          currentUser?: {
            username?: string;
            role: string[] | undefined;
          };
        },
        _res: Response
      ) => {
        const { currentUser } = req;

        if (currentUser) {
          // Add headers to proxyReq for forwarding to the target service
          proxyReq.setHeader("currentUser", JSON.stringify(currentUser)); // Another header as specified
        }
        // @ts-ignore
        // logRequest(gatewayLogger, proxyReq, {
        //   protocol: proxyReq.protocol,
        //   host: proxyReq.getHeader("host"),
        //   path: proxyReq.path,
        // });
      },
      proxyRes: (_proxyRes, req, res) => {
        const requestOrigin = req.headers.origin;
        if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
          res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          (corsOptions!.methods as string[]).join(", ")
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
      },
    },
  },
  [ROUTE_PATHS.CORPORATE_SERVICE.path]: {
    target: ROUTE_PATHS.CORPORATE_SERVICE.target,
    pathRewrite: (path, _req) => {
      return `${ROUTE_PATHS.CORPORATE_SERVICE.path}${path}`;
    },
    on: {
      proxyReq: (
        proxyReq: ClientRequest,
        req: IncomingMessage & {
          currentUser?: {
            username?: string;
            role: string[] | undefined;
          };
        },
        _res: Response
      ) => {
        const { currentUser } = req;

        if (currentUser) {
          // Add headers to proxyReq for forwarding to the target service
          proxyReq.setHeader("currentUser", JSON.stringify(currentUser)); // Another header as specified
        }

        // @ts-ignore
        // logRequest(gatewayLogger, proxyReq, {
        //   protocol: proxyReq.protocol,
        //   host: proxyReq.getHeader("host"),
        //   path: proxyReq.path,
        // });
      },
      proxyRes: (_proxyRes, req, res) => {
        const requestOrigin = req.headers.origin;
        if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
          res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          (corsOptions!.methods as string[]).join(", ")
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
      },
    },
  },
  [ROUTE_PATHS.ADMIN_SERVICE.path]: {
    target: ROUTE_PATHS.ADMIN_SERVICE.target,
    pathRewrite: (path, _req) => {
      return `${ROUTE_PATHS.ADMIN_SERVICE.path}${path}`;
    },
    on: {
      proxyReq: (
        proxyReq: ClientRequest,
        req: IncomingMessage & {
          currentUser?: {
            username?: string;
            role: string[] | undefined;
          };
        },
        _res: Response
      ) => {
        const { currentUser } = req;

        if (currentUser) {
          // Add headers to proxyReq for forwarding to the target service
          proxyReq.setHeader("currentUser", JSON.stringify(currentUser)); // Another header as specified
        }
      },
      proxyRes: (_proxyRes, req, res) => {
        const requestOrigin = req.headers.origin;
        if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
          res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          (corsOptions!.methods as string[]).join(", ")
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
      },
    },
  },
  [ROUTE_PATHS.CHAT_SERVICE.path]: {
    target: ROUTE_PATHS.CHAT_SERVICE.target,
    ws: true,
    on: {
      proxyReq: (
        proxyReq: ClientRequest,
        req: IncomingMessage & {
          currentUser?: {
            username?: string;
            role: string[] | undefined;
          };
        },
        _res: Response
      ) => {
        const { currentUser } = req;

        if (currentUser) {
          // Add headers to proxyReq for forwarding to the target service
          proxyReq.setHeader("currentUser", JSON.stringify(currentUser)); // Another header as specified
        }
        // @ts-ignore
        // logRequest(gatewayLogger, proxyReq, {
        //   protocol: proxyReq.protocol,
        //   host: proxyReq.getHeader("host"),
        //   path: proxyReq.path,
        // });
      },
      // proxyRes: (_proxyRes, _req, res) => {
      //   res.setHeader("Access-Control-Allow-Origin", corsOptions.origin);
      //   res.setHeader("Access-Control-Allow-Credentials", "true");
      //   res.setHeader(
      //     "Access-Control-Allow-Methods",
      //     corsOptions.methods.join(", ")
      //   );
      //   res.setHeader(
      //     "Access-Control-Allow-Headers",
      //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      //   );
      // },
      // },
      // error: (err, _req, _res) => {
      //   console.log("error chat:::", err);
      // },
    },
  },
};

const applyProxy = (app: express.Application) => {
  Object.keys(proxyConfigs).forEach((context: string) => {
    // Apply the proxy middleware
    if (context === ROUTE_PATHS.CHAT_SERVICE.path) {
      // console.log("context:::", context);

      app.use(createProxyMiddleware(proxyConfigs[context]));
    } else {
      app.use(context, createProxyMiddleware(proxyConfigs[context]));
    }
  });
};

export default applyProxy;

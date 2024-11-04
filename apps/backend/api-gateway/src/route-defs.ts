import configs from "@/src/config";

export interface RouteConfig {
  path: string;
  target?: string;
  methods?: {
    [method: string]: {
      authRequired: boolean;
      roles?: string[]; // Optional: Roles that are allowed
    };
  };
  nestedRoutes?: RouteConfig[];
}

export interface RoutesConfig {
  [route: string]: RouteConfig;
}

const ROUTE_PATHS: RoutesConfig = {
  AUTH_SERVICE: {
    path: "/v1/auth",
    target: configs.authServiceUrl,
    nestedRoutes: [
      {
        path: "/health",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/signup",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/signin",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/verify",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/login",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/signout",
        methods: {
          POST: {
            authRequired: true,
          },
        },
      },
      {
        path: "/google",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/facebook",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/refresh-token",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/oauth/callback",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
    ],
  },
  USER_SERVICE: {
    path: "/v1/users",
    target: configs.userServiceUrl,
    methods: {
      GET: {
        authRequired: true,
        roles: ["user", "admin"],
      },
      POST: {
        authRequired: true,
        roles: ["user", "admin"],
      },
    },
    nestedRoutes: [
      {
        path: "/health",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/me",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "admin"],
          },
        },
        nestedRoutes: [
          {
            path: "/favorites",
            methods: {
              GET: {
                authRequired: true,
                roles: ["user", "admin"],
              },
              POST: {
                authRequired: true,
                roles: ["user", "admin"],
              },
            },
            nestedRoutes: [
              {
                path: "/:id",
                methods: {
                  DELETE: {
                    authRequired: true,
                    roles: ["user", "admin"],
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  JOB_SERVICE: {
    path: "/v1/jobs",
    target: configs.jobServiceUrl,
    methods: {
      GET: {
        authRequired: false,
      },
    },
    nestedRoutes: [
      {
        path: "/health",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/:id",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/search-history",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "company"],
          },
        },
      },
      {
        path: "/search-trending",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
    ],
  },
  NOTIFICATION_SERVICE: {
    path: "/v1/notifications",
    target: configs.notificationServiceUrl,
    nestedRoutes: [
      {
        path: "/health",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/subscribe",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
    ],
  },
  CHAT_SERVICE: {
    target: configs.chatServiceUrl,
    path: "/socket.io",
    methods: {
      GET: {
        authRequired: false,
      },
      POST: {
        authRequired: false,
      },
    },
  },
  CONVERSATION: {
    path: "/v1/conversations",
    target: configs.chatServiceUrl,
    methods: {
      POST: {
        authRequired: true,
        roles: ["user", "company"],
      },
      GET: {
        authRequired: true,
        roles: ["user", "company"],
      },
    },
    nestedRoutes: [
      {
        path: "/:id/messages",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "company"],
          },
        },
      },
    ],
  },
};

export default ROUTE_PATHS;

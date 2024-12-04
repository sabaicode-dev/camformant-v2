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
        path: "/checkAuth",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
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
            roles: ["user", "company"],
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
      {
        path: "/corporate/login",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/corporate/signup",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
      {
        path: "/corporate/verify",
        methods: {
          POST: {
            authRequired: false,
          },
        },
      },
    ],
  },
  CORPORATE_SERVICE: {
    path: "/v1/corporator",
    target: configs.userServiceUrl,
    methods: {
      GET: {
        authRequired: true,
        roles: ["user", "company"],
      },
    },
    nestedRoutes: [
      {
        path: "/companies",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/getMulti/Profile",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/profile",
        methods: {
          POST: {
            authRequired: true,
            roles: ["company"],
          },
          GET: {
            authRequired: false,
          },
        },
        nestedRoutes: [
          {
            path: "/:corporateId",
            methods: {
              GET: {
                authRequired: false,
              },
              PUT: {
                authRequired: false,
              },
              DELETE: {
                authRequired: false,
              },
            },
          },
        ],
      },
      {
        path: "/getMulti/Profile",
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
        roles: ["user", "company"],
      },
      POST: {
        authRequired: true,
        roles: ["user", "company"],
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
            roles: ["user", "company"],
          },
        },
        nestedRoutes: [
          {
            path: "/photo",
            methods: {
              PUT: {
                authRequired: true,
                roles: ["user", "admin"],
              },
            },
          },
          {
            path: "/favorites",
            methods: {
              GET: {
                authRequired: true,
                roles: ["user", "company"],
              },
              POST: {
                authRequired: true,
                roles: ["user", "company"],
              },
            },
            nestedRoutes: [
              {
                path: "/:id",
                methods: {
                  DELETE: {
                    authRequired: true,
                    roles: ["user", "company"],
                  },
                },
              },
            ],
          },
        ],
      },
      {
        path: "/uploadFile",
        methods: {
          POST: {
            authRequired: true,
            roles: ["user", "company"],
          },
        },
      },
      {
        path: "/profile-detail",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "admin"],
          },
          PUT: {
            authRequired: true,
            roles: ["user", "admin"],
          },
        },
      },
      {
        path: "/cv",
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
            path: "/:cvId",
            methods: {
              DELETE: {
                authRequired: true,
                roles: ["user", "admin"],
              },
            },
          },
        ],
      },
      {
        path: "/cvstyle",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "admin"],
          },
        },
      },
      {
        path: "/customCv",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "admin"],
          },
          PUT: {
            authRequired: true,
            roles: ["user", "admin"],
          },
        },
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
        path: "/jobApply",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "company"],
          },
          POST: {
            authRequired: true,
            roles: ["user", "company"],
          },
        },
        nestedRoutes: [
          {
            path: "/:applyId",
            methods: {
              PUT: {
                authRequired: true,
                roles: ["company"],
              },
              DELETE: {
                authRequired: true,
                roles: ["company", "user"],
              },
            },
          },
        ],
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
      {
        path: "/corporator",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
    ],
  },
  COMPANY_SERVICE: {
    path: "/v1/companies",
    target: configs.jobServiceUrl,
    methods: {
      GET: {
        authRequired: false,
      },
    },
    nestedRoutes: [
      {
        path: "/:id",
        methods: {
          GET: {
            authRequired: false,
          },
        },
      },
      {
        path: "/getMulti/Profile",
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
    methods: {
      GET: {
        authRequired: true,
        roles: ["user", "company"],
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
        path: "/subscribe",
        methods: {
          POST: {
            authRequired: true,
            roles: ["user", "company"],
          },
        },
      },
      {
        path: "/unsubscribe",
        methods: {
          DELETE: {
            authRequired: true,
            roles: ["user", "company"],
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
    path: "v1/messages",
    target: configs.chatServiceUrl,
    nestedRoutes: [
      {
        path: "/send/:receiverId",
        methods: {
          POST: {
            authRequired: true,
            roles: ["user", "company"],
          },
        },
      },
      {
        path: "/:userToChatId",
        methods: {
          GET: {
            authRequired: true,
            roles: ["user", "company"],
          },
        },
      },
      {
        path: "/get/conversations",
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

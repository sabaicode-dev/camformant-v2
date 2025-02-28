import { Request, Response, NextFunction } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import configs from "@/src/config";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "@sabaicode-dev/camformant-libs";
import ROUTE_PATHS, { RouteConfig } from "@/src/route-defs";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

declare global {
  namespace Express {
    interface Request {
      currentUser: {
        username: string;
        role: string[] | undefined;
      };
      routeConfig: RouteConfig;
      methodConfig: {
        authRequired: boolean;
        roles?: string[];
      };
    }
  }
}

// Initialize the Cognito JWT Verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: configs.awsCognitoUserPoolId,
  tokenUse: "access",
  clientId: configs.awsCognitoClientId,
});

// TODO: implement the authenticateToken function
// Step 1: Check if the method config requires authentication
// Step 2: If authentication is required, check if the user is authenticated
// Step 3: If authentication is required and the user is authenticated, attach the user to the request object
// Step 4: If authentication is not required, call next()

const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const { methodConfig } = req;

    // console.log("authRequired:::", methodConfig.authRequired);

    if (methodConfig.authRequired) {
      // console.log("req cookie:::", req.cookies);
      // Step 1
      // console.log("need authicated");
      // Step 2
      const token = req.cookies?.["access_token"];
      if (!token) {
        throw new AuthenticationError("Please login to continue");
      }

      // Step 3
      const payload = await verifier.verify(token);

      if (!payload) {
        throw new AuthenticationError();
      }

      let role: string[] = [];
      const userPayload = await jwtDecode(req.cookies?.["id_token"]);
      // console.log("userPayload", userPayload);

      // @ts-ignore
      if (userPayload["cognito:username"].includes("google")) {
        // @ts-ignore
        if (!userPayload["custom:role"]) {
          const { data } = await axios.get(
            `${configs.userServiceUrl}/v1/users/me`,
            {
              headers: {
                Cookie: `username=${userPayload.sub}`,
              },
            }
          );
          // console.log("data", data.data);
          role.push(data.data.role);
        } else {
          // @ts-ignore
          role.push(userPayload["custom:role"]);
        }
      } else {
        role = payload["cognito:groups"] || [];
      }
      // console.log("role::: ", role);
      // console.log("payload::: ", payload.username);

      req.currentUser = {
        username: payload.username,
        role,
      };
    }
    // console.log("req.currentUser", req.currentUser);

    // Step 4
    next();
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

// TODO: implement the authorizeRole function
// Step 1: Check if the user is authenticated
// Step 2: Check if the user has the required role
// Step 3: If the user is authenticated and has the required role, call next()
// Step 4: If the user is not authenticated, return a 401 Unauthorized status

const authorizeRole = (req: Request, _res: Response, next: NextFunction) => {
  const { methodConfig, currentUser } = req;
  // console.log("role::: ", methodConfig);
  // console.log("currentUser::: ", currentUser);

  // Check if the route requires specific roles
  if (methodConfig.roles) {
    // If the user is not authenticated or does not have any of the required roles, throw an error
    if (
      !currentUser ||
      !Array.isArray(currentUser.role) ||
      !currentUser.role.some((role) => methodConfig.roles!.includes(role))
    ) {
      return next(new AuthorizationError());
    }
  }

  next();
};

const findRouteConfig = (
  path: string,
  routeConfigs: RouteConfig
): RouteConfig | null => {
  // Normalize path and ensure there's a leading slash
  const trimmedPath = path.replace(/\/+$/, ""); // Remove trailing slash, if any

  // STEP 1: Split both the path and routeConfig path into segments
  const requestSegments = trimmedPath.split("/").filter(Boolean); // Split and remove empty segments
  const routeSegments = routeConfigs.path.split("/").filter(Boolean);

  // STEP 2: Check if the number of segments match
  if (routeSegments.length > requestSegments.length) {
    return null; // Path is too short to match this route
  }

  // STEP 3: Match route segments (considering dynamic segments like :productId)
  for (let i = 0; i < routeSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const requestSegment = requestSegments[i];

    if (routeSegment.startsWith(":")) {
      // Dynamic segment, can be anything, so it matches
      continue;
    }

    if (routeSegment !== requestSegment) {
      return null; // Static segment mismatch
    }
  }

  // STEP 4: If no nested routes, return the current routeConfig
  if (!routeConfigs.nestedRoutes) {
    return routeConfigs;
  }

  // STEP 5: Find the remaining path after matching the base path
  const remainingPath = `/${requestSegments.slice(routeSegments.length).join("/")}`;

  // STEP 6: Check if any nested routes match the remaining path
  for (const nestedRouteConfig of routeConfigs.nestedRoutes) {
    const nestedResult = findRouteConfig(remainingPath, nestedRouteConfig);
    if (nestedResult) {
      return nestedResult;
    }
  }

  // If no nested route matches, return the current routeConfig
  return routeConfigs;
};

// TODO: implement the routeConfigMiddleware function
// Step 1: Find the route config for the requested path
// Step 2: Check if the route config has a method for the requested method
// Step 3: Attach the route configuration and method config to the request object
const routeConfigMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { path, method } = req;

  console.log("path:::", path, " method:::", method);

  // Step 1
  let routeConfig = null;
  for (const key in ROUTE_PATHS) {
    routeConfig = findRouteConfig(path, ROUTE_PATHS[key]);
    // console.log("routeConfig", routeConfig);
    if (routeConfig) break;
  }
  //  console.log("routeConfig", routeConfig);
  if (!routeConfig) {
    return next(new NotFoundError("Route not found"));
  }
  // Step 2
  const methodConfig = routeConfig.methods?.[method];
  console.log("method config:::",methodConfig);
  if (!methodConfig) {
    return next(new NotFoundError("Method not allowed"));
  }

  // console.log("routeConfig", routeConfig);

  // Attach the route configuration and method config to the request object
  req.routeConfig = routeConfig;
  req.methodConfig = methodConfig;
  console.log("method", methodConfig);

  next();
};

export { authenticateToken, authorizeRole, routeConfigMiddleware };

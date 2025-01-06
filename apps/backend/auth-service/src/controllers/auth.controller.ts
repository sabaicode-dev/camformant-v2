import configs from "@/src/config";
import {
  CorporateSignupRequest,
  GoogleCallbackRequest,
  LoginRequest,
  SignupRequest,
  UserBodyParams,
  VerifyUserRequest,
} from "@/src/controllers/types/auth-request.type";
import AuthService from "@/src/services/auth.service";
import setCookie from "@/src/utils/cookie";
import sendResponse from "@/src/utils/send-response";
import { NotFoundError } from "@sabaicode-dev/camformant-libs";
import { Response, Request as ExpressRequest } from "express";
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Queries,
  Query,
  Request,
  Route,
  SuccessResponse,
} from "tsoa";

@Route("v1/auth")
export class AuthController extends Controller {
  @Post("/signup")
  public async signup(
    @Body() body: SignupRequest
  ): Promise<{ message: string }> {
    try {
      const result = await AuthService.signup(body);

      return sendResponse({ message: result });
    } catch (error) {
      throw error;
    }
  }

  @Post("/verify")
  public async verifyUser(@Body() body: VerifyUserRequest) {
    try {
      await AuthService.verifyUser(body);
      return sendResponse({ message: `You've verified successfully` });
    } catch (error) {
      throw error;
    }
  }

  @Post("/login")
  public async login(
    @Request() request: Express.Request,
    @Body() body: LoginRequest
  ) {
    try {
      const response = (request as any).res as Response;
      const result = await AuthService.login(body);

      setCookie(response, "id_token", result.idToken);
      setCookie(response, "access_token", result.accessToken);
      setCookie(response, "refresh_token", result.refreshToken, {
        maxAge: 30 * 24 * 3600 * 1000,
      });
      setCookie(response, "username", result.sub!, {
        maxAge: 30 * 24 * 3600 * 1000,
      });
      setCookie(response, "user_id", result.userId!, {
        maxAge: 30 * 24 * 3600 * 1000,
      });

      return sendResponse({ message: "Login successfully" });
    } catch (error) {
      throw error;
    }
  }
  @Post("/signout")
  public async signout(@Request() request: Express.Request) {
    try {
      //@ts-ignore
      const tokens = request.cookies;
      const response = (request as any).res as Response;
      const clearCookie = (name: string) => {
        response.cookie(name, "", {
          expires: new Date(0),
          httpOnly: true,
        });
      };
      await AuthService.signout(tokens["access_token"]);
      for (const token in tokens) {
        clearCookie(token);
      }

      return sendResponse({ message: "Signout successfully" });
    } catch (error) {
      throw error;
    }
  }
  @Get("/google")
  public loginWithGoogle(@Query() state: string) {
    const cognitoOAuthURL = AuthService.loginWithGoogle(state);

    return sendResponse({
      message: "Login with Google successfully",
      data: cognitoOAuthURL,
    });
  }

  @Get("/facebook")
  @SuccessResponse(302, "Redirect")
  public loginWithFacebook(@Request() request: Express.Request) {
    const response = (request as any).res as Response;
    const cognitoOAuthURL = AuthService.loginWithFacebook();

    response.redirect(cognitoOAuthURL);
  }

  @Get("/oauth/callback")
  public async oauthCallback(
    @Request() request: Express.Request,
    @Queries() query: GoogleCallbackRequest
  ) {
    try {
      const response = (request as any).res as Response;
      const tokens = await AuthService.getOAuthToken(query);
      console.log("tokens:::", tokens);

      setCookie(response, "id_token", tokens.idToken);
      setCookie(response, "access_token", tokens.accessToken);
      setCookie(response, "refresh_token", tokens.refreshToken, {
        maxAge: 30 * 24 * 3600 * 1000,
      });
      setCookie(response, "username", tokens.sub!, {
        maxAge: 30 * 24 * 3600 * 1000,
      });
      setCookie(response, "user_id", tokens.userId!, {
        maxAge: 30 * 24 * 3600 * 1000,
      });

      response.redirect(configs.clientUrl);
    } catch (error) {
      throw error;
    }
  }

  @Post("/refresh-token")
  public async refreshToken(
    @Request() request: ExpressRequest,
    @Body() body: { refreshToken?: string; username?: string }
  ) {
    try {
      const response = (request as any).res as Response;

      const refreshToken = request.cookies["refresh_token"];
      const username = request.cookies["username"];

      if (refreshToken && username) {
        const result = await AuthService.refreshToken({
          refreshToken: body.refreshToken || refreshToken,
          username: body.username || username,
        });

        if (result) {
          setCookie(response, "id_token", result.idToken);
          setCookie(response, "access_token", result.accessToken);
          return sendResponse({ message: "Token refreshed successfully" });
        }
      }
      return sendResponse({ message: "NO Token Found!" });
    } catch (error) {
      throw error;
    }
  }
  @Get("/checkAuth")
  public async checkAuth(@Request() request: ExpressRequest) {
    try {
      if (!request.cookies["access_token"] || !request.cookies["id_token"])
        return { message: "no authorized" };
      return { message: "authorized" };
    } catch (error) { }
  }

  @Post("/corporate/signup")
  public async corporateSignup(
    @Body() body: CorporateSignupRequest
  ): Promise<{ message: string }> {
    try {
      const result = await AuthService.corporateSignup(body);

      return sendResponse({ message: result });
    } catch (error) {
      throw error;
    }
  }
  @Post("/corporate/verify")
  public async corporateVerifyUser(@Body() body: VerifyUserRequest) {
    try {
      await AuthService.corporateVerifyUser(body);
      return sendResponse({ message: `You've verified successfully` });
    } catch (error) {
      throw error;
    }
  }
  @Post("/corporate/login")
  public async corporateLogin(
    @Request() request: Express.Request,
    @Body() body: LoginRequest
  ) {
    try {
      const response = (request as any).res as Response;
      const result = await AuthService.corporateLogin(body);

      setCookie(response, "id_token", result.idToken);
      setCookie(response, "access_token", result.accessToken);
      setCookie(response, "refresh_token", result.refreshToken, {
        maxAge: 30 * 24 * 3600 * 1000,
      });
      setCookie(response, "username", result.sub!, {
        maxAge: 30 * 24 * 3600 * 1000,
      });
      setCookie(response, "user_id", result.userId!, {
        maxAge: 30 * 24 * 3600 * 1000,
      });

      return sendResponse({ message: "Login successfully" });
    } catch (error) {
      throw error;
    }
  }
  @Post("/admin/login")
  public async adminLogin(
    @Request() request: Express.Request,
    @Body() body: LoginRequest
  ) {
    try {
      const response = (request as any).res as Response;
      const result = await AuthService.adminLogin(body);

      setCookie(response, "id_token", result.idToken);
      setCookie(response, "access_token", result.accessToken);
      setCookie(response, "refresh_token", result.refreshToken, {
        maxAge: 30 * 24 * 3600 * 1000,
      });
      setCookie(response, "username", result.sub!, {
        maxAge: 30 * 24 * 3600 * 1000,
      });
      setCookie(response, "user_id", result.userId!, {
        maxAge: 30 * 24 * 3600 * 1000,
      });

      return sendResponse({ message: "Login successfully" });
    } catch (error) {
      throw error;
    }
  }
  @Get("/getToken")
  public async getToken(@Request() request: ExpressRequest) {
    const userCookie = request.cookies["access_token"];
    if (!userCookie) throw new NotFoundError("Cookie is not found");
    return userCookie
  }
  @SuccessResponse("204", "delete Successfully")
  @Post("/admin/verifyAccount")
  public async verifyUserAccount(@Body() body: UserBodyParams) {
    await AuthService.verifyUserAccount(body)
    return
  }
  @Delete("/admin/deleteAccount/:userSub")
  public async deleteUserAccount(@Path() userSub: string) {
    await AuthService.deleteUserAccount(userSub)
    return
  }
}

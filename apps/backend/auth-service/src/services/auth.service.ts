import configs from "@/src/config";
import {
  AdminAddUserToGroupCommand,
  AdminGetUserCommand,
  AdminLinkProviderForUserCommand,
  AdminUpdateUserAttributesCommand,
  AuthFlowType,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  GlobalSignOutCommand,
  GlobalSignOutCommandInput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
  ListUsersCommand,
  ListUsersCommandInput,
  SignUpCommand,
  SignUpCommandInput,
  UserType,
  AdminSetUserPasswordCommand,
  AdminSetUserPasswordCommandInput,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  AdminCreateUserCommandOutput,
  AdminDeleteUserCommandInput,
  AdminDeleteUserCommand,
  AdminDisableUserCommandInput,
  AdminDisableUserCommand,
  AdminEnableUserCommandInput,
  AdminEnableUserCommand,
  AdminEnableUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  CorporateSignupRequest,
  GoogleCallbackRequest,
  LoginRequest,
  SignupRequest,
  UserBodyParams,
  VerifyUserRequest,
} from "@/src/controllers/types/auth-request.type";
import crypto from "crypto";
import axios from "axios";
import {
  AUTH_MESSAGES,
  ApplicationError,
  AuthenticationError,
  InternalServerError,
  InvalidInputError,
  NotFoundError,
  ResourceConflictError,
} from "@sabaicode-dev/camformant-libs";
import { jwtDecode } from "jwt-decode";
import { CognitoToken } from "@/src/services/types/auth-service.type";
import { sendMail } from "../utils/mail";

const client = new CognitoIdentityProviderClient({
  region: configs.awsCognitoRegion,
  credentials: {
    accessKeyId: configs.awsAccessKeyId,
    secretAccessKey: configs.awsSecretAccessKey,
  },
});

class AuthService {
  // Generate the SECRET_HASH
  private generateSecretHash(username: string): string {
    const secret = configs.awsCognitoClientSecret;
    return crypto
      .createHmac("SHA256", secret)
      .update(username + configs.awsCognitoClientId)
      .digest("base64");
  }

  async signup(body: SignupRequest): Promise<string> {
    const existingUser = await this.getUserByEmail(
      (body.email || body.phone_number) as string
    );
    if (existingUser) {
      throw new ResourceConflictError(
        AUTH_MESSAGES.AUTHENTICATION.ACCOUNT_ALREADY_EXISTS
      );
    }

    const inputBody = {
      name: `${body.sur_name} ${body.last_name}`,
      ...Object.keys(body)
        .filter((key) => key !== "sur_name" && key !== "last_name")
        .reduce<Record<string, any>>((obj, key) => {
          obj[key] = body[key as keyof SignupRequest];
          return obj;
        }, {}),
    };
    const allowedAttributes = ["email", "phone_number", "name", "custom:role"];

    const attributes = Object.keys(inputBody)
      .filter((key) => allowedAttributes.includes(key) || key === "role")
      .map((key) => ({
        Name: key === "role" ? "custom:role" : key,
        Value: inputBody[key as keyof typeof inputBody],
      }));
    const username = (body.email || body.phone_number) as string;

    const params: SignUpCommandInput = {
      ClientId: configs.awsCognitoClientId,
      Username: username,
      Password: body.password,
      SecretHash: this.generateSecretHash(username),
      UserAttributes: attributes,
    };

    try {
      const command = new SignUpCommand(params);
      const result = await client.send(command);

      return `User created successfully. Please check your ${result.CodeDeliveryDetails?.DeliveryMedium?.toLowerCase()} for a verification code.`;
    } catch (error) {
      console.error(`AuthService signup() method error: `, error);

      if (error instanceof ApplicationError) {
        throw error;
      }

      // Duplicate Account
      if (typeof error === "object" && error !== null && "name" in error) {
        if ((error as { name: string }).name === "UsernameExistsException") {
          throw new ResourceConflictError(
            AUTH_MESSAGES.AUTHENTICATION.ACCOUNT_ALREADY_EXISTS
          );
        }
      }

      throw new Error(`Error signing up user: ${error}`);
    }
  }

  async verifyUser(body: VerifyUserRequest): Promise<void> {
    const username = (body.email ||
      body.phone_number?.replace(/^\+/, "")) as string;

    const params = {
      ClientId: configs.awsCognitoClientId,
      Username: username,
      ConfirmationCode: body.code,
      SecretHash: this.generateSecretHash(username),
    };

    try {
      const command = new ConfirmSignUpCommand(params);
      await client.send(command);

      const userInfo = await this.getUserByUsername(username);
      const role =
        userInfo.UserAttributes?.find((attr) => attr.Name === "custom:role")
          ?.Value || "user";

      // Add the user to the group based on the `role` attribute
      await this.addToGroup(username, role);

      // Send user info to the `User Service`
      await axios.post(`${configs.userServiceUrl}/v1/users`, {
        sub: userInfo.Username,
        email: body.email,
        phone_number: body.phone_number,
        username: userInfo.UserAttributes?.find((attr) => attr.Name === "name")
          ?.Value,
        role,
      });
    } catch (error) {
      console.error("AuthService verifyUser() method error:", error);

      // Mismatch Code
      if (typeof error === "object" && error !== null && "name" in error) {
        if ((error as { name: string }).name === "CodeMismatchException") {
          throw new InvalidInputError({
            message: AUTH_MESSAGES.MFA.VERIFICATION_FAILED,
          });
        }
      }

      throw new Error(`Error verifying user: ${error}`);
    }
  }

  async login(body: LoginRequest): Promise<CognitoToken> {
    const username = (body.email || body.phone_number) as string;

    const params: InitiateAuthCommandInput = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: configs.awsCognitoClientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: body.password!,
        SECRET_HASH: this.generateSecretHash(username),
      },
    };

    try {
      const command = new InitiateAuthCommand(params);
      const result = await client.send(command);

      // Get the user info
      const congitoUsername = await this.getUserInfoFromToken(
        result.AuthenticationResult?.IdToken!
      );

      // Get the user info from the user service
      const userInfo = await axios.get(
        `${configs.userServiceUrl}/v1/users/${congitoUsername.sub}`
      );
      // console.log("userInfo: ", userInfo);

      return {
        accessToken: result.AuthenticationResult?.AccessToken!,
        idToken: result.AuthenticationResult?.IdToken!,
        refreshToken: result.AuthenticationResult?.RefreshToken!,
        sub: congitoUsername.sub,
        userId: userInfo.data.data._id,
      };
    } catch (error) {
      // Mismatch Password | Email or Phone Number
      if (typeof error === "object" && error !== null && "name" in error) {
        if ((error as { name: string }).name === "NotAuthorizedException") {
          throw new InvalidInputError({
            message: AUTH_MESSAGES.AUTHENTICATION.ACCOUNT_NOT_FOUND,
          });
        }
      }

      // Cognito Service Error
      if (typeof error === "object" && error !== null && "name" in error) {
        if ((error as { name: string }).name === "InternalErrorException") {
          throw new InternalServerError({
            message: AUTH_MESSAGES.ERRORS.TECHNICAL_ISSUE,
          });
        }
      }

      console.error("AuthService login() method error:", error);
      throw new Error(`Error verifying user: ${error}`);
    }
  }

  async signout(access_token: string): Promise<string | undefined> {
    const params: GlobalSignOutCommandInput = {
      AccessToken: access_token,
    };
    try {
      const command = new GlobalSignOutCommand(params);
      await client.send(command);
      // console.log("result::: ", result);
      return "success cleared cookies from cignito";
    } catch (error) { }
  }

  loginWithGoogle(state: string): string {
    // const state = crypto.randomBytes(16).toString('hex')

    const params = new URLSearchParams({
      response_type: "code",
      client_id: configs.awsCognitoClientId,
      redirect_uri: configs.awsRedirectUri,
      identity_provider: "Google",
      scope: "profile email openid",
      state: state,
      prompt: "select_account",
    });
    const cognitoOAuthURL = `${configs.awsCognitoDomain}/oauth2/authorize?${params.toString()}`;

    return cognitoOAuthURL;
  }

  loginWithFacebook(): string {
    const state = crypto.randomBytes(16).toString("hex");

    const params = new URLSearchParams({
      response_type: "code",
      client_id: configs.awsCognitoClientId,
      redirect_uri: configs.awsRedirectUri,
      identity_provider: "Facebook",
      scope: "profile email openid",
      state: state,
      prompt: "select_account",
    });
    const cognitoOAuthURL = `${configs.awsCognitoDomain}/oauth2/authorize?${params.toString()}`;

    return cognitoOAuthURL;
  }

  async getOAuthToken(query: GoogleCallbackRequest): Promise<CognitoToken> {
    try {
      const { code, error, state } = query;

      if (error || !code) {
        throw new InvalidInputError({ message: error });
      }

      const authorizationHeader = `Basic ${Buffer.from(`${configs.awsCognitoClientId}:${configs.awsCognitoClientSecret}`).toString("base64")}`;

      const params = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        client_id: configs.awsCognitoClientId,
        redirect_uri: configs.awsRedirectUri,
      });

      // Step 1: Get the token from Cognito
      const res = await axios.post(
        `${configs.awsCognitoDomain}/oauth2/token`,
        params,
        {
          headers: {
            Authorization: authorizationHeader,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const token = {
        accessToken: res.data.access_token,
        idToken: res.data.id_token,
        refreshToken: res.data.refresh_token,
      };
      // console.log("token::", token);

      // Step 2: Get the user info from token
      const userInfo = this.getUserInfoFromToken(token.idToken);
      console.log(" user info::::", userInfo);
      // @ts-ignore
      const email = userInfo.email;
      const existingUser = await this.getUserByEmail(email);
      // console.log("existingUser: ", existingUser);

      let userId: string;

      // Step 3: Case User is already signin with Email | Phone Number / Password, but they try to signin with Google | Facebook
      if (existingUser && existingUser.UserStatus !== "EXTERNAL_PROVIDER") {
        console.log("link with existing accoint");
        const isLinked = existingUser.Attributes?.some(
          (attr) => attr.Name === "identities" && attr.Value?.includes("Google")
        );

        if (!isLinked) {
          // Step 3.1: Link the user to the existing Cognito user if not already linked
          await this.linkAccount({
            sourceUserId: userInfo.sub!,
            providerName: "Google",
            destinationUserId: existingUser.Username!,
          });

          // Step 3.2: Update user info in user service
          const user = await axios.put(
            `${configs.userServiceUrl}/v1/users/${existingUser.Username}`,
            {
              googleSub: userInfo.sub, // Update the Google sub
              role: state,
            }
          );

          // Step 3.3: Update user info in Cognito
          await this.updateUserCongitoAttributes(existingUser.Username!, {
            "custom:role": state!,
          });

          userId = user.data.data._id;
        } else {
          const user = await axios.get(
            `${configs.userServiceUrl}/v1/users/${existingUser.Username}`
          );

          userId = user.data.data._id;
        }
      }
      // Step 4: Case User is never signin with Google | Facebook
      else {
        try {
          console.log("doesnt need to link");
          console.log("userInfo", userInfo);

          const user = await axios.post(`${configs.userServiceUrl}/v1/users`, {
            googleSub: userInfo.sub,
            email,
            // @ts-ignore
            username: userInfo.name,
            // @ts-ignore
            profile: userInfo.profile,
            role: state,
            sub: userInfo.sub,
          });
          // console.log("new user from google:", user);
          // Step 4.1: Update user info in Cognito
          await this.updateUserCongitoAttributes(userInfo.sub!, {
            "custom:role": state!,
          });
          userId = user.data.data._id;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 409) {
            console.log(
              "User already exists in user service, retrieving existing user info."
            );
            const existingUserResponse = await axios.get(
              `${configs.userServiceUrl}/v1/users/${userInfo.sub}`
            );
            userId = existingUserResponse.data.data._id;
          } else {
            throw error; // Re-throw if it's a different error
          }
        }
      }

      // Step 5: Check if the user is already in the group before adding
      const groupExists = await this.checkUserInGroup(
        userInfo.sub!,
        state || "user"
      );
      console.log("before group exist", groupExists);
      if (!groupExists) {
        console.log("group exist");

        await this.addToGroup(userInfo.sub!, state!);
        console.log(`User ${userInfo.sub} added to group ${state}`);
      }

      return {
        accessToken: token.accessToken,
        idToken: token.idToken,
        refreshToken: token.refreshToken,
        sub: userInfo.sub,
        userId,
      };
    } catch (error) {
      throw error;
    }
  }

  getUserInfoFromToken(token: string) {
    const decodedToken = jwtDecode(token);
    // console.log("decodedToken: ", decodedToken);
    return decodedToken;
  }

  async addToGroup(username: string, groupName: string) {
    const params = {
      GroupName: groupName,
      Username: username,
      UserPoolId: configs.awsCognitoUserPoolId,
    };

    try {
      const command = new AdminAddUserToGroupCommand(params);
      await client.send(command);

      console.log(
        `AuthService verifyUser() method: User added to ${groupName} group`
      );
    } catch (error) {
      throw error;
    }
  }

  async getUserByUsername(username: string) {
    const params = {
      Username: username,
      UserPoolId: configs.awsCognitoUserPoolId,
    };

    try {
      const command = new AdminGetUserCommand(params);
      const userInfo = await client.send(command);
      return userInfo;
    } catch (error) {
      console.error("AuthService getUserByUsername() method error:", error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<UserType | undefined> {
    const params: ListUsersCommandInput = {
      Filter: `email = "${email}"`,
      UserPoolId: configs.awsCognitoUserPoolId,
      Limit: 3,
    };

    try {
      const listUsersCommand = new ListUsersCommand(params);
      const response = await client.send(listUsersCommand);
      if (response.Users) console.log("exisited");
      return response.Users && response.Users[0];
    } catch (error) {
      console.error("AuthService getUserByEmail() method error:", error);
      throw error;
    }
  }

  async updateUserCongitoAttributes(
    username: string,
    attributes: { [key: string]: string }
  ): Promise<void> {
    const params = {
      Username: username,
      UserPoolId: configs.awsCognitoUserPoolId,
      UserAttributes: Object.entries(attributes).map(([key, value]) => ({
        Name: key,
        Value: value,
      })),
    };

    try {
      const command = new AdminUpdateUserAttributesCommand(params);
      await client.send(command);
    } catch (error) {
      console.error(
        "AuthService updateUserCongitoAttributes() method error:",
        error
      );
      throw error;
    }
  }

  async linkAccount({
    sourceUserId,
    providerName,
    destinationUserId,
  }: {
    sourceUserId: string;
    providerName: string;
    destinationUserId: string;
  }): Promise<void> {
    const params = {
      // DestinationUser is the existing cognito user that you want to assign to the external Idp user account (COULD BE a cognito user or a federated user)
      DestinationUser: {
        ProviderName: "Cognito",
        ProviderAttributeValue: destinationUserId,
      },
      // SourceUser is the user who is linking to the destination user (MUST BE a federated user like Google or Facebook, etc.)
      SourceUser: {
        ProviderName: providerName, // Google, Facebook, etc.
        ProviderAttributeName: "Cognito_Subject",
        ProviderAttributeValue: sourceUserId,
      },
      UserPoolId: configs.awsCognitoUserPoolId,
    };

    try {
      const command = new AdminLinkProviderForUserCommand(params);
      await client.send(command);
    } catch (error) {
      console.error(`AuthService linkAccount() method error: `, error);
      throw error;
    }
  }

  async checkUserInGroup(
    username: string,
    groupName: string
  ): Promise<boolean | undefined> {
    try {
      const params = {
        GroupName: groupName,
        Username: username,
        UserPoolId: configs.awsCognitoUserPoolId,
      };
      const command = new AdminGetUserCommand(params);
      const user = await client.send(command);

      return user.UserAttributes?.map((attr) => attr.Value).includes(groupName);
    } catch (error) {
      console.error(
        `Error checking if user ${username} is in group ${groupName}:`,
        error
      );
      throw error;
    }
  }

  async refreshToken({
    refreshToken,
    username,
  }: {
    refreshToken: string;
    username: string;
  }) {
    if (!refreshToken || !username) {
      throw new AuthenticationError();
    }

    const params: InitiateAuthCommandInput = {
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: configs.awsCognitoClientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: this.generateSecretHash(username),
      },
    };

    try {
      const command = new InitiateAuthCommand(params);
      const result: InitiateAuthCommandOutput = await client.send(command);
      return {
        accessToken: result.AuthenticationResult?.AccessToken!,
        idToken: result.AuthenticationResult?.IdToken!,
        refreshToken: result.AuthenticationResult?.RefreshToken || refreshToken, // Reuse the old refresh token if a new one isn't provided
      };
    } catch (error) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      console.error("AuthService refreshToken() method error:", error);
      throw new Error(`Error refreshing token: ${error}`);
    }
  }

  // corporate
  async corporateSignup(body: CorporateSignupRequest): Promise<string> {
    const existingUser = await this.getUserByEmail(
      (body.email) as string
    );
    if (existingUser) {
      throw new ResourceConflictError(
        AUTH_MESSAGES.AUTHENTICATION.ACCOUNT_ALREADY_EXISTS
      );
    }

    // Define inputBody with only name, email, and custom role attribute
    const inputBody = {
      name: `${body.sur_name} ${body.last_name}`,
      ...Object.keys(body)
        .filter((key) => key !== "sur_name" && key !== "last_name")
        .reduce<Record<string, any>>((obj, key) => {
          obj[key] = body[key as keyof CorporateSignupRequest];
          return obj;
        }, {}),
    };
    // Allowed attributes
    const allowedAttributes = ["email", "name", "custom:role"];

    // Filter and map attributes
    const attributes = Object.keys(inputBody)
      .filter((key) => allowedAttributes.includes(key) || key === "role")
      .map((key) => ({
        Name: key === "role" ? "company" : key,
        Value: inputBody[key as keyof typeof inputBody],
      }));
    attributes.push({ Name: "email_verified", Value: "true" });
    const username = (body.email) as string;

    const params: AdminCreateUserCommandInput = {
      UserPoolId: configs.awsCognitoUserPoolId,
      Username: username,
      UserAttributes: attributes,
      TemporaryPassword: body.password,
    };

    try {
      const command = new AdminCreateUserCommand(params);
      const result: AdminCreateUserCommandOutput = await client.send(command);
      const userSub = result.User?.Attributes?.find(
        (attr) => attr.Name === "sub"
      )?.Value;
      await this.createPassword(userSub!, body.password!);
      await axios.post(`${configs.userServiceUrl}/v1/corporator/profile`, {
        sub: userSub,
        name: `${body.sur_name}${body.last_name}`,
        email: body.email,
        contact: {
          phone_number: body?.contact?.phone_number,
        },
        employee_count: body?.employee_count,
        status: "unverified",
      });
      //set permanent password
      await this.addToGroup(userSub!, body.role ? body.role : "company");
      await this.disbaleUser(userSub!);
      return `Your corporate signup request has been successfully submitted. It is now pending admin verification. You will be notified once your account has been approved`;
    } catch (error) {
      console.error(`AuthService corporateSignup() method error: `, error);

      if (error instanceof ApplicationError) {
        throw error;
      }

      // Duplicate Account
      if (typeof error === "object" && error !== null && "name" in error) {
        if ((error as { name: string }).name === "UsernameExistsException") {
          throw new ResourceConflictError(
            AUTH_MESSAGES.AUTHENTICATION.ACCOUNT_ALREADY_EXISTS
          );
        }
      }

      throw new Error(`Error signing up user: ${error}`);
    }
  }

  async corporateVerifyUser(body: VerifyUserRequest): Promise<void> {
    const username = (body.email ||
      body.phone_number?.replace(/^\+/, "")) as string;
    // console.log("start verify service 1");

    const params = {
      ClientId: configs.awsCognitoClientId,
      Username: username,
      ConfirmationCode: body.code,
      SecretHash: this.generateSecretHash(username),
    };

    try {
      const command = new ConfirmSignUpCommand(params);
      await client.send(command);

      const userInfo = await this.getUserByUsername(username);

      const role =
        userInfo.UserAttributes?.find((attr) => attr.Name === "company")
          ?.Value || "company";

      const userSub = userInfo.UserAttributes?.filter(
        (Name) => Name.Name === "sub"
      )[0].Value;

      await this.addToGroup(userSub!, role);

      await axios.post(`${configs.userServiceUrl}/v1/corporator/profile`, {
        sub: userInfo.Username,
        email: body.email,
        name: userInfo.UserAttributes?.find((attr) => attr.Name === "name")
          ?.Value,
      });
    } catch (error) {
      console.log("AuthService corporateVerifyUser() method error:", error);

      // Mismatch Code
      if (typeof error === "object" && error !== null && "name" in error) {
        if ((error as { name: string }).name === "CodeMismatchException") {
          throw new InvalidInputError({
            message: AUTH_MESSAGES.MFA.VERIFICATION_FAILED,
          });
        }
      }

      throw new Error(`Error verifying user: ${error}`);
    }
  }

  async corporateLogin(body: LoginRequest): Promise<CognitoToken> {
    const username = (body.email) as string;

    const params: InitiateAuthCommandInput = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: configs.awsCognitoClientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: body.password!,
        SECRET_HASH: this.generateSecretHash(username),
      },
    };

    try {
      const command = new InitiateAuthCommand(params);
      const result = await client.send(command);

      // Get the user info
      const congitoUsername = await this.getUserInfoFromToken(
        result.AuthenticationResult?.IdToken!
      );

      // Get the user info from the user service
      const userInfo = await axios.get(
        `${configs.userServiceUrl}/v1/corporator/profile/${congitoUsername.sub}`
      );
      console.log("userInfo: ", userInfo.data.data._id);
      return {
        accessToken: result.AuthenticationResult?.AccessToken!,
        idToken: result.AuthenticationResult?.IdToken!,
        refreshToken: result.AuthenticationResult?.RefreshToken!,
        sub: congitoUsername.sub,
        userId: userInfo.data.data._id,
      };
    } catch (error) {
      // Mismatch Password | Email or Phone Number
      if (typeof error === "object" && error !== null && "name" in error) {
        if ((error as { name: string }).name === "NotAuthorizedException") {
          throw new InvalidInputError({
            message: `Your account is currently unverified. Please wait for admin approval or contact support for assistance.`,
          });
        }
      }

      // Cognito Service Error
      if (typeof error === "object" && error !== null && "name" in error) {
        if ((error as { name: string }).name === "InternalErrorException") {
          throw new InternalServerError({
            message: AUTH_MESSAGES.ERRORS.TECHNICAL_ISSUE,
          });
        }
      }
      console.error("AuthService corporateLogin() method error:", error);
      throw new Error(`Error verifying user: ${error}`);
    }
  }
  async adminLogin(body: LoginRequest): Promise<CognitoToken> {
    const username = (body.email || body.phone_number) as string;

    const params: InitiateAuthCommandInput = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: configs.awsCognitoClientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: body.password!,
        SECRET_HASH: this.generateSecretHash(username),
      },
    };

    try {
      const command = new InitiateAuthCommand(params);
      const result = await client.send(command);

      // Get the user info
      const congitoUsername = await this.getUserInfoFromToken(
        result.AuthenticationResult?.IdToken!
      );

      // Get the user info from the user service
      const userInfo = await axios.get(
        `${configs.userServiceUrl}/v1/admin/profile/${congitoUsername.sub}`
      );
      console.log("userInfo: ", userInfo.data.data._id);
      return {
        accessToken: result.AuthenticationResult?.AccessToken!,
        idToken: result.AuthenticationResult?.IdToken!,
        refreshToken: result.AuthenticationResult?.RefreshToken!,
        sub: congitoUsername.sub,
        userId: userInfo.data.data._id,
      };
    } catch (error) {
      // Mismatch Password | Email or Phone Number
      if (typeof error === "object" && error !== null && "name" in error) {
        if ((error as { name: string }).name === "NotAuthorizedException") {
          throw new InvalidInputError({
            message: AUTH_MESSAGES.AUTHENTICATION.ACCOUNT_NOT_FOUND,
          });
        }
      }

      // Cognito Service Error
      if (typeof error === "object" && error !== null && "name" in error) {
        if ((error as { name: string }).name === "InternalErrorException") {
          throw new InternalServerError({
            message: AUTH_MESSAGES.ERRORS.TECHNICAL_ISSUE,
          });
        }
      }

      console.error("AuthService corporateLogin() method error:", error);
      throw new Error(`Error verifying user: ${error}`);
    }
  }
  public async verifyUserAccount(body: UserBodyParams) {
    try {
      const params: AdminEnableUserCommandInput = {
        Username: body.sub,
        UserPoolId: configs.awsCognitoUserPoolId,
      };
      const command = new AdminEnableUserCommand(params);
      const result: AdminEnableUserCommandOutput = await client.send(command);
      //for send mail to user after successful verify
      if (result.$metadata) {
        await axios.put(
          `${configs.userServiceUrl}/v1/corporator/profile/${body.id}`,
          { status: "verified" }
        );
        sendMail(body.email);
      }
      return result;
    } catch (error) {
      //cognito error
      if (typeof error === "object" && error !== null && "name" in error) {
        if ((error as { name: string }).name === "UserNotFoundException") {
          throw new NotFoundError("This account not found");
        }
      }
      throw error;
    }
  }
  async disbaleUser(sub: string) {
    try {
      const params: AdminDisableUserCommandInput = {
        UserPoolId: configs.awsCognitoUserPoolId,
        Username: sub,
      };
      await client.send(new AdminDisableUserCommand(params));
    } catch (err) {
      throw err;
    }
  }
  public async deleteUserAccount(sub: string) {
    try {
      const params: AdminDeleteUserCommandInput = {
        UserPoolId: configs.awsCognitoUserPoolId,
        Username: sub,
      };
      const command = new AdminDeleteUserCommand(params);
      await client.send(command);
      await axios.delete(
        `${configs.userServiceUrl}/v1/corporator/profile/${sub}`
      );
    } catch (error) {
      if (typeof error === "object" && error !== null && "name" in error) {
        if ((error as { name: string }).name === "UserNotFoundException") {
          throw new NotFoundError("This account not found");
        }
      }
      throw error;
    }
  }
  //set password for user since admincreateuser give temp pass for them
  async createPassword(sub: string, password: string) {
    try {
      const params: AdminSetUserPasswordCommandInput = {
        UserPoolId: configs.awsCognitoUserPoolId,
        Username: sub,
        Password: password,
        Permanent: true,
      };
      const command = new AdminSetUserPasswordCommand(params);
      await client.send(command);
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();

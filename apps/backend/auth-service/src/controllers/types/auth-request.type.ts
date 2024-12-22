export interface SignupRequest {
  sur_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
  role?: "company" | "user";
}

export interface VerifyUserRequest {
  email?: string;
  phone_number?: string;
  code: string;
}

export interface LoginRequest {
  email?: string;
  phone_number?: string;
  password?: string;
}

export interface GoogleCallbackRequest {
  code?: string;
  state?: string;
  error?: string;
}
export interface CorporateSignupRequest {
  sur_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
  role?: "company";
}
export interface UserBodyParams{
  email:string;
  sub:string;
  id:string
}


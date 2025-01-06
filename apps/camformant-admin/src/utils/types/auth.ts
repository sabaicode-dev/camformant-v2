export interface LoginRequest {
  email?: string;
  phone_number?: string;
  password?: string;
}

export interface User {
  _id: string;
  email?: string;
  phone_number?:string
  profile: string;
  role: string;
  name: string;
}
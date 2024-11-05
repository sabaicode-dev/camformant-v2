"use client";
import axiosInstance from "@/utils/axios";
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignInData, SignUpData, VerifyCodeData } from "@/types/auth";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";

interface User {
  _id: string;
  email: string;
  profile: string;
  role: string;
  username: string;
  favorites: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signUp: ({ sur_name , last_name , email , phone_number , password }: SignUpData) => Promise<void>;
  verifyCode: ({ email , phone_number , code }: VerifyCodeData) => Promise<void>;
  signIn: ({ email , phone_number , password }: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

// checkAuthStatus function is used to verify the authentication status of the user
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(API_ENDPOINTS.USER_PROFILE);
        setUser(response.data.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Check auth status failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);


  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      await axiosInstance.post(`${API_ENDPOINTS.SIGN_UP}`, {
        sur_name: data.sur_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        password: data.password,
      });
      router.push(`/verify?contact=${data.email || data.phone_number}&method=${data.email ? 'email' : 'phone_number'}`);
    } catch (error) {
      console.error('Sign up failed:', error);
      setIsAuthenticated(false);
      throw error;
    }finally{
      setIsLoading(false);
    }
  };

  const verifyCode = async (data: VerifyCodeData) => {
    setIsLoading(true);
    console.log("Calling verifyCode function..."); // Debugging
    try {
      await axiosInstance.post(`${API_ENDPOINTS.VERIFY}`, {
        [data.email ? 'email' : 'phone_number']: data.email || data.phone_number,
        code: data.code,
      });
      router.push('/signin');
    } catch (error) {
      console.error('Verify code failed:', error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (data: SignInData) => {
    setIsLoading(true);
    try {
        await axiosInstance.post(`${API_ENDPOINTS.SIGN_IN}`, {
            [data.email ? 'email' : 'phone_number']: data.email || data.phone_number,
            password: data.password,
        });      

      const res = await axiosInstance.get(API_ENDPOINTS.USER_PROFILE);
      setUser(res.data.data);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (error) {
        console.error('Sign in failed:', error);
        throw error;
    } finally {
        setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
        await axiosInstance.post(`${API_ENDPOINTS.SIGN_OUT}`);
        setIsAuthenticated(false);
        setUser(null);
        router.push('/signin');
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
        setIsAuthenticated(false);
        setUser(null);
        router.push('/signin');
    }
  };

return (
  <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      signUp,
      verifyCode,
      signIn,
      signOut,
  }}>
      {children}
  </AuthContext.Provider>
);

}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
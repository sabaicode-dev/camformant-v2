"use client";
import axiosInstance from "@/utils/axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import {
  LoginRequest,
  SignupRequest,
  VerifyUserRequest,
} from "@/utils/types/auth";

export interface User {
  _id: string;
  email: string;
  profile: string;
  role: string;
  username: string;
  favorites: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: ({ email, phone_number, password }: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  signup: ({
    sur_name,
    last_name,
    email,
    phone_number,
    password,
  }: SignupRequest) => Promise<void>;
  verify: ({ email, phone_number, code }: VerifyUserRequest) => Promise<void>;
  siginWithGoogle: () => Promise<void>;
  onChangeUser: (jobId: string) => void;
  resStatus: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  isLogin,
}: {
  children: ReactNode;
  isLogin: boolean;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [resStatus, setResStatus] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [lastUser, setLastUser] = useState<User | null>(user);
  const onChangeUser = (jobId: string) => {
    if (user) {
      setLastUser({
        _id: user._id,
        email: user.email,
        profile: user.profile,
        role: user.role,
        username: user.username,
        favorites: user?.favorites.filter((favId) => favId !== jobId),
      });
      setUser(lastUser);
    }
  };
  const checkAuthStatus = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(API_ENDPOINTS.USER_PROFILE);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isLogin) {
      console.log("is login");
      checkAuthStatus();
    }
  }, [isLogin]);

  const login = async ({ email, phone_number, password }: LoginRequest) => {
    setLoading(true);
    try {
      await axiosInstance.post(`${API_ENDPOINTS.SIGN_IN}`, {
        [email ? "email" : "phone_number"]: email || phone_number,
        password,
      });

      // Fetch the user profile data after login
      const res = await axiosInstance.get(API_ENDPOINTS.USER_PROFILE);
      console.log("res.data:::", res.data);
      setUser(res.data);
      setResStatus(res.status);
      setIsAuthenticated(true);
      router.push("/");
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({
    sur_name,
    last_name,
    email,
    phone_number,
    password,
  }: SignupRequest) => {
    setLoading(true);
    try {
      await axiosInstance.post(`${API_ENDPOINTS.SIGN_UP}`, {
        sur_name,
        last_name,
        [email ? "email" : "phone_number"]: email || phone_number,
        password,
        role: "user",
      });

      // TODO: redirect to verify page with contact and method (email or phone_number)
      router.push(
        `/verify?contact=${email || phone_number}&method=${
          email ? "email" : "phone_number"
        }`
      );
    } catch (error) {
      console.log("This error: ", error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verify = async ({ email, phone_number, code }: VerifyUserRequest) => {
    setLoading(true);
    try {
      await axiosInstance.post(`${API_ENDPOINTS.VERIFY}`, {
        [email ? "email" : "phone_number"]: email || phone_number,
        code,
      });

      router.push("/login");
    } catch (error) {
      console.error("Verify failed:", error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const siginWithGoogle = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SIGN_IN_WITH_GOOGLE}?state=user`
      );

      setIsAuthenticated(true);
      window.location.href = response.data.data;
    } catch (error) {
      console.error("Signin with Google failed:", error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(API_ENDPOINTS.SIGN_OUT);
      setIsAuthenticated(false);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout Failed:::", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        setUser,
        login,
        logout,
        signup,
        verify,
        siginWithGoogle,
        onChangeUser,
        resStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

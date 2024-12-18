import { createContext, ReactNode, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios";
import { LoginRequest, User } from "@/utils/types/auth";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
interface AuthContextType {
  login:({email,phone_number,password}:LoginRequest)=>Promise<void>,
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  user:User| null,
  setUser: React.Dispatch<React.SetStateAction<User|null>>
  resStatus: number;

}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider=({
  children,
}: {
  children: ReactNode;
})=>{
  const navigate = useNavigate();
  const [user,setUser]=useState<User|null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resStatus, setResStatus] = useState<number>(0);
  const login = async ({ email, phone_number, password }: LoginRequest) => {
    setLoading(true);
    try {
      await axiosInstance.post(`${API_ENDPOINTS.ADMIN_SIGN_IN}`, {
        [email ? "email" : "phone_number"]: email || phone_number,
        password,
      });

      // Fetch the user profile data after login
      const res = await axiosInstance.get(API_ENDPOINTS.USER_PROFILE);
      console.log("res.data:::", res.data);
      setUser(res.data);
      setResStatus(res.status);
      setIsAuthenticated(true);
      navigate('/')
    } catch (error) {
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
      // send logout to api
      setIsAuthenticated(false);
      setUser(null);
      navigate("/auth/signin");
    } catch (error) {
      console.error("Logout Failed:::", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthContext.Provider
    value={{
      resStatus,
      isAuthenticated,
      loading,
      user,
      setUser,
      login,
      logout

    }}
  >
    {children}
  </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
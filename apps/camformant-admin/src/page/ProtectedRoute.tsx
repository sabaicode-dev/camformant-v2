import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/const/api-endpoints";

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const [isLoading,setIsLoading]=useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.GET_TOKEN}`);
        setIsAuthenticated(true);
        console.log("response::::", response);
      } catch (err) {
        console.log("err:::", err);
        setIsAuthenticated(false);
        navigate("/signin");
      }
      finally{
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  return isAuthenticated&&!isLoading? <Outlet /> : null;
};
export default ProtectedRoutes;

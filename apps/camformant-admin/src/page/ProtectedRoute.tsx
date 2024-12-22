import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/const/api-endpoints";

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.GET_TOKEN}`);
        setIsAuthenticated(true);
        console.log("response::::", response);
      } catch (err) {
        setIsAuthenticated(false);
        navigate("/signin");
      }
    };
    checkAuth();
  }, [navigate]);

  return isAuthenticated ? <Outlet /> : null;
};
export default ProtectedRoutes;

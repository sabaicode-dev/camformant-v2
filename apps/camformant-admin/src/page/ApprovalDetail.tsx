import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../Layout/DefaultLayout";
import axiosInstance from "../utils/axios";
import { API_ENDPOINTS } from "../utils/const/api-endpoints";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CorporatorParams } from "../utils/types/corporator";
import ApproveDetailContent from "../components/ApproveDetail/approve-detail";

const ApprovalDetail = () => {
  const { userSub } = useParams();
  const [userData, setUserData] = useState<CorporatorParams>({
    name: "Unknown",
    profile:
      "https:camformant.s3.ap-southeast-2.amazonaws.com/user-service/upload/default_company.png",
    contact: {
      phone_number: "",
    },
    employee_count: 0,
    email: "",
    description: "",
  });

  useEffect(() => {
    async function getData() {
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.CORPORTOR_ACCOUNT}/${userSub}`
        );
        setUserData(response.data.data);
        console.log("response:::", response);
      } catch (error) {
        console.log("error :", error);
      }
    }
    getData();
  }, [userSub]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Profile" />
      <ApproveDetailContent userData={userData!} />
    </DefaultLayout>
  );
};

export default ApprovalDetail;

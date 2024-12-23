import UserOne from "../../images/user/user-01.png";
import UserTwo from "../../images/user/user-02.png";
import UserThree from "../../images/user/user-03.png";
import UserFour from "../../images/user/user-04.png";
import UserFive from "../../images/user/user-05.png";
import Pagination from "../Pagination";
import { BRAND, CorporatorParams } from "../../utils/types/corporator";
import { useEffect, useRef, useState } from "react";
import TableHeader from "./appro-part.-table.tsx/header";
import TableContent from "./appro-part.-table.tsx/content";
import axiosInstance from "../../utils/axios";
import { API_ENDPOINTS } from "../../utils/const/api-endpoints";
// const brandData: BRAND[] = [
//   {
//     logo: UserOne,
//     name: "Tola",
//     email: "tengtola@gmail.com",
//     createdAt: "2024-12-11T11:51:30.088+00:00",
//     employee: 0,
//     conversion: 4.8,
//   },
//   {
//     logo: UserTwo,
//     name: "Sreyka",
//     email: "cheasreyka@gail.com",
//     createdAt: "2024-11-12T11:51:30.088+00:00",
//     employee: 100,
//     conversion: 4.3,
//   },
//   {
//     logo: UserThree,
//     name: "Nak",
//     email: "Vannak@gmail.com",
//     createdAt: "2024-12-11T11:51:30.088+00:00",
//     employee: 6,
//     conversion: 3.7,
//   },
//   {
//     logo: UserFour,
//     name: "khemra",
//     email: "Khemra@gmail.com",
//     createdAt: "2024-12-11T11:51:30.088+00:00",
//     employee: 8,
//     conversion: 2.5,
//   },
//   {
//     logo: UserFive,
//     name: "na sreytey",
//     email: "kevvichet@gmailgggggggggggggggg.com",
//     createdAt: "2024-12-11T11:51:30.088+00:00",
//     employee: 0,
//     conversion: 4.2,
//   },
// ];
const ApprovalTable = () => {
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState<number>(1);
  const notFetch = useRef<boolean>(false);
  const [corporatorData, setCorporatorData] = useState<CorporatorParams[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const query = `page=${currentPage}&limit=5&filter=${encodeURIComponent('{"status":"unverified"}')}`;
      const res = await axiosInstance.get(
        `${API_ENDPOINTS.ALL_CORPORTOR_ACCOUNT}?${query}`
      );
      setCorporatorData(res.data.data.data);
      if (!notFetch.current) {
        console.log("not fetch again");
        setTotalPages(res.data.data.totalPage);
      }
      notFetch.current = true;
    };
    fetchData();
  }, [currentPage]);
  const verifyUser = async (email: string, sub: string, id: string) => {
    try {
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.ADMIN_VERIFY_USER}`,
        { email, sub, id }
      );
      setCorporatorData((previous: CorporatorParams[]) => {
        return previous.filter((item: CorporatorParams) => item.sub !== sub);
      });
      console.log("response in verify::::", response);
    } catch (err) {
      console.error("error in verify", err);
    }
  };
  const deleteUser = async (sub: string) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.ADMIN_DELETE_USER}/${sub}`
      );
      notFetch.current = false;
      setCorporatorData((previous: CorporatorParams[]) => {
        return previous.filter((item: CorporatorParams) => item.sub !== sub);
      });
      console.log("response in delete::::", response);
      setCurrentPage(1);
    } catch (err) {
      console.error("error in delete", err);
    }
  };

  const handlePageChange = (page: number) => {
    console.log("in handle:::", page);
    setCurrentPage(page);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col w-full">
        {/* Table Header */}
        <TableHeader />

        <TableContent
          data={corporatorData}
          verifyUser={verifyUser}
          deleteUser={deleteUser}
        />

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ApprovalTable;

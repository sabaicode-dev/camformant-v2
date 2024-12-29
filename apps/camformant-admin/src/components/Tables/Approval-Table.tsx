import Pagination from "../Pagination";
import { CorporatorParams } from "../../utils/types/corporator";
import { useEffect, useRef, useState } from "react";
import TableHeader from "./appro-part.-table.tsx/header";
import TableContent from "./appro-part.-table.tsx/content";
import axiosInstance from "../../utils/axios";
import { API_ENDPOINTS } from "../../utils/const/api-endpoints";
import SkeletonLoader from "../skeleton/skeleton-loader";
const ApprovalTable = () => {
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState<number>(1);
  const notFetch = useRef<boolean>(false);
  const [corporatorData, setCorporatorData] = useState<CorporatorParams[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const query = `page=${currentPage}&limit=5&filter=${encodeURIComponent(
          '{"status":"unverified"}'
        )}`;
        const res = await axiosInstance.get(
          `${API_ENDPOINTS.CORPORTOR_ACCOUNT}?${query}`
        );
        setCorporatorData(res.data.data.data);
        if (!notFetch.current) {
          console.log("not fetch again");
          setTotalPages(res.data.data.totalPage);
        }
        notFetch.current = true;
      } catch (err) {
        console.log("err::", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);
  const verifyUser = async (email: string, sub: string, id: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.ADMIN_VERIFY_USER}`,
        { email, sub, id }
      );
      setCorporatorData((previous: CorporatorParams[]) => {
        const corporArr = previous.filter(
          (item: CorporatorParams) => item.sub !== sub
        );
        const corporLength: number = corporArr.length;
        if (!corporLength) {
          setCurrentPage(currentPage === 1 ? currentPage : currentPage - 1);
          notFetch.current = false;
        }
        return corporArr;
      });
      console.log("response in verify::", response);
    } catch (err) {
      console.error("error in verify", err);
    } finally {
      setIsLoading(false);
    }
  };
  const deleteUser = async (sub: string) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`${API_ENDPOINTS.ADMIN_DELETE_USER}/${sub}`);
      setCorporatorData((previous: CorporatorParams[]) => {
        const corporArr = previous.filter(
          (item: CorporatorParams) => item.sub !== sub
        );
        const corporLength: number = corporArr.length;
        if (!corporLength) {
          setCurrentPage(currentPage === 1 ? currentPage : currentPage - 1);
          notFetch.current = false;
        }
        return corporArr;
      });
    } catch (err) {
      console.error("error in delete::::", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    console.log("in handle", page);
    setCurrentPage(page);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {isLoading ? <SkeletonLoader text="loading..."/> : <></>}
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

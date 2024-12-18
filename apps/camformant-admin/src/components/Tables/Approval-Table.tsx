
import UserOne from "../../images/user/user-01.png";
import UserTwo from "../../images/user/user-02.png";
import UserThree from "../../images/user/user-03.png";
import UserFour from "../../images/user/user-04.png";
import UserFive from "../../images/user/user-05.png";
import { FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { BRAND } from "../../utils/types/brand";
import { convertDate } from "../../utils/functions/approval-func";
const brandData: BRAND[] = [
  {
    logo: UserOne,
    name: "Tola",
    email: "tengtola@gmail.com",
    createdAt: "2024-12-11T11:51:30.088+00:00",
    employee:0,
    conversion: 4.8,
  },
  {
    logo: UserTwo,
    name: "Sreyka",
    email: "cheasreyka@gdddddmail.com",
    createdAt: "2024-11-12T11:51:30.088+00:00",
    employee: 100,
    conversion: 4.3,
  },
  {
    logo: UserThree,
    name: "Nak",
    email: "Vannak@gmail.com",
    createdAt: "2024-12-11T11:51:30.088+00:00",
    employee: 6,
    conversion: 3.7,
  },
  {
    logo: UserFour,
    name: "khemra",
    email: "Khemra@gmail.com",
    createdAt: "2024-12-11T11:51:30.088+00:00",
    employee: 8,
    conversion: 2.5,
  },
  {
    logo: UserFive,
    name: "Vichetjiohjeohgjrthr uithutjjh",
    email: "kevvichet@gmail.com",
    createdAt: "2024-12-11T11:51:30.088+00:00",
    employee: 0,
    conversion: 4.2,
  },
];

const ApprovalTable = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-[100px,200px,250px,150px,100px,150px] rounded-sm bg-gray-2 dark:bg-meta-4">
          {/* Profile Header */}
          <div className="p-2.5 xl:p-5 flex items-center justify-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
              Profile
            </h5>
          </div>

          {/* Name Header */}
          <div className="p-2.5 xl:p-5 flex items-center justify-start">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Name</h5>
          </div>

          {/* Email Header */}
          <div className="p-2.5 xl:p-5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
          </div>

          {/* Created At Header */}
          <div className="p-2.5 xl:p-5 text-center">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Created At</h5>
          </div>

          {/* Employees Header */}
          <div className="p-2.5 xl:p-5 text-center hidden sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Employees</h5>
          </div>

          {/* Actions Header */}
          <div className="p-2.5 xl:p-5 text-center hidden sm:block">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Actions</h5>
          </div>
        </div>

        {/* Table Rows */}
        {brandData.map((brand, key) => (
          <div
            className={`grid grid-cols-[100px,200px,250px,150px,100px,150px] ${
              key === brandData.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            {/* Profile Column */}
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <img
                  src={brand.logo}
                  alt={`${brand.name} Logo`}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Name Column */}
            <div className="flex items-center justify-start p-2.5 xl:p-5">
              <p className="text-black dark:text-white truncate">{brand.name}</p>
            </div>

            {/* Email Column */}
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white truncate overflow-hidden text-ellipsis">
                {brand.email}
              </p>
            </div>

            {/* Created At Column */}
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{convertDate(brand.createdAt)}</p>
            </div>

            {/* Employees Column */}
            <div className="hidden sm:flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{brand.employee}</p>
            </div>

            {/* Actions Column */}
            <div className="hidden sm:flex items-center justify-center p-2.5 xl:p-5">
              <div className="flex items-center space-x-3.5">
                <button className="hover:text-primary">
                  <FaRegEye />
                </button>
                <button className="hover:text-primary">
                  <FaRegTrashAlt color="red" />
                </button>
                <button className="hover:text-primary">
                  <FaCheck color="green" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};






export default ApprovalTable;

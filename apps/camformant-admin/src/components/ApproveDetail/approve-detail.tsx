import { HiOutlineMail } from "react-icons/hi";
import { CorporatorParams } from "../../utils/types/corporator";
import CoverOne from "../../images/cover/cover-01.png";
import { MdOutlinePhone } from "react-icons/md";
const ApproveDetailContent:React.FC<{
  userData:CorporatorParams
}> = ({userData}) => {
  return (
    <div className="overflow-hidden rounded-sm border pb-4 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="z-20 h-35 md:h-65">
        <img
          src={CoverOne}
          alt="profile cover"
          className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
        />
        <div className="z-30 rounded-full overflow-hidden -mt-22 w-[150px] h-[150px] ml-10 bg-white/20">
          <img
            src={userData?.profile}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="py-1 grid gap-5">
        <div className="w-1/2 m-auto grid gap-2">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-semibold dark:text-white">
              {userData?.name}
            </h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-300">
              Employee Count: {userData?.employee_count}
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex gap-1 items-center text-gray-700 dark:text-gray-300">
              <HiOutlineMail className="h-6 w-5 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {userData?.email}
              </p>
            </div>
            <div className="flex gap-1 items-center text-gray-700 dark:text-gray-300">
              <MdOutlinePhone className="h-6 w-5  text-blue-600 dark:text-blue-400" />
              <p className="text-sm  text-blue-600 dark:text-blue-400">
                012 479 478
              </p>
            </div>
          </div>
        </div>
        <div className="w-2/3 grid gap-5 m-auto">
          <div className="w-full grid gap-2">
            <h4 className="font-semibold border-b text-xl text-pink-600 dark:text-pink-400">
              About Me
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              {userData?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveDetailContent;

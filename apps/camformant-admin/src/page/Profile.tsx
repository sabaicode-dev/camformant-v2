import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../Layout/DefaultLayout";
import CoverOne from "../images/cover/cover-01.png";
import userSix from "../images/user/user.jpg";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlinePhone } from "react-icons/md";

const Profile = () => {
  // const getInfo=async()=>{
  // try{
  //   const response=await axiosInstance.get(`${API_ENDPOINTS.ALL_CORPORTOR_ACCOUNT}/${}`)

  // }catch(error){
  //   console.log("error :",error)
  // }
  // }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-sm border pb-4 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className=" z-20 h-35 md:h-65">
          <img
            src={CoverOne}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
          <div className=" z-30 rounded-full  overflow-hidden -mt-22 w-[150px] h-[150px] ml-10  bg-white/20  ">
            <img
              src={userSix}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className=" py-1 grid gap-5">
          <div className="w-1/2 m-auto grid gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-semibold text-black dark:text-white">
                Danish Heilium
              </h3>
              <p>employee_count: 0</p>
            </div>
            <div className="grid gap-2">
              <div className=" flex gap-1">
                <HiOutlineMail className="h-6 w-5" />
                <p className=" text-[14px] leading-6 ">nasreytey@gmail.com</p>
              </div>
              <div className="flex gap-1">
                <MdOutlinePhone className="h-6 w-5" />
                <p className="text-[14px] leading-6">012 479 478</p>
              </div>
            </div>
          </div>
          <div className=" w-2/3 grid gap-5  m-auto">
            <div className=" w-full grid gap-2">
              <h4 className="font-semibold border-b text-[18px] text-black dark:text-white">
                About Me
              </h4>
              <p className="">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque posuere fermentum urna, eu condimentum mauris
                tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus
                ultricies. Sed vel aliquet libero. Nunc a augue fermentum,
                pharetra ligula sed, aliquam lacus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;

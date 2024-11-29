import { Camera } from "lucide-react";
import { RiFacebookCircleLine } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa6";

const Profile = () => {
  return (
    <>
      <div className="bg-white h-full dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Banner Section */}
        <div className="relative h-40 bg-gray-300 dark:bg-gray-700">
          <img
            src="https://media.istockphoto.com/id/1696167872/photo/aerial-view-of-forest-at-sunset-on-the-background-of-mountains-in-dolomites.jpg?s=1024x1024&w=is&k=20&c=sfRAnSjXlDxAAAMZ0ZtYG5GpetUCOqETKyVc0Oz6kyU="
            alt="Background Banner"
            className="object-cover w-full h-full"
          />
          {/* Edit Button for Banner */}
          <button className="absolute bottom-2 right-2 bg-orange-500 text-white p-1 rounded-sm flex items-center space-x-1 hover:bg-orange-600">
            <Camera size={16} />
            <span className="text-sm">Edit</span>
          </button>
        </div>

        {/* Profile Picture */}
        <div className="relative flex justify-center -mt-12">
          <div className="relative w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Profile"
              className="object-cover w-full h-full rounded-full"
            />
            {/* Camera icon for profile image */}
            <button className="absolute bottom-1 right-1 bg-orange-500 text-white p-1 rounded-full hover:bg-orange-600">
              <Camera size={16} />
            </button>
          </div>
        </div>

        {/* User Info Section */}
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Danish Heilum</h2>
          <p className="text-gray-500 dark:text-gray-400">UI/UX Designer</p>
        </div>

        {/* About Me Section */}
        <div className="px-8 py-4 text-center">
          <h3 className="text-[14px] font-bold text-gray-700 dark:text-gray-200">About Me</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the {"industry's"} standard dummy text ever since the 1500s.
          </p>
        </div>

        {/* Contact Information and Social Media */}
        <div className="flex justify-between h-[72px] bg-gray-100 dark:bg-gray-700">
          <div className="h-full">
            <div className="ml-[19px] text-[16px] font-semibold text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-semibold">Email:</span> sabaiCode123@gmail.com
              </p>
              <p>
                <span className="font-semibold">Tel:</span> 023476886
              </p>
            </div>
          </div>

          <div className="h-full">
            {/* Location Information */}
            <div className="text-center text-[16px] font-semibold text-black dark:text-gray-100 mr-[19px]">
              <p>from: Kampong Cham</p>
            </div>
            {/* Social Media Links */}
            <div className="flex justify-center gap-[8px] mt-2">
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                <RiFacebookCircleLine size={24} />
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

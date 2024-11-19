import { SlCloudUpload } from "react-icons/sl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, SquarePen } from "lucide-react";
import CustomFileInput from "@/components/ui/input-file";
import { Button } from "@/components/ui/button";

const FormPage = () => {
  return (
    <>
      <div className="w-full">
        <div className="w-2/3 relative h-[988px] border border-gray-200 m-auto ">
          <h1 className="text-center text-[30px] mt-[27px] ">Personal Information</h1>
          <hr className="border border-gray-200 w-2/4 m-auto" />
          <div className="m-auto w-3/4 mt-[21px] relative">
            <div className="w-full gap-[22px]  flex">
              {/* cover full name and input */}
              <div className="lg:w-2/4">
                <p className="text-[14px]">Full Name</p>
                <div className=" relative h-[46px] mt-[12px] ">
                  <Input
                    placeholder="fullname"
                    className="h-full w-full px-[50px] bg-orange-200 "
                  />
                  <div className="flex absolute top-[13px] px-[18px] ">
                    <User className="w-[20px] h-[20px] text-gray-400" />
                  </div>
                </div>
              </div>
              {/* phone number and input */}
              <div className="lg:w-2/4">
                <p className="text-[14px]">Phone Number</p>
                <div className=" relative h-[46px] mt-[12px]">
                  <Input
                    placeholder="+855 10 663 888"
                    className="h-full w-full px-[50px] bg-orange-200"
                  />
                  <div className="flex absolute top-[13px] px-[18px] ">
                    <Phone className="w-[20px] h-[20px] text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mt-[20px]">
              {/* address */}
              <div className="w-full">
                <p className="text-[14px]">Email Address</p>
                <div className=" relative h-[46px] mt-[12px]">
                  <Input
                    placeholder="leakna18@gmail.com"
                    className="h-full w-full bg-orange-200 px-[50px]"
                  />
                  <div className="flex absolute top-[13px] px-[18px] ">
                    <Mail className="w-[20px] h-[20px] text-gray-400" />
                  </div>
                </div>
              </div>
              {/* username */}
              <div className="w-full mt-[20px]">
                <p className="text-[14px]">Username</p>
                <div className=" relative h-[46px] mt-[12px]">
                  <Input
                    placeholder="username"
                    className="h-full w-ull bg-orange-200 px-[20px]"
                  />
                  {/* <div className="flex absolute top-[13px] px-[18px]">
                    <Mail className="w-[20px] h-[20px] text-gray-400" />
                  </div> */}
                </div>
              </div>
              {/* for upload file */}
              <div className="w-full border p-2 mt-[20px] rounded-sm">
                <div className=" w-full h-full items-center gap-1.5">
                  <Label htmlFor="picture" className="text-[16px]">
                    Add Your Photo
                  </Label>
                  <div className="h-full w-full">
                    <div className="text-[14px] w-2/4 m-auto ">
                      <div className="flex justify-center  ">
                        <CustomFileInput />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* text of BIO */}
              <div className="w-full mt-[20px]">
                <Label htmlFor="picture" className="text-[16px] ">
                  BIO
                </Label>
                <div className=" w-full h-full p-4 rounded-sm bg-orange-50 mt-[12px] items-center gap-1.5">
                  <div className="flex gap-[12px] h-[230px] p-[20px]">
                    <div className="w-auto">
                      <SquarePen className="h-[20px] w-[20px] dark:text-black" />
                    </div>
                    <p className="w-auto h-[196px] dark:text-black ">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Aliquam lacinia turpis tortor, consequat efficitur mi
                      congue a. Curabitur cursus, ipsum ut lobortis sodales,
                      enim arcu pellentesque lectus ac suscipit diam sem a
                      felis. Cras sapien ex, blandit eu dui et suscipit gravida
                      nunc. Sed sed est quis dui.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="flex gap-[20px] absolute right-[19px] mt-[16px] ">
              <Button variant={"none"} className="bg-white text-black border">
                Cancel
              </Button>
              <Button
                variant={"orange"}
                className="bg-orange-400 text-white border"
              >
                Save
              </Button>
            </div>
        </div>
      </div>
    </>
  );
};

export default FormPage;

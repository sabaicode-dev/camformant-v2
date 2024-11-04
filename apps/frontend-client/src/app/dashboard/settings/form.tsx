import InputText from "@/components/input-text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail } from "lucide-react";

const FormPage = () => {
  return (
    <>
      <div className="w-full">
        <h1 className="text-center text-[30px]">Personal Information</h1>
        <hr className="border border-gray-200 w-[636px] m-auto " />
        <div className="flex flex-wrap gap-[22px] bg-blue-200 w-3/4 mt-[21px] m-auto justify-center ">
          <div className=" w-2/5">
            <p className="text-[14px]">Full Name</p>
            <div className=" relative h-[46px] mt-[12px] ">
              <Input
                placeholder="fullname"
                className="h-full w-[279px] bg-orange-200 px-[50px]  "
              />
              <div className="flex absolute top-[13px] px-[18px] ">
                <User className="w-[20px] h-[20px] text-gray-400" />
              </div>
            </div>
          </div>
          <div className="w-2/5">
            <p className="text-[14px]">Phone Number</p>
            <div className=" relative h-[46px] mt-[12px]">
              <Input
                placeholder="+855 10 663 888"
                className="h-full w-[279px] bg-orange-200 px-[50px]"
              />
              <div className="flex absolute top-[13px] px-[18px] ">
                <Phone className="w-[20px] h-[20px] text-gray-400" />
              </div>
            </div>
          </div>
          <div className="w-3/4">
            <p className="text-[14px]">Email Address</p>
            <div className=" relative h-[46px] mt-[12px]">
              <Input
                placeholder="leakna18@gmail.com"
                className="h-full w-[580px] bg-orange-200 px-[50px]"
              />
              <div className="flex absolute top-[13px] px-[18px] ">
                <Mail className="w-[20px] h-[20px] text-gray-400" />
              </div>
            </div>
          </div>
          <div className="w-3/4">
            <p className="text-[14px]">Username</p>
            <div className=" relative h-[46px] mt-[12px]">
              <Input
                placeholder="username"
                className="h-full w-[580px] bg-orange-200 px-[50px]"
              />
              <div className="flex absolute top-[13px] px-[18px]">
                <Mail className="w-[20px] h-[20px] text-gray-400" />
              </div>
            </div>
          </div>
          <div className="w-[580px] border bg-pink-400">
            <div className=" max-w-sm w-[400px] h-[160px] items-center gap-1.5">
              <Label htmlFor="picture">Add Your Photo</Label>
              <div className="border-none">
                <Input
                  id="picture"
                  type="file"
                  className="text-red-300 w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormPage;

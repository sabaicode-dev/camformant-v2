import ChatProfile from "@/components/user-profile";
import ProfileChat from "@/components/profile-chat";
import { Input } from "@/components/ui/input";
import ButtonSend from "@/components/button-send";
import { Image } from "lucide-react";

const ChatPage = () => {
  return (
    <div className="w-5/6 m-auto flex py-2">
      <div className="w-2/6 border-r-2  ">
        <div className="flex h-[80px] justify-center items-center">
          <Input placeholder="search" className="w-3/4 h-[42px] border border-gray-200 rounded-2xl" />
        </div>
        <div className="w-full px-2">
          <ChatProfile
            name="Jonh Doe"
            job="sale"
            profileImage="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </div>
      </div>
      <div className="w-4/6 flex flex-col h-[600px] ">
        <div className="flex w-full h-[68px] p-[16px] items-center border-b-2 border-gray-200">Jonh Doe</div>
        <div className="w-full px-7 flex-grow">
          <ProfileChat
            message="hello"
            profileImage="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </div>
        <div className=" flex gap-[20px] items-center h-[40px] justify-center mt-auto ">
          <Image className=" text-orange-400" />
          <Input
            placeholder="type message"
            className="w-2/5 h-full bg-orange-100 focus:outline-none "
          />
          <ButtonSend />
        </div>
      </div>
    </div>
  );
};
export default ChatPage;

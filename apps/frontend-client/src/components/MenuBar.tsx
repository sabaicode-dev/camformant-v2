"use client";
import { useRef } from "react";
import { Menubar } from "@/components/ui/menubar";
import { SidebarGroup, SidebarGroupLabel, SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./ui/modeToggle";
import { Bell, Mail, SearchCheckIcon } from "lucide-react";
import { Input } from "./ui/input";
import { ToolTip } from "./ToolTip";
import { UserProfile } from "./UserProfile";
import SabaiROkLogo from "../../public/logoSabaiRok.svg";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export const MenuBar = () => {
  const {user}=useAuth()
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  };

  return (
    <Menubar className="w-full py-8 z-40">
      {/* logo */}
      <div className="w-1/6 flex items-center">
        <SidebarGroup>
          <SidebarGroupLabel>
            <div>
              <Image src={SabaiROkLogo} width={100} height={100} alt="logo" />
            </div>
          </SidebarGroupLabel>
        </SidebarGroup>
      </div>
      {/* cover all left on navbar */}
      <div className="w-5/6 flex justify-between h-[50px] px-5 items-center">
        {/* search button */}
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <SearchCheckIcon
            onClick={handleSearch}
            className="cursor-pointer"
          />
          <div className="h-[40px] border w-[319px] border-gray-300  dark:border dark:border-gray-100 rounded-md">
            <Input ref={inputRef} placeholder="Search..." className="h-full" />
          </div>
        </div>
        <div className="flex justify-between w-[200px]">
          <div className=" flex items-center gap-2">
            <div className="">
              <ModeToggle />
            </div>
            <ToolTip icon={<Bell />} text="Notification" />
            <ToolTip icon={<Mail />} text="Inbox" />
          </div>
          <UserProfile
            avatarImage={user?.profile||"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCO2sR3EtGqpIpIa-GTVnvdrDHu0WxuzpA8g&s"}
            fallback={user?.name}
          />
        </div>
      </div>
    </Menubar>
  );
};

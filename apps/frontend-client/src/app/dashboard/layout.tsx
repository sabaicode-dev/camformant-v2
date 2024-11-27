import React, { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MenuBar } from "@/components/MenuBar";
import KakSideBar from "@/components/KakSideBar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
    <div className="w-full flex overflow-x-hidden">
      {/* <AppSidebar /> */}
      <KakSideBar />
      <div className="relative h-screen w-full">
        <div className="fixed top-0 z-10 w-full">
          <MenuBar />
        </div>
        <div className="pt-[4.5%] h-full w-full">
          {children}
        </div>
      </div>
    </div>
  </SidebarProvider>
  
  );
};

export default layout;

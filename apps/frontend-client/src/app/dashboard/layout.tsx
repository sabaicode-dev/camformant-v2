import React, { ReactNode } from "react";
import { MenuBar } from "@/components/MenuBar";
import { DynamicBreadcrumb } from "@/components/breadcrumb/dynamic-breadcrumb";
import { SidebarProvider } from "@/context/SidebarContext";
import SideBarCom from "@/components/SideBarCom";
import { SocketContextProvider } from "@/context/SocketContext";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <SocketContextProvider>
      <div className="h-screen w-full">
        <div className="w-full dark:bg-black dark:text-white bg-white text-black relative z-10">
            <MenuBar />
          </div>
        <div className="flex">
          <SideBarCom/>
          <div className="w-full h-screen overflow-y-auto pt-16 px-5 bg-slate-50">
            <DynamicBreadcrumb />
            {children}
          </div>
        </div>
      </div>
      </SocketContextProvider>
    </SidebarProvider>
  );
};

export default layout;
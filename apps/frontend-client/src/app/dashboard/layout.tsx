import React, { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MenuBar } from "@/components/MenuBar";
import { DynamicBreadcrumb } from "@/components/breadcrumb/dynamic-breadcrumb";
import KakSideBar from "@/components/KakSideBar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="h-screen w-full">
        <div className="w-full dark:bg-black dark:text-white bg-white text-black relative z-10">
            <MenuBar />
          </div>
        <div className="flex">
          {/* <AppSidebar /> */}
          <KakSideBar/>
          <div className="w-full h-screen overflow-y-auto pt-16 px-5">
            <DynamicBreadcrumb />
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default layout;
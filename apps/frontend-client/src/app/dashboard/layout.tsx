import React, { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MenuBar } from "@/components/MenuBar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        {/* Sidebar */}
        <div className="">
          <AppSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Full-Width Navbar */}
          <div className="w-full dark:bg-black dark:text-white bg-white text-black fixed top-0 left-0 z-10">
            <MenuBar />
          </div>
          
          {/* Offset content to account for navbar height */}
          <div className="pt-[4rem] w-full p-4">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default layout;

import React, { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MenuBar } from "@/components/MenuBar";
import KakSideBar from "@/components/KakSideBar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* <div className="h-screen overflow-y-auto">
        </div> */}
          {/* <AppSidebar /> */}
          <KakSideBar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Full-Width Navbar */}
          <div className="sticky top-0 left-0 z-10">
          <MenuBar />
          </div>

          {/* Offset content to account for navbar height */}
          <div className="h-screen">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default layout;

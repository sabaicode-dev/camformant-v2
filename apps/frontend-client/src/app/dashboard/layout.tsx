import React, { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MenuBar } from "@/components/MenuBar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar with independent scrolling */}
        <div className="h-full overflow-y-auto">
          <AppSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Full-Width Navbar */}
          <div className="w-full dark:bg-black dark:text-white bg-white text-black fixed top-0 left-0 z-10">
            <MenuBar />
          </div>

          {/* Offset content to account for navbar height */}
          <div className="pt-[4rem] h-full overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default layout;

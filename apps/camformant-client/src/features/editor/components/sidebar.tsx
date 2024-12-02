"use client";
import React, { SetStateAction } from "react";
import { SidebarItem } from "@/features/editor/components/sidebar-item";
import { ActiveTool } from "@/features/editor/types";
import { LayoutTemplate, ImageIcon, Settings, Type } from "lucide-react";
import Shapes from "./icons/svg components/shapes";
interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  setOpenTemplate: React.Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({
  activeTool,
  onChangeActiveTool,
  setOpenTemplate,
}: SidebarProps) {
  return (
    <aside className="flex items-center justify-center w-full h-full overflow-x-scroll bg-white border-b border-b-orange-300 whitespace-nowrap">
      <SidebarItem
        icon={LayoutTemplate}
        label="Design"
        isActive={activeTool === "templates"}
        onClick={() => {
          onChangeActiveTool("templates");
          setOpenTemplate(true);
          console.log("template");
        }}
      />
      <SidebarItem
        icon={ImageIcon}
        label="Image"
        isActive={activeTool === "images"}
        onClick={() => onChangeActiveTool("images")}
      />
      <SidebarItem
        icon={Type}
        label="Text"
        isActive={activeTool === "text"}
        onClick={() => onChangeActiveTool("text")}
      />
      <SidebarItem
        icon={Shapes}
        label="Shapes"
        isActive={activeTool === "shapes"}
        onClick={() => onChangeActiveTool("shapes")}
      />
      {/* <SidebarItem
        icon={Sparkles}
        label="AI"
        isActive={activeTool === "ai"}
        onClick={() => onChangeActiveTool("ai")}
      /> */}
      <SidebarItem
        icon={Settings}
        label="Settings"
        isActive={activeTool === "settings"}
        onClick={() => onChangeActiveTool("settings")}
      />
    </aside>
  );
}

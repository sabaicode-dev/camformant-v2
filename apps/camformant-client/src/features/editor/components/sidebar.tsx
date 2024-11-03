"use client";
import React from "react";
import { SidebarItem } from "@/features/editor/components/sidebar-item";
import { ActiveTool } from "@/features/editor/types";
import {
  LayoutTemplate,
  ImageIcon,
  Pencil,
  Presentation,
  Settings,
  Sparkles,
  Type,
} from "lucide-react";
import Shapes from "./icons/svg components/shapes";
interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export function Sidebar({ activeTool, onChangeActiveTool }: SidebarProps) {
  return (
    <aside className="bg-white border-r flex w-full h-full overflow-x-scroll whitespace-nowrap items-center justify-center">
      <SidebarItem
        icon={LayoutTemplate}
        label="Design"
        isActive={activeTool === "templates"}
        onClick={() => onChangeActiveTool("templates")}
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

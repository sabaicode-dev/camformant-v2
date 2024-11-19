"use client";
import React, { useState } from "react";
import { useFilePicker } from "use-file-picker";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Download,
  MousePointer,
  MousePointerClick,
  Redo2,
  Undo2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Hint } from "@/components/hint";
//Icons
import { CiFileOn } from "react-icons/ci";
import { ActiveTool, Editor } from "@/features/editor/types";
import { IoArrowBack } from "react-icons/io5";

interface NavbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Navbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: NavbarProps) => {
  const { openFilePicker } = useFilePicker({
    accept: ".json",
    onFilesSuccessfullySelected: ({ plainFiles }: any) => {
      if (plainFiles && plainFiles.length > 0) {
        const file = plainFiles[0];
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = () => {
          editor?.loadJson(reader.result as string);
        };
      }
    },
  });
  const [isEditable, setIsEditable] = useState<boolean>(false);
  return (
    <nav className="w-full flex items-center h-[68px] gap-x-8 border-b border-orange-300 lg:pl-[34px]">
      <div className="flex items-center justify-between w-full h-full p-4 gap-x-1">
        <div className="flex items-center gap-3">
          <div
            onClick={() => {
              history.back();
            }}
          >
            <IoArrowBack className="size-5" />
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="py-6 hover:bg-orange-100"
              >
                File
                <ChevronDown className="ml-2 size-4"></ChevronDown>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="p-0 bg-white border-gray-100 min-w-60"
            >
              <DropdownMenuItem
                onClick={() => openFilePicker()}
                className="flex items-center gap-x-2 hover:bg-orange-300"
              >
                <CiFileOn className="size-8" />
                <div>
                  <p>Open</p>
                  <p className="text-xs text-muted-foreground">
                    Open Json File
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex">
          <Hint label="Undo" side="bottom" sideOffset={10}>
            <Button
              disabled={!editor?.canUndo()}
              variant="ghost"
              size="icon"
              onClick={() => editor?.onUndo()}
            >
              <Undo2 className="size-4" />
            </Button>
          </Hint>
          <Hint label="Redo" side="bottom" sideOffset={10}>
            <Button
              disabled={!editor?.canRedo()}
              variant="ghost"
              size="icon"
              onClick={() => editor?.onRedo()}
            >
              <Redo2 className="size-4" />
            </Button>
          </Hint>
        </div>
        <div className="flex  gap-3">
          <div className="flex items-center cursor-pointer">
            <button
              className="text-xs text-muted-foreground bg-orange-300 rounded px-3 py-2 border-red-300 "
              onClick={() => {
                if (isEditable) {
                  editor?.updateCv();
                  editor?.setUneditable();
                  setIsEditable(false);
                } else {
                  editor?.setEditable();
                  setIsEditable(true);
                }
              }}
            >
              {isEditable ? "Save" : "Edit"}
            </button>
          </div>
          <div className="flex items-center gap-x-4">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className=" hover:bg-orange-100"
                >
                  <Download className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="p-0 bg-white border-gray-100 min-w-60"
              >
                <DropdownMenuItem
                  className="flex items-center gap-x-2 hover:bg-orange-100"
                  onClick={() => editor?.saveJson()}
                >
                  <CiFileOn className="size-8" />
                  <div>
                    <p>JSON</p>
                    <p className="text-xs text-muted-foreground">
                      Save for later editing
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-x-2 hover:bg-orange-100"
                  onClick={() => editor?.savePng()}
                >
                  <CiFileOn className="size-8" />
                  <div>
                    <p>PNG</p>
                    <p className="text-xs text-muted-foreground">
                      Best for sharing on the web
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-x-2 hover:bg-orange-100"
                  onClick={() => editor?.saveJpg()}
                >
                  <CiFileOn className="size-8" />
                  <div>
                    <p>JPG</p>
                    <p className="text-xs text-muted-foreground">
                      Best for printing
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-x-2 hover:bg-orange-100"
                  onClick={() => editor?.saveSvg()}
                >
                  <CiFileOn className="size-8" />
                  <div>
                    <p>SVG</p>
                    <p className="text-xs text-muted-foreground">
                      Best for editing in vector software
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-x-2 hover:bg-orange-100"
                  onClick={() => editor?.savePdf()}
                >
                  <CiFileOn className="size-8" />
                  <div>
                    <p>PDF</p>
                    <p className="text-xs text-muted-foreground">
                      Best for saving
                    </p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

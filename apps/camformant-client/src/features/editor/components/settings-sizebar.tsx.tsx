import { cn } from "@/lib/utils";

import { ActiveTool, Editor, FILL_COLOR } from "@/features/editor/types";

import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";

import { ColorPicker } from "@/features/editor/components/color-picker";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SettingsSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const SettingsSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: SettingsSidebarProps) => {
  //workspace
  const workspace = editor?.getWorkspace();
  const initialWidth = useMemo(() => `${workspace?.width ?? 0}`, [workspace]);
  const initialHeight = useMemo(() => `${workspace?.height ?? 0}`, [workspace]);
  const initialBackground = useMemo(
    () => workspace?.fill ?? "#ffffff",
    [workspace]
  );
  // state width, height workspace
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [background, setBackground] = useState(initialBackground);

  useEffect(() => {
    setWidth(initialWidth);
    setHeight(initialHeight);
    setBackground(initialBackground);
  }, [initialWidth, initialHeight, initialBackground]);

  const changeWidth = (value: string) => setWidth(value);
  const changeHeight = (value: string) => setHeight(value);
  const changeBackground = (value: string) => {
    setBackground(value);
    editor?.changeBackground(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editor?.changeSize({
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    });
  };

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] flex justify-center items-center",
        activeTool === "settings" ? "visible" : "hidden"
      )}
    >
      <ScrollArea>
        <div className="p-4 space-x-3 border-b flex overflow-x-auto">
          <ColorPicker
            value={background as string} //can use only string for color : hex,rgba as string
            onChange={changeBackground}
          />
        </div>
      </ScrollArea>
    </aside>
  );
};

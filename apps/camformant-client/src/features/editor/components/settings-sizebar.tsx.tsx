import { cn } from "@/lib/utils";

import { ActiveTool, Editor, FILL_COLOR } from "@/features/editor/types";
import { ColorPicker } from "@/features/editor/components/color-picker";
import { useEffect, useMemo, useState } from "react";

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

  const changeBackground = (value: string) => {
    setBackground(value);
    editor?.changeBackground(value);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] flex justify-center items-center overflow-y-auto max-h-[500px]",
        activeTool === "settings" ? "visible" : "hidden"
      )}
    >
      <div className=" p-2 overflow-hidden w-full">
        <ColorPicker
          value={background as string} //can use only string for color : hex,rgba as string
          onChange={changeBackground}
        />
      </div>
    </aside>
  );
};

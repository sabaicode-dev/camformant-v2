import { cn } from "@/lib/utils";

import { ActiveTool, Editor, STROKE_COLOR } from "@/features/editor/types";

import { ColorPicker } from "@/features/editor/components/color-picker";

interface StrokeColorSidebarProps {
  editor: Editor | undefined;
  activeTool?: ActiveTool;
  onChangeActiveTool?: (tool: ActiveTool) => void;
}

export const StrokeColorSidebar = ({
  editor,
  activeTool = "select",
  onChangeActiveTool = () => {},
}: StrokeColorSidebarProps) => {
  const value = editor?.getActiveStrokeColor() || STROKE_COLOR;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChange = (value: string) => {
    editor?.changeStrokeColor(value);
  };

  return (
    <aside
      className={cn(
        "bg-white border-r z-[40] flex absolute justify-center w-full",
        activeTool === "stroke-color" ? "visible" : "hidden"
      )}
    >
      <div className="w-full overflow-x-scroll bg-white h-[55px] flex justify-center items-center">
        <ColorPicker value={value} onChange={onChange} />
      </div>
    </aside>
  );
};

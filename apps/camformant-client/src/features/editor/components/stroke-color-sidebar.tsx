import { cn } from "@/lib/utils";

import { ActiveTool, Editor, STROKE_COLOR } from "@/features/editor/types";

import { ColorPicker } from "@/features/editor/components/color-picker";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        "bg-white border-r flex absolute justify-start bottom-[108px] h-auto left-0 overflow-hidden right-0",
        activeTool === "stroke-color" ? "visible" : "hidden"
      )}
    >
      <ScrollArea>
        <ColorPicker value={value} onChange={onChange} />
      </ScrollArea>
    </aside>
  );
};

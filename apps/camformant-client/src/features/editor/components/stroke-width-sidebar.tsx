import { cn } from "@/lib/utils";

import {
  ActiveTool,
  Editor,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
} from "@/features/editor/types";

import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface StrokeWidthSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const StrokeWidthSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: StrokeWidthSidebarProps) => {
  const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
  const typeValue = editor?.getActiveStrokeDashArray() || STROKE_DASH_ARRAY;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChangeStrokeWidth = (value: number) => {
    editor?.changeStrokeWidth(value);
  };

  const onChangeStrokeType = (value: number[]) => {
    editor?.changeStrokeDashArray(value);
  };

  return (
    <aside
      className={cn(
        "bg-white relative z-[40] h-full flex items-center gap-4 mx-2",
        activeTool === "stroke-width" ? "visible" : "hidden"
      )}
    >
      <Slider
        value={[widthValue]}
        onValueChange={(values) => onChangeStrokeWidth(values[0])}
        className="w-[300px] h-2 bg-gray-200 rounded-md"
      />
      <Button
        onClick={() => onChangeStrokeType([])}
        variant="secondary"
        size="lg"
        className={cn(
          "w-[300px] h-16 justify-center text-left",
          JSON.stringify(typeValue) === `[]` && "border-2 border-blue-500"
        )}
        style={{ padding: "8px 16px" }}
      >
        <div className="w-full border-black rounded-full border-4" />
      </Button>
      <Button
        onClick={() => onChangeStrokeType([5, 5])}
        variant="secondary"
        size="lg"
        className={cn(
          "w-[300px] h-16 justify-center text-left",
          JSON.stringify(typeValue) === `[5,5]` && "border-2 border-blue-500"
        )}
        style={{ padding: "8px 16px" }}
      >
        <div className="w-full border-black rounded-full border-4 border-dashed" />
      </Button>
    </aside>
  );
};

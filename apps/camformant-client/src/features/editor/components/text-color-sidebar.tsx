import { cn } from "@/lib/utils";
import { ActiveTool, Editor, FILL_COLOR } from "@/features/editor/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "@/features/editor/components/color-picker";

interface TextColorSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TextColorSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TextColorSidebarProps) => {
  const value = editor?.getActiveFillColor() || FILL_COLOR;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChange = (value: string) => {
    editor?.changeFillColor(value);
  };

  return (
    <aside
      className={cn(
        "bg-white border-r flex absolute justify-start bottom-[108px] h-auto left-0 overflow-hidden right-0",
        activeTool === "textcolor" ? "visible" : "hidden"
      )}
    >
      <ScrollArea>
        {" "}
        <ColorPicker value={value} onChange={onChange} />
      </ScrollArea>
    </aside>
  );
};

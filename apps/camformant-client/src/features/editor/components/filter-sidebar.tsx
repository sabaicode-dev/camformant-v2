import { cn } from "@/lib/utils";

import { ActiveTool, Editor, filters } from "@/features/editor/types";

import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FilterSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FilterSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white border-r flex absolute justify-start bottom-[108px] h-auto left-0 overflow-hidden right-0",
        activeTool === "filter" ? "visible" : "hidden"
      )}
    >
      {/* Header Sidebar */}

      <div className="p-4 space-y-1 border-b flex items-center overflow-auto">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant="secondary"
            size="lg"
            className={cn("w-full h-16 justify-start text-left")}
            onClick={() => editor?.changeImageFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>
    </aside>
  );
};

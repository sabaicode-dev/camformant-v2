import { cn } from "@/lib/utils";

import { ActiveTool, Editor } from "@/features/editor/types";

import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface TextSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TextSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TextSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] flex justify-center items-center",
        activeTool === "text" ? "visible" : "hidden"
      )}
    >
      {/* Header Sidebar */}
      {/* <ToolSidebarHeader title="Text" description="Add text to your canvas" /> */}
      <ScrollArea>
        <div className="p-4 space-x-3 border-b flex overflow-x-auto">
          <Button
            className="w-36 h-8"
            onClick={() =>
              editor?.addText("TEXT", {
                width: 200,
              })
            }
          >
            TEXT
          </Button>
          <Button
            className="w-36 h-8"
            variant="secondary"
            size="lg"
            onClick={() =>
              editor?.addText("HEADING", {
                fontSize: 48,
                fontWeight: 700,
              })
            }
          >
            <span className="text-2xl font-bold">HEADING</span>
          </Button>
          <Button
            className="w-36 h-8"
            variant="secondary"
            size="lg"
            onClick={() =>
              editor?.addText("SubHeading", {
                fontSize: 30,
                fontWeight: 600,
              })
            }
          >
            <span className="text-xl font-semibold">SUB HEADING</span>
          </Button>
          <Button
            className="w-36 h-8"
            variant="secondary"
            size="lg"
            onClick={() =>
              editor?.addText("Paragraph", {
                fontSize: 18,
              })
            }
          >
            Paragraph
          </Button>
        </div>
      </ScrollArea>
      {/* Footer SideBar */}
      {/* <ToolSidebarClose onClick={onClose} /> */}
    </aside>
  );
};

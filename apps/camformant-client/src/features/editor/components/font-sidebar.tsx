import { cn } from "@/lib/utils";

import { ActiveTool, Editor, fonts } from "@/features/editor/types";

import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface FontSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FontSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FontSidebarProps) => {
  const value = editor?.getActiveFontFamily();

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] flex justify-center items-center",
        activeTool === "font" ? "visible" : "hidden"
      )}
    >
      {/* Header Sidebar */}
      {/* <ToolSidebarHeader title="Fonts" description="Change Font to your text" /> */}
      <ScrollArea>
        <div className="p-4 space-x-3 border-b flex overflow-x-auto">
          {fonts.map((font) => (
            <Button
              key={font}
              variant="secondary"
              size="sm"
              className={cn(
                "h-10 justify-start text-left",
                value === font && "border-2 border-blue-500"
              )}
              style={{
                fontFamily: font,
                fontSize: "16px",
                padding: "8px 16px",
              }}
              onClick={() => editor?.changeFontFamily(font)}
            >
              {font}
            </Button>
          ))}
        </div>
      </ScrollArea>
      {/* Footer SideBar */}
      {/* <ToolSidebarClose onClick={onClose} /> */}
    </aside>
  );
};

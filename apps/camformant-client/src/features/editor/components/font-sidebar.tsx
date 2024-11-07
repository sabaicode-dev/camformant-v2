import { cn } from "@/lib/utils";

import { ActiveTool, Editor, fonts } from "@/features/editor/types";


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
        "bg-red-100 relative border-r z-[40] flex justify-center items-center",
        activeTool === "font" ? "visible" : "hidden"
      )}
    >
      {/* Header Sidebar */}
      {/* <ToolSidebarHeader title="Fonts" description="Change Font to your text" /> */}
      <ScrollArea className="p-2 bg-purple-200">
        <div className="flex p-4 space-x-3 overflow-x-auto w-full  border-b bg-yellow-200">
          {fonts.map((font) => (
            <Button
              key={font}
              variant="secondary"
              size="sm"
              className={cn(
                "h-10 justify-start text-left border border-slate-200",
                value === font && "border-2 border-orange-400"
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

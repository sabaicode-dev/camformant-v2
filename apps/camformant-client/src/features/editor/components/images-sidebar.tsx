import { cn } from "@/lib/utils";

import { ActiveTool, Editor } from "@/features/editor/types";

import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";

import { ScrollArea } from "@/components/ui/scroll-area";

// import { useGetImages } from "@/features/images/api/use-get-images";
// import { AlertTriangle, Loader } from "lucide-react";

import { UploadButton } from "@/utils/uploadthing";

interface ImagesSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImagesSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImagesSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[200px] h-full flex flex-col",
        activeTool === "images" ? "visible" : "hidden"
      )}
    >
      {/* Header Sidebar */}
      {/* <ToolSidebarHeader
        title="Images"
        description="add Image to your canvas"
      /> */}
      <div className="p-4 border-b">
        <UploadButton
          appearance={{
            button: "w-full text-sm font-medium",
            allowedContent: "hidden",
          }}
          content={{
            button: "Upload Image",
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res: any) => {
            editor?.addImage(res[0].url);
          }}
        />
      </div>
      {/* {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )} */}
      {/* {isError && (
        <div className="flex flex-col items-center justify-center flex-1 gap-y-4">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Failed to fetch images
          </p>
        </div>
      )} */}
      <ScrollArea>
        <div className="p-4 space-y-1 border-b"></div>
      </ScrollArea>
      {/* Footer SideBar */}
      {/* <ToolSidebarClose onClick={onClose} /> */}
    </aside>
  );
};

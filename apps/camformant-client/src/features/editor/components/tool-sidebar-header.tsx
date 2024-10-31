import { Separator } from "@/components/ui/separator";

interface ToolSidebarHeaderProps {
  title: string;
  description?: string;
}

export const ToolSidebarHeader = ({
  title,
  description,
}: ToolSidebarHeaderProps) => {
  return (
    <div className="py-4 px-2 border-b space-y-1 h-[73px] flex justify-center items-center">
      <p className="text-sm font-medium">{title}</p>
      <Separator orientation="vertical" className="mx-2" />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

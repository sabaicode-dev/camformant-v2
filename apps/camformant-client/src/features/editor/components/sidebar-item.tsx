import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: LucideIcon | React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex-shrink-0 w-16 h-16 flex flex-col rounded-none justify-center items-center hover:text-primaryCam hover:bg-orange-200",
        isActive && "bg-orange-100 text-primaryCam"
      )}
    >
      <Icon className="stroke-2 size-5 shrink-0" />
      <span className="mt-2 text-xs">{label}</span>
    </Button>
  );
};

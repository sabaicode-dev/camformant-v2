import { cn } from "@/lib/utils";
import { ActiveTool, Editor, FILL_COLOR } from "@/features/editor/types";
import { ColorPicker } from "@/features/editor/components/color-picker";

interface FillColorSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const FillColorSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: FillColorSidebarProps) => {
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
                "bg-white border-r z-[40] flex absolute justify-center bottom-[108px] w-full",
                activeTool === "fill" ? "visible" : "hidden"
            )}
        >
            <ColorPicker value={value} onChange={onChange} />
        </aside>
    );
};

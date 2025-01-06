import { Button } from "@/components/ui/button";
import {
  MdAlignHorizontalCenter,
  MdAlignHorizontalLeft,
  MdAlignHorizontalRight,
} from "react-icons/md";
import { Editor } from "@/features/editor/types";
const GroupHorizontalAlign = ({ editor }: { editor: Editor | undefined }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => {
          editor?.alignHorizontalLeft();
        }}
        variant="outline"
        className="p-2 "
        size="icon"
      >
        <MdAlignHorizontalLeft width={25} height={25} />
      </Button>
      <Button
        onClick={() => {
          editor?.alignHorizontalCenter();
        }}
        variant="outline"
        className="p-2 "
        size="icon"
      >
        <MdAlignHorizontalCenter width={25} height={25} />
      </Button>
      <Button
        onClick={() => {
          editor?.alignHorizontalRight();
        }}
        variant="outline"
        className="p-2 "
        size="icon"
      >
        <MdAlignHorizontalRight width={25} height={25} />
      </Button>
    </div>
  );
};

export default GroupHorizontalAlign;

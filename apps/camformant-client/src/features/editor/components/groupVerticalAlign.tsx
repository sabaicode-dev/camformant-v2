import { Button } from "@/components/ui/button";
import {
  MdAlignVerticalBottom,
  MdAlignVerticalCenter,
  MdAlignVerticalTop,
} from "react-icons/md";
import { Editor } from "@/features/editor/types";
const GroupVerticalAlign = ({ editor }: { editor: Editor | undefined }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => {
          editor?.alignVerticalTop();
        }}
        variant="outline"
        className="p-2 "
        size="icon"
      >
        <MdAlignVerticalTop width={25} height={25} />
      </Button>
      <Button
        onClick={() => {
          editor?.alignVerticalCenter();
        }}
        variant="outline"
        className="p-2 "
        size="icon"
      >
        <MdAlignVerticalCenter width={25} height={25} />
      </Button>
      <Button
        onClick={() => {
          editor?.alignVerticalBottom();
        }}
        variant="outline"
        className="p-2 "
        size="icon"
      >
        <MdAlignVerticalBottom width={25} height={25} />
      </Button>
    </div>
  );
};

export default GroupVerticalAlign;

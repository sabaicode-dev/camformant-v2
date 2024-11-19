import { Button } from "@/components/ui/button";
import React from "react";
import { Editor } from "../types";
import {
  SlArrowDown,
  SlArrowLeft,
  SlArrowRight,
  SlArrowUp,
} from "react-icons/sl";

interface NudgePositionProps {
  value: number;
  onChange: (value: number) => void;
  editor: Editor | undefined;
}

export const NudgePosition = ({
  value,
  onChange,
  editor,
}: NudgePositionProps) => {

  const left = () => editor?.onMoveLeft();
  const right = () => editor?.onMoveRight();
  const up = () => editor?.onMoveUp();
  const down = () => editor?.onMoveDown();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onChange(value);
  };

  return (
    <div className="flex items-center gap-2">
      <Button onClick={left} variant="outline" className="p-2 " size="icon">
        <SlArrowLeft width={25} height={25} />
      </Button>

      <Button onClick={down} variant="outline" className="p-2 " size="icon">
        <SlArrowDown width={25} height={25} />
      </Button>
      <Button onClick={up} variant="outline" className="p-2 " size="icon">
        <SlArrowUp width={25} height={25} />
      </Button>
      <Button onClick={right} variant="outline" className="p-2 " size="icon">
        <SlArrowRight width={25} height={25} />
      </Button>
     
    </div>
  );
};

import { fabric } from "fabric";
import { useCallback, useRef } from "react";
interface UseArrowKeyProps {
  canvas: fabric.Canvas | null;
  step?: number;
}

type direction = "left" | "right" | "up" | "down";
let Direction = {
  LEFT: "left",
  UP: "up",
  RIGHT: "right",
  DOWN: "down",
};

export const useArrowKey = ({ canvas, step = 5 }: UseArrowKeyProps) => {
  //move
  const moveSelected = (direction: direction) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) {
      const current = {
        left: activeObject.left as number,
        top: activeObject.top as number,
      };
      switch (direction) {
        case Direction.LEFT:
          activeObject.set({ left: current.left - step });
          // console.log(activeObject);
          canvas?.renderAll();
          break;
        case Direction.RIGHT:
          activeObject.set({ left: current.left + step });
          canvas?.renderAll();
          break;
        case Direction.UP:
          activeObject.set({ top: current.top - step });
          canvas?.renderAll();
          break;
        case Direction.DOWN:
          activeObject.set({ top: current.top + step });
          canvas?.renderAll();
          break;
      }
    }
  };
  //
  const moveLeft = useCallback(() => {
    moveSelected("left");
  }, [canvas]);
  const moveRight = useCallback(() => {
    moveSelected("right");
  }, [canvas]);
  const moveUp = useCallback(() => {
    moveSelected("up");
  }, [canvas]);
  const moveDown = useCallback(() => {
    moveSelected("down");
  }, [canvas]);

  return { moveLeft, moveRight, moveUp, moveDown };
};

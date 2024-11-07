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

  const moveSelected = useCallback(
    (direction: direction) => {
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
    },
    [canvas, step]
  );

  //
  const moveLeft = useCallback(() => {
    moveSelected("left");
  }, [moveSelected]);
  const moveRight = useCallback(() => {
    moveSelected("right");
  }, [moveSelected]);
  const moveUp = useCallback(() => {
    moveSelected("up");
  }, [moveSelected]);
  const moveDown = useCallback(() => {
    moveSelected("down");
  }, [moveSelected]);

  return { moveLeft, moveRight, moveUp, moveDown };
};

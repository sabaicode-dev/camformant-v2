import { fabric } from "fabric";
import { useCallback, useRef } from "react";
interface UseClipboardProps {
  canvas: fabric.Canvas | null;
}
export const useClipboard = ({ canvas }: UseClipboardProps) => {
  const clipboard = useRef<any>(null);
  const copy = useCallback(() => {
    canvas?.getActiveObject()?.clone((cloned: any) => {
      clipboard.current = cloned;
    });
    console.log("canvas:", canvas?.getActiveObjects());
  }, [canvas]);
  const paste = useCallback(() => {
    if (!clipboard) return;
    clipboard.current.clone((clonedObj: any) => {
      canvas?.discardActiveObject();
      //new object added to other position ot make it easy to see that new obj has been added
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });

      if (clonedObj.type === "activeSelection") {
        clonedObj.canvas = canvas;
        clonedObj.forEachObject((object: any) => {
          canvas?.add(object);
        });
        clonedObj.setCoords();
      } else {
        canvas?.add(clonedObj);
      }
      clipboard.current.top += 10;
      clipboard.current.left += 10;
      canvas?.setActiveObject(clonedObj); //set active object to new cloned object
      canvas?.requestRenderAll();
    });
  }, [canvas]);

  return { copy, paste };
};

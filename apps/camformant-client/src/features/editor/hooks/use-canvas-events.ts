import { fabric } from "fabric";
import { ZoomIn } from "lucide-react";
import { useEffect } from "react";

interface UseCanvasEventsProps {
  save: () => void;
  canvas: fabric.Canvas | null;
  setSelectedObjects: (object: fabric.Object[]) => void;
  clearSelectionCallback?: () => void;
}

export const UseCanvasEvents = ({
  save,
  canvas,
  setSelectedObjects,
  clearSelectionCallback,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      canvas.on("touch:gesture", (e) => {
        alert(e);
      });
      canvas.on("object:added", () => save());
      canvas.on("object:removed", () => save());
      canvas.on("object:modified", () => save());
      canvas.on("selection:created", (e) =>
        setSelectedObjects(e.selected || [])
      );

      canvas.on("selection:updated", (e) =>
        setSelectedObjects(e.selected || [])
      );

      //clear selected
      canvas.on("selection:cleared", () => {
        // console.log("selection cleared");
        setSelectedObjects([]);
        clearSelectionCallback?.();
      });

      // canvas.getElement().addEventListener("touchstart", (e) => {
      //   console.log("Hello touch start");
      // });

      canvas.on("mouse:wheel", function (opt) {
        if (opt.e.deltaY > 0) {
          console.log("Scrolling down zoomout");
          let zoomRatio = canvas.getZoom();
          zoomRatio -= 0.1;
          const center = canvas.getCenter();
          canvas.zoomToPoint(
            new fabric.Point(center.left, center.top),
            zoomRatio < 0.4 ? 0.4 : zoomRatio
          );
        } else {
          console.log("Scrolling up zoomin");
          let zoomRatio = canvas.getZoom();
          zoomRatio += 0.1;
          const center = canvas.getCenter();
          canvas.zoomToPoint(
            new fabric.Point(center.left, center.top),
            zoomRatio > 2 ? 2 : zoomRatio
          );
          // canvas.requestRenderAll();
        }

        // You can also prevent default scrolling behavior if needed
        opt.e.preventDefault();
      });
    }
    return () => {
      if (canvas) {
        canvas.off("touch:gesture");
        canvas.off("object:added");
        canvas.off("object:removed");
        canvas.off("object:modified");
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
        canvas.off("mouse:wheel");
        // canvas.off("touchstart");
        // canvas.off("touch:drag");
        // canvas.off("touch:end");
      }
    };
  }, [canvas, clearSelectionCallback, save, setSelectedObjects]);
};

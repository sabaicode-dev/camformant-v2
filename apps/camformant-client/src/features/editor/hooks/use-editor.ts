import { useCallback, useState, useMemo } from "react";
import { fabric } from "fabric";

import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";

import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  Editor,
  RECTANGLE_OPTIONS,
  TRIANGLE_OPTIONS,
  DIAMOND_OPTIONS,
  FILL_COLOR,
  STROKE_COLOR,
  STROKE_WIDTH,
  EditorHookProps,
  STROKE_DASH_ARRAY,
  TEXT_OPTIONS,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  JSON_KEYS,
} from "@/features/editor/types";
import { UseCanvasEvents } from "@/features/editor/hooks/use-canvas-events";
import {
  createFilter,
  downloadFile,
  isTextType,
  transformText,
} from "@/features/editor/utils";
import { useClipboard } from "@/features/editor/hooks/use-clipboard";
import { useHistory } from "@/features/editor/hooks/use-history";
import { useHotKeys } from "@/features/editor/hooks/use-hotkeys";
import { useWindowEvent } from "@/features/editor/hooks/use-window-events";
import { useArrowKey } from "./use-arrowKey";
const buildEditor = ({
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  save,
  undo,
  redo,
  canUndo,
  canRedo,
  autoZoom,
  copy,
  paste,
  cropperRef,
  setPatternImageSrc,
  setShowCropper,
  canvas,
  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectedObjects,
  strokeDashArray,
  setStrokeDashArray,
  fontFamily,
  setFontFamily,
}: BuildEditorProps): Editor => {
  const generateSaveOptions = () => {
    const { width, height, left, top } = getWorkspace() as fabric.Rect;

    return {
      name: "Image",
      format: "png",
      quality: 1,
      width,
      height,
      left,
      top,
    };
  };

  const savePng = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);
    downloadFile(dataUrl, "png");
    autoZoom();
  };
  const saveSvg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);
    downloadFile(dataUrl, "svg");
    autoZoom();
  };
  const saveJpg = () => {
    const options = generateSaveOptions();

    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);
    downloadFile(dataUrl, "jpg");
    autoZoom();
  };
  const saveJson = async () => {
    const dataUrl = canvas.toJSON(JSON_KEYS);
    await transformText(dataUrl.objects);
    const fileString = `data:/text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, "\t")
    )}`;
    downloadFile(fileString, "json");
  };

  const loadJson = (json: string) => {
    const data = JSON.parse(json);
    canvas.loadFromJSON(data, () => {
      autoZoom();
    });
  };

  // find workspace name clip that we recently added
  const getWorkspace = () => {
    return canvas.getObjects().find((object) => object.name === "clip");
  };
  //to center the new object
  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();

    if (!center) return;
    //@ts-ignore
    canvas._centerObject(object, center);
    //or: canvas.centerObject(object);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };
  const getImage = () => {
    const selectedObject = canvas.getActiveObject() as fabric.Circle;
    const pattern = selectedObject.get("fill") as fabric.Pattern | undefined;
    return { pattern, selectedObject };
  };
  const createPattern = (circleRadius: number, image: fabric.Image) => {
    const translateX = 0; // No horizontal translation needed
    const translateY = 0;
    const scale = Math.max(
      (circleRadius * 2) / image.width!,
      (circleRadius * 2) / image.height!
    );

    const pattern = new fabric.Pattern({
      source: image.getElement() as HTMLImageElement, // Use the new image as the pattern source
      repeat: "no-repeat",
      patternTransform: [scale, 0, 0, scale, translateX, translateY], // Preserve the existing pattern's transform if any
    });
    return pattern as fabric.Pattern;
  };
  const resetSelection = (objects: fabric.Object[]) => {
    canvas.discardActiveObject(); // Clear the active selection
    const newActiveSelection = new fabric.ActiveSelection(objects, {
      canvas: canvas,
    }); //to create a new active selection from an array of objects.
    canvas.setActiveObject(newActiveSelection); //setActiveObject is designed to set a single active object
    canvas.renderAll();
  };

  return {
    onMoveLeft: () => moveLeft(),
    onMoveRight: () => moveRight(),
    onMoveUp: () => moveUp(),
    onMoveDown: () => moveDown(),
    saveJpg,
    savePng,
    saveJson,
    saveSvg,
    loadJson,
    autoZoom,
    canUndo,
    canRedo,
    getWorkspace,
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.1;
      const center = canvas.getCenter();
      canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
    },
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.1;
      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomRatio < 0.2 ? 0.2 : zoomRatio
      );
    },
    changeSize: (value: { width: number; height: number }) => {
      const workspace = getWorkspace();
      workspace?.set(value);
      autoZoom();
      save(); //if save with db not use this save()
      //TODO: save
    },
    changeBackground: (value: string) => {
      const workspace = getWorkspace();
      workspace?.set({ fill: value });
      canvas.renderAll();
      save();
      //TODO: save
    },
    onUndo: () => undo(),
    onRedo: () => redo(),
    onCopy: () => copy(),
    onPaste: () => paste(),
    // onMoveLeft:()=>,
    changeImageFilter: (value: string) => {
      const objects = canvas.getActiveObjects();
      objects.forEach((object) => {
        if (object.type === "image") {
          const imageObject = object as fabric.Image;

          const effect = createFilter(value);

          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
          canvas.renderAll();
        } else {
          console.log("inside else:::");
          objects.forEach((object) => {
            if (object instanceof fabric.Circle) {
              const pattern = object.fill as fabric.Pattern;
              console.log("type of source",typeof pattern.source)
              const image = pattern.source as HTMLImageElement;
              const patternImage = pattern.source as fabric.Image;
              const effect = createFilter(value);

              patternImage.filters = effect ? [effect] : [];
              patternImage.applyFilters();
              const newPattern: fabric.Pattern = createPattern(
                100,
                patternImage
              );
              object.set("fill", newPattern);
            }
          });
          canvas.renderAll();
        }
      });
    },
    addImage: (value: string) => {
      fabric.Image.fromURL(
        value,
        (image) => {
          //fabirc.image
          const circleRadius = 100; // Radius of 100 pixels, making the circle diameter 200 pixels

          // Create a circle with the desired dimensions and style
          const circle = new fabric.Circle({
            left: 10, // Position from the left
            top: 10, // Position from the top
            radius: circleRadius, // Radius of the circle
            stroke: "red", // Border color
            strokeWidth: 5, // Border thickness
            fill: "", // Placeholder to apply pattern later
          });
          const pattern = createPattern(circleRadius, image);

          // Set the circle's fill to the pattern
          circle.set("fill", pattern);
          addToCanvas(circle);
        },
        {
          crossOrigin: "anonymous",
        }
      );
    },
    replaceImage(value: string) {
      fabric.Image.fromURL(
        value,
        (image) => {
          console.log("hello");
          const { pattern, selectedObject } = getImage();

          if (pattern) {
            const circleRadius = 100;
            const newPattern: fabric.Pattern = createPattern(
              circleRadius,
              image
            );

            // Update the circle's fill with the new pattern
            selectedObject.set("fill", newPattern);
          }
          canvas.renderAll();
        },
        {
          crossOrigin: "anonymous",
        }
      );
    },
    enableCropping: () => {
      const { pattern, selectedObject } = getImage();
      if (pattern!.source instanceof HTMLImageElement) {
        const imageSrc = pattern!.source.src;
        setPatternImageSrc(imageSrc);
        setShowCropper(true);
      }
    },
    handleCrop: () => {
      const { selectedObject } = getImage();
      const imageElement: any = cropperRef!;
      const cropper = imageElement?.cropper;
      if (cropper) {
        const croppedDataURL = cropper.getCroppedCanvas().toDataURL();
        fabric.Image.fromURL(
          croppedDataURL,
          (img) => {
            console.log("crop data url", croppedDataURL);
            const circleRadius = 100;
            const newPattern = createPattern(circleRadius, img);
            selectedObject.set("fill", newPattern);
            canvas.renderAll();
            setShowCropper(false);
          },
          {
            crossOrigin: "anonymous",
          }
        );
      } else {
        console.log("Cropper not initialized");
      }
    },

    delete: () => {
      canvas.getActiveObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options,
      });
      addToCanvas(object);
    },
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return 1;
      }
      const value = selectedObject.get("opacity") || 1;

      //this version not support gradients & patterns yet
      return value;
    },
    changeFontSize: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          //@ts-ignore
          object.set({ fontSize: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return FONT_SIZE;
      }
      //@ts-ignore
      const value = selectedObject.get("fontSize") || FONT_SIZE;

      return value;
    },
    changeTextAlign: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          //@ts-ignore
          object.set({ textAlign: value });
        }
      });
      canvas.renderAll();
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return "left";
      }
      //@ts-ignore
      const value = selectedObject.get("textAlign") || "left";

      return value;
    },
    changeFontUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          //@ts-ignore
          object.set({ underline: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return false;
      }
      //@ts-ignore
      const value = selectedObject.get("underline") || false;

      return value;
    },
    changeFontLinethrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          //@ts-ignore
          object.set({ linethrough: value });
        }
      });
      canvas.renderAll();
    },
    getActiveFontLinethrough: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return false;
      }
      //@ts-ignore
      const value = selectedObject.get("linethrough") || false;

      return value;
    },
    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          //@ts-ignore
          object.set({ fontStyle: value });
        }
      });
      canvas.renderAll();
    },
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          //@ts-ignore
          object.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });
      canvas.renderAll();
    },

    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });

      canvas.renderAll();
      //move our workspace to always stay behind all objects
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });
      canvas.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    //change font family
    changeFontFamily: (value: string) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          //@ts-ignore
          object.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
    },
    //change fill color
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    //change stroke color
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        // text type don't have stroke
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }
        object.set({ stroke: value });
      });
      canvas.renderAll();
    },
    //change stroke width
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      canvas.renderAll();
    },
    //change stroke dash array
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    //circle
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      //object to center in this function
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    //rectangle
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    //triangle
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    //inverse triangle //this custome is use array of {x,y} and this x & y make the points , we can match all the points and get shape
    addInverseTriangle: () => {
      const HEIGHT = TRIANGLE_OPTIONS.height;
      const WIDTH = TRIANGLE_OPTIONS.width;
      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );
      addToCanvas(object);
    },
    //diamond
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPTIONS.height;
      const WIDTH = DIAMOND_OPTIONS.width;
      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      );
      addToCanvas(object);
    },
    canvas,
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return "normal";
      }
      //@ts-ignore
      const value = selectedObject.get("fontStyle") || "normal";

      return value;
    },
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return FONT_WEIGHT;
      }
      //@ts-ignore
      const value = selectedObject.get("fontWeight") || FONT_WEIGHT;

      return value;
    },
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return fontFamily;
      }
      //@ts-ignore
      const value = selectedObject.get("fontFamily") || fontFamily;

      return value;
    },
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return fillColor;
      }
      const value = selectedObject.get("fill") || fillColor;

      //this version not support gradients & patterns yet
      return value as string;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return strokeColor;
      }
      const value = selectedObject.get("stroke") || strokeColor;

      //this version not support gradients & patterns yet
      return value;
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return strokeWidth;
      }
      const value = selectedObject.get("strokeWidth") || strokeWidth;

      //this version not support gradients & patterns yet
      return value;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return strokeDashArray;
      }
      const value = selectedObject.get("strokeDashArray") || strokeDashArray;

      //this version not support gradients & patterns yet
      return value;
    },
    selectedObjects,
  };
};
export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  //state for image
  const [setPatternImageSrc, setStatePatternImageSrc] = useState<React.Dispatch<
    React.SetStateAction<any>
  > | null>(null);
  const [setShowCropper, setStateShowCropper] = useState<React.Dispatch<
    React.SetStateAction<any>
  > | null>(null);

  const [cropperRef, setCropper] = useState<HTMLImageElement | null>(null);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);

  const { save, canRedo, canUndo, redo, undo, canvasHistory, setHistoryIndex } =
    useHistory({ canvas });
  useWindowEvent();
  const { copy, paste } = useClipboard({ canvas });
  const { moveLeft, moveDown, moveRight, moveUp } = useArrowKey({
    canvas,
    step: 10,
  });
  const { autoZoom } = useAutoResize({ canvas, container });

  UseCanvasEvents({
    save,
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  });

  useHotKeys({
    canvas,
    save,
    redo,
    undo,
    copy,
    paste,
    moveDown,
    moveLeft,
    moveRight,
    moveUp,
  });

  // Handle touch events for mobile gestures, including zoom in and out
  // const handleTouchEvents = useCallback(() => {
  //   if (!canvas) return;

  //   const info = document.getElementById("touchInfo");
  //   if (!info) return;

  //   // Initial zoom scale
  //   let lastZoomScale = 1;

  //   // canvas.on({
  //   //   "touch:gesture": function (event) {
  //   //     var text = document.createTextNode(" Gesture ");
  //   //     info.insertBefore(text, info.firstChild);

  //   //     // Check if event.e.touches is available for gesture scaling
  //   //     if (event.e.touches && event.e.touches.length === 2) {
  //   //       // Pinch zoom scaling based on the gesture scale
  //   //       alert("hi info");
  //   //       const scale = event.e.scale;
  //   //       const zoom = (canvas.getZoom() * scale) / lastZoomScale;

  //   //       // Set limits to prevent over-zooming
  //   //       if (zoom > 5) {
  //   //         canvas.setZoom(5); // Maximum zoom level
  //   //       } else if (zoom < 0.2) {
  //   //         canvas.setZoom(0.2); // Minimum zoom level
  //   //       } else {
  //   //         canvas.setZoom(zoom); // Apply zoom
  //   //       }

  //   //       lastZoomScale = scale; // Update last zoom scale for the next event
  //   //       event.e.preventDefault(); // Prevent default pinch-to-zoom behavior on the webpage
  //   //     }
  //   //   },
  //   //   "touch:drag": function () {
  //   //     var text = document.createTextNode(" Dragging ");
  //   //     info.insertBefore(text, info.firstChild);
  //   //   },
  //   //   "touch:orientation": function () {
  //   //     var text = document.createTextNode(" Orientation ");
  //   //     info.insertBefore(text, info.firstChild);
  //   //   },
  //   //   "touch:shake": function () {
  //   //     var text = document.createTextNode(" Shaking ");
  //   //     info.insertBefore(text, info.firstChild);
  //   //   },
  //   //   "touch:longpress": function () {
  //   //     var text = document.createTextNode(" Longpress ");
  //   //     info.insertBefore(text, info.firstChild);
  //   //   },
  //   // });

  //   // Reset the lastZoomScale when the touch ends
  //   // canvas.on("touch:end", function () {
  //   //   lastZoomScale = 1;
  //   // });
  // }, [canvas]);

  // useMemo to save the state on the memory when the state changes so the re-render won't affect the Memo
  const editor = useMemo(() => {
    if (canvas) {
      // handleTouchEvents(); // Initialize touch events when canvas is ready
      return buildEditor({
        moveLeft,
        moveRight,
        moveUp,
        moveDown,
        save,
        undo,
        redo,
        canUndo,
        canRedo,
        autoZoom,
        copy,
        paste,
        cropperRef,
        //@ts-ignore
        setPatternImageSrc,
        //@ts-ignore
        setShowCropper,
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        strokeWidth,
        setStrokeColor,
        setStrokeWidth,
        selectedObjects,
        strokeDashArray,
        setStrokeDashArray,
        fontFamily,
        setFontFamily,
      });
    }
    return undefined;
  }, [
    moveLeft,
    canRedo,
    canUndo,
    redo,
    undo,
    save,
    copy,
    paste,
    setPatternImageSrc,
    setShowCropper,
    canvas,
    strokeWidth,
    strokeColor,
    selectedObjects,
    strokeDashArray,
    fontFamily,
    autoZoom,
    fillColor,
    moveDown,
    moveRight,
    moveUp,
    // handleTouchEvents,
  ]);

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
      initSetPatternImageSrc,
      initSetShowCropper,
      initCropper,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
      initSetPatternImageSrc: React.Dispatch<
        React.SetStateAction<string | null>
      >;
      initSetShowCropper: React.Dispatch<React.SetStateAction<boolean>>;
      initCropper: HTMLImageElement | null;
    }) => {
      // Custom prototype of object(shape)
      fabric.Object.prototype.set({
        cornerColor: "#ff5c00",
        cornerStyle: "rect",
        borderColor: "#ff5c00",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#ff5c00",
        padding: 15,
        cornerSize: 10,
      });

      const initialWorkspace = new fabric.Rect({
        width: 620,
        height: 877,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({ color: "rgba(0,0,0,0.8)", blur: 5 }),
      });
      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);
      setStatePatternImageSrc(() => initSetPatternImageSrc); //  // Correctly set the state using type assertion if necessary
      setStateShowCropper(() => initSetShowCropper);
      setCropper(initCropper);
      const currentState = JSON.stringify(initialCanvas.toJSON(JSON_KEYS));
      canvasHistory.current = [currentState];
      setHistoryIndex(0);
    },
    [canvasHistory, setHistoryIndex]
  );

  return { init, editor, canvas };
};

import { useCallback, useState, useMemo, useRef, useEffect } from "react";
import { fabric } from "fabric";
import { jsPDF } from "jspdf";
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
  CvContentParams,
} from "@/features/editor/types";
import { UseCanvasEvents } from "@/features/editor/hooks/use-canvas-events";
import {
  catchEditedData,
  createFilter,
  downloadFile,
  isTextType,
  postCv,
  setFetchData,
  setUneditableAbility,
  transformText,
} from "@/features/editor/utils";
import { useClipboard } from "@/features/editor/hooks/use-clipboard";
import { useHistory } from "@/features/editor/hooks/use-history";
import { useHotKeys } from "@/features/editor/hooks/use-hotkeys";
import { useWindowEvent } from "@/features/editor/hooks/use-window-events";
import { useArrowKey } from "./use-arrowKey";
import { useLoadState } from "./use-load-state";
import { CustomCvDataParams } from "@/utils/types/user-profile";
const buildEditor = ({
  dataForUpdate,
  setDataForUpdate,
  cvContent,
  setCvContent,
  canvasHistory,
  setHistoryIndex,
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
    console.log("top right...", width, height, left, top);

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
  const savePdf = () => {
    const options = generateSaveOptions();

    // Create jsPDF instance
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const data = canvas.toDataURL({ format: "png", multiplier: 4 });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = pdfHeight;
    console.log(" img width:", imgWidth, " img height:", imgHeight);
    pdf.addImage(data, "PNG", 0, 0, imgWidth, imgHeight);
    //downloadFile(data, "pdf");
    pdf.save("canvas.pdf");

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

  const loadJson = (
    json: string | any,
    style?: string,
    userData?: CustomCvDataParams | {}
  ) => {
    console.log("canvas in loadjson", canvas);
    const data = typeof json == "string" ? JSON.parse(json) : json;
    canvas.loadFromJSON(data, () => {
      const currentState = JSON.stringify(canvas.toJSON());
      canvasHistory.current = [currentState];
      setHistoryIndex(0);
      autoZoom();
      if (style) {
        setFetchData(canvas, userData);
        save();
      }
    });
  };
  const updateCv = () => {
    postCv(
      cvContent.style,
      canvas,
      dataForUpdate,
      setDataForUpdate,
      setCvContent
    );
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
  const getPattern = () => {
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
    });
    canvas.setActiveObject(newActiveSelection);
    canvas.renderAll();
  };

  return {
    updateCv,
    onMoveLeft: () => moveLeft(),
    onMoveRight: () => moveRight(),
    onMoveUp: () => moveUp(),
    onMoveDown: () => moveDown(),
    saveJpg,
    savePng,
    savePdf,
    saveJson,
    saveSvg,
    loadJson,
    autoZoom,
    canUndo,
    canRedo,
    getWorkspace,
    //for group align
    alignVerticalTop: () => {
      const selectedObjects = canvas.getActiveObjects();
      const mainTop = selectedObjects[0].top;
      let widthForAlign: number = selectedObjects[0].left!;

      selectedObjects.forEach((object) => {
        object.set({
          top: mainTop,
        });
        widthForAlign += object.width!;
      });
      canvas.discardActiveObject(); // Clear the active selection
      const newActiveSelection = new fabric.ActiveSelection(selectedObjects, {
        canvas: canvas,
      }); //to create a new active selection from an array of objects.
      canvas.setActiveObject(newActiveSelection); //setActiveObject is designed to set a single active object
      canvas.renderAll();
    },
    alignVerticalBottom: () => {
      const selectedObjects = canvas.getActiveObjects();
      const bottom = Math.max(
        ...selectedObjects.map((obj) => obj.top! + obj.height! * obj.scaleY!)
      );

      selectedObjects.forEach((obj) => {
        const objHeight = obj.height! * obj.scaleY!;
        obj.top = bottom - objHeight;
        obj.setCoords(); // Update object coordinates
      });

      canvas.requestRenderAll();
    },
    alignVerticalCenter: () => {
      const selectedObjects = canvas.getActiveObjects();
      const highestHeightObject = selectedObjects.reduce((max, obj) => {
        const maxHeight = max.height! * max.scaleY!;
        const objHeight = obj.height! * obj.scaleY!;
        return maxHeight < objHeight ? obj : max;
      });

      let widthForAlign: number = selectedObjects[0].left!;
      console.log(
        "highest:",
        highestHeightObject.height! * highestHeightObject.scaleY!
      );

      selectedObjects.forEach((object) => {
        const objectHeight = object.height! * object.scaleY!;
        const highestHeight =
          highestHeightObject.height! * highestHeightObject.scaleY!;

        if (highestHeightObject !== object) {
          object.set({
            top:
              highestHeightObject.top! + (highestHeight / 2 - objectHeight / 2),
          });
        }

        widthForAlign += object.width! * object.scaleX!;
      });

      resetSelection(selectedObjects);
    },
    alignHorizontalCenter: () => {
      const selectedObjects = canvas.getActiveObjects();
      // Find the horizontal center position
      const centerX = Math.min(
        ...selectedObjects.map(
          (obj) => obj.left! + (obj.width! * obj.scaleX!) / 2
        )
      );

      selectedObjects.forEach((obj) => {
        const objWidth = obj.width! * obj.scaleX!;
        obj.left = centerX - objWidth / 2;
        obj.setCoords();
      });

      resetSelection(selectedObjects);
    },
    alignHorizontalRight: () => {
      const selectedObjects = canvas.getActiveObjects();
      const mainRight =
        selectedObjects[0]!.left! +
        selectedObjects[0].width! * selectedObjects[0].scaleX!;
      selectedObjects.forEach((object: any) => {
        const objectWidth = object.width * object.scaleX;
        object.set("left", mainRight - objectWidth);
        resetSelection(selectedObjects);
      });
    },
    alignHorizontalLeft: () => {
      const selectedObjects = canvas.getActiveObjects();
      const mainLeft = selectedObjects[0].left;
      selectedObjects.forEach((object) => {
        object.set("left", mainLeft);
        resetSelection(selectedObjects);
      });
    },

    //for seteditable and set not ediable
    setEditable: () => {
      canvas.getObjects().forEach((object) => {
        object.name != "clip" &&
          object.set({
            selectable: true,
            hasControls: true,
          });
      });
    },
    setUneditable: () => {
      setUneditableAbility(canvas);
    },
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
          objects.forEach((object) => {
            if (object instanceof fabric.Circle) {
              const pattern = object.fill as fabric.Pattern;
              console.log("type of source", typeof pattern.source);
              const patternImage = new fabric.Image(pattern.source);
              const effect = createFilter(value);

              if (effect) {
                console.log("it have effect");
                patternImage.filters = [effect];
                patternImage.applyFilters(); // Apply the filter to the image
              }
              pattern.source = patternImage.getElement() as HTMLImageElement;
              object.set("fill", pattern);
            }
            object.dirty = true;
            canvas.renderAll();
          });
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
          const { pattern, selectedObject } = getPattern();

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
      const { pattern } = getPattern();
      if (pattern!.source instanceof HTMLImageElement) {
        const imageSrc = pattern!.source.src;
        setPatternImageSrc(imageSrc);
        setShowCropper(true);
      }
    },
    handleCrop: (imageUrl: string) => {
      const { selectedObject } = getPattern();
      if (imageUrl) {
        fabric.Image.fromURL(
          imageUrl,
          (img) => {
            console.log("crop data url", imageUrl);
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

export const useEditor = ({
  defaultState, // it contains usrData and json and style
  setPatternImageSrc,
  setShowCropper,
  setCvContent,
  clearSelectionCallback,
}: EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const initialState = useRef(defaultState.json);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);
  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);
  const [dataForUpdate, setDataForUpdate] = useState({});

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

  useLoadState({
    //for set history when we fetch data
    canvas,
    autoZoom,
    initialState,
    canvasHistory,
    setHistoryIndex,
    userData: defaultState.userData,
  });

  const editor = useMemo(() => {
    if (canvas) {
      // handleTouchEvents(); // Initialize touch events when canvas is ready
      return buildEditor({
        dataForUpdate,
        setDataForUpdate,
        cvContent: defaultState,
        setCvContent,
        canvasHistory,
        setHistoryIndex,
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
    // eslint-disable-next-line
  }, [
    defaultState.style,
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
    canvasHistory,
    dataForUpdate,
    defaultState,
    setCvContent,
    setHistoryIndex,
  ]);
  useEffect(() => {
    if (canvas) {
      canvas.on("text:editing:exited", (e: fabric.IEvent<Event>) => {
        console.log("text edit");
        catchEditedData(e, setDataForUpdate, canvas);
        console.log("DATA FOR UPDATE", dataForUpdate);
      });
      canvas.on("object:scaling", (e: fabric.IEvent<Event>) => {
        if (e.target instanceof fabric.Textbox) {
          const withScalingValue: number =
            e.target.get("fontSize")! * e.target.scaleY!;
          e.target.set("fontSize", parseFloat(withScalingValue.toFixed(2)));
        }
      });
    }
  }, [canvas, dataForUpdate]);

  const init = useCallback(
    async ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      // Custom prototype of object(shape)
      fabric.Object.prototype.set({
        cornerColor: "#ff5c00",
        cornerStyle: "rect",
        borderColor: "#ff5c00",
        borderScaleFactor: 1,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#ff5c00",
        padding: 5,
        cornerSize: 8,
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
      const currentState = JSON.stringify(initialCanvas.toJSON(JSON_KEYS));
      canvasHistory.current = [currentState];
      setHistoryIndex(0);
    },
    [canvasHistory, setHistoryIndex]
  );

  return { init, editor, canvas };
};

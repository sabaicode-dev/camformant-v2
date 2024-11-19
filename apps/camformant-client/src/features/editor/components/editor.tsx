"use client";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { fabric } from "fabric";
import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Navbar } from "@/features/editor/components/navbar";
import { Sidebar } from "@/features/editor/components/sidebar";
import { Toolbar } from "@/features/editor/components/toolbar";
import { Footer } from "@/features/editor/components/footer";
import {
  ActiveTool,
  CvContentParams,
  selectionDependentTools,
} from "@/features/editor/types";
import { ShapeSidebar } from "@/features/editor/components/shape-sidebar";
import { FillColorSidebar } from "@/features/editor/components/fill-color-sidebar";
import { StrokeColorSidebar } from "@/features/editor/components/stroke-color-sidebar";
import { StrokeWidthSidebar } from "@/features/editor/components/stroke-width-sidebar";
import { OpacitySidebar } from "@/features/editor/components/opacity-sidebar";
import { TextSidebar } from "@/features/editor/components/text-sidebar";
import { FontSidebar } from "@/features/editor/components/font-sidebar";
import { ImagesSidebar } from "@/features/editor/components/images-sidebar";
import { FilterSidebar } from "@/features/editor/components/filter-sidebar";
import { SettingsSidebar } from "@/features/editor/components/settings-sizebar.tsx";
import { TextColorSidebar } from "./text-color-sidebar";
import TemplateModal from "./template-modal";
import Cropper, { Area } from "react-easy-crop";
import { useNotification } from "@/hooks/user-notification";
import getCroppedImg from "@/components/profile/crop";
// import LayersList from "./LayersList";
const Editor: React.FC<{
  cvContent: CvContentParams;
  setCvContent: React.Dispatch<SetStateAction<CvContentParams>>;
}> = ({ cvContent, setCvContent }) => {
  //set default active on select feature
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const [patternImageSrc, setPatternImageSrc] = useState<string | null>(null);
  const [isOpenTemp, setIsOpenTem] = useState<boolean>(false);
  // const { addNotification, NotificationDisplay } = useNotification();
  //state for cropper
  const [isCropping, setIsCropping] = useState<boolean>(false); // State to control cropper visibility
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === activeTool) {
        return setActiveTool("select");
      }
      setActiveTool(tool);
    },
    [activeTool] //get back activeTool callback to this global/editor state from child
  );

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);
  const { init, editor, canvas } = useEditor({
    setPatternImageSrc: setPatternImageSrc,
    setShowCropper: setIsCropping,
    defaultState: cvContent,
    setCvContent: setCvContent,
    clearSelectionCallback: onClearSelection,
  });
  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      //make the object out of container cannot control
      controlsAboveOverlay: true,
      // selection: false,
      preserveObjectStacking: true, // if false the selecting element will be front of all elements/objects
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });
    let lastTouchDistance = 0;
    let isPinching = false;

    const lowerCanvasEl = (canvas as any).lowerCanvasEl;

    // Disable selection and object events during pinch
    function disableInteraction() {
      canvas.selection = false;
      canvas.forEachObject((obj) => (obj.evented = false));
    }

    // Restore interaction after pinch
    function restoreInteraction() {
      canvas.selection = true;
      canvas.forEachObject((obj) => (obj.evented = true));
    }

    // Touch start: detect pinch start
    lowerCanvasEl.addEventListener("touchstart", (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dist = getTouchDistance(e);
        lastTouchDistance = dist;
        isPinching = true;
        disableInteraction();
      }
    });

    // Touch move: handle pinch zoom
    lowerCanvasEl.addEventListener("touchmove", (e: TouchEvent) => {
      if (e.touches.length === 2 && isPinching) {
        const dist = getTouchDistance(e);
        const zoomFactor = dist / lastTouchDistance;

        // Calculate new zoom level
        const currentZoom = canvas.getZoom();
        let newZoom = currentZoom * zoomFactor;

        // Constrain zoom level
        if (newZoom > 10) newZoom = 10;
        if (newZoom < 0.1) newZoom = 0.1;

        canvas.zoomToPoint(
          new fabric.Point(
            (e.touches[0].pageX + e.touches[1].pageX) / 2,
            (e.touches[0].pageY + e.touches[1].pageY) / 2
          ),
          newZoom
        );

        lastTouchDistance = dist;

        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Touch end: end pinch gesture
    lowerCanvasEl.addEventListener("touchend", () => {
      if (!isPinching) return;
      isPinching = false;
      restoreInteraction();
    });

    // Calculate distance between two touch points
    function getTouchDistance(e: TouchEvent) {
      const dx = e.touches[0].pageX - e.touches[1].pageX;
      const dy = e.touches[0].pageY - e.touches[1].pageY;
      return Math.sqrt(dx * dx + dy * dy);
    }
    if (!cvContent.style) setIsOpenTem(true);
    return () => {
      canvas.dispose(); //set unmount by dispote to make canvas not zoom-in when click on any object in workspace canvas
    };
  }, [init]);
  //for cropper
  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const handleCropSave = async () => {
    if (!patternImageSrc || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(
        patternImageSrc,
        croppedAreaPixels
      );
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "cropped-image.png", { type: "image/png" });
      const imageUrl = URL.createObjectURL(file);
      editor?.handleCrop(imageUrl);
      setIsCropping(false);
    } catch (error) {
      console.error("Failed to crop image", error);
      // addNotification("Failed to crop image", "error");
    }
  };
  //for set template to open
  console.log("length of cv content", cvContent.style);

  return (
    <div className="relative flex flex-col w-full h-full">
      <Navbar
        editor={editor}
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
      />
      {/* test */}
      <div className="flex w-full">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
          setOpenTemplate={setIsOpenTem}
        />
        <div className="absolute flex w-full overflow-x-auto top-[calc(132px)]">
          <TextSidebar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <ShapeSidebar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <SettingsSidebar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
        </div>
      </div>

      <div className="flex h-[calc(100%-68px-80px)] ">
        <OpacitySidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ImagesSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        {/* Canvas */}
        <main
          className="relative flex flex-col flex-1 overflow-x-auto bg-muted"
          id="touchInfo"
        >
          {/* <LayersList canvas={canvas} id={""} /> */}
          <div
            className="flex-1 h-[calc(100%-124px)] bg-muted"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>

          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          />
          <StrokeColorSidebar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <StrokeWidthSidebar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <FontSidebar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <FillColorSidebar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <TextColorSidebar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          <FilterSidebar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          />
          {/* Cropping container */}
          {isOpenTemp && (
            <TemplateModal
              isOpen={isOpenTemp}
              setIsOpen={setIsOpenTem}
              onChangeActiveTool={onChangeActiveTool}
              userData={cvContent.userData}
              editor={editor}
              setCvContent={setCvContent}
            />
          )}
          {isCropping && (
            <div
              id="cropping-container"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white p-4 rounded-lg shadow-lg z-50 flex flex-col items-center"
            >
              <div className="relative w-full h-[300px]">
                <Cropper
                  image={patternImageSrc || ""}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              </div>
              <div className="flex justify-around w-full mt-4">
                <button
                  id="apply-crop"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                  onClick={handleCropSave}
                >
                  Apply Crop
                </button>
                <button
                  id="Close"
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                  onClick={() => setIsCropping(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          <Footer editor={editor} />
        </main>
      </div>
    </div>
  );
};

export default Editor;

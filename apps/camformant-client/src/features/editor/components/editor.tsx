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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log("inside useefect 9of editor");
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
      enableRetinaScaling: true, // Optional: Improves scaling behavior
      allowTouchScrolling: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    let lastPosX = 0;
    let lastPosY = 0;
    let lastDistance = 0; // To track the last distance between the two fingers
    let isPinching = false;

    // Handle mouse:move for two-finger panning and zooming
    canvas.on("mouse:move", (event: fabric.IEvent) => {
      const e = event.e as TouchEvent;

      // Handle panning and zooming with two fingers
      if (e.touches && e.touches.length === 2) {
        // Disable selection during pan and zoom
        canvas.selection = false;

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        // Calculate movement between the two touch points (for panning)
        const deltaX = touch1.clientX - lastPosX;
        const deltaY = touch1.clientY - lastPosY;

        // Calculate the distance between the two touch points (for zooming)
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If last distance exists, calculate zoom scale
        if (lastDistance > 0) {
          const scale = distance / lastDistance; // Calculate zoom scale
          const newZoom = Math.max(0.5, Math.min(canvas.getZoom() * scale, 5)); // Clamp zoom level

          // Calculate the midpoint between the two touch points
          const midpointX = (touch1.clientX + touch2.clientX) / 2;
          const midpointY = (touch1.clientY + touch2.clientY) / 2;

          // Zoom to the midpoint between the two touch points
          canvas.zoomToPoint(new fabric.Point(midpointX, midpointY), newZoom);
          canvas.requestRenderAll();
        }

        // If zooming is happening, calculate panning (move the canvas)
        if (isPinching) {
          const vp = canvas.viewportTransform;
          vp![4] += deltaX; // Move horizontally
          vp![5] += deltaY; // Move vertically

          canvas.setViewportTransform(vp!);
          canvas.requestRenderAll();
        }

        // Update last positions and distance for panning and zooming
        lastPosX = touch1.clientX;
        lastPosY = touch1.clientY;
        lastDistance = distance; // Update last distance for zooming
        isPinching = true;
      } else {
        lastPosX = 0; // Reset positions if not pinching
        lastPosY = 0;
        lastDistance = 0; // Reset distance if not pinching
        isPinching = false; // Reset panning and zooming state
        canvas.selection = true; // Re-enable selection when gesture ends
      }
    });

    // Handle mouse:down to initialize pan tracking
    canvas.on("mouse:down", (event: fabric.IEvent) => {
      const e = event.e as TouchEvent;
      if (e.touches && e.touches.length === 2) {
        lastPosX = e.touches[0].clientX; // Record the initial position of touch 1
        lastPosY = e.touches[0].clientY; // Record the initial position of touch 1
        lastDistance = 0; // Reset last distance on touch start
        isPinching = true; // Start tracking pan and zoom with two fingers
      }
    });

    // Ensure selection is re-enabled when the gesture ends
    canvas.on("mouse:up", () => {
      // After mouse up, reset last positions and distance for accurate movement tracking
      lastPosX = 0; // Reset positions
      lastPosY = 0;
      lastDistance = 0; // Reset zoom distance
      isPinching = false; // Reset panning and zooming state
      canvas.selection = true; // Re-enable selection after the gesture ends
    });
    return () => {
      canvas.dispose(); // Dispose canvas when unmounting
      if (cvContent.style) {
        setIsOpenTem(true);
      }
    };
    // eslint-disable-next-line
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
                  className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
                  onClick={handleCropSave}
                >
                  Apply Crop
                </button>
                <button
                  id="Close"
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
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

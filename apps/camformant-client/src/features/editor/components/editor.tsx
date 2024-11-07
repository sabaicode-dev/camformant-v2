"use client";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { fabric } from "fabric";
import { Cropper } from "react-cropper";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navbar } from "@/features/editor/components/navbar";
import { Sidebar } from "@/features/editor/components/sidebar";
import { Toolbar } from "@/features/editor/components/toolbar";
import { Footer } from "@/features/editor/components/footer";
import { ActiveTool, selectionDependentTools } from "@/features/editor/types";
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
// import LayersList from "./LayersList";
const Editor = () => {
  //set default active on select feature
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");
  const [patternImageSrc, setPatternImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false); // State to control cropper visibility
  const cropperRef = useRef<HTMLImageElement>(null);
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
      initSetPatternImageSrc: setPatternImageSrc,
      initSetShowCropper: setShowCropper,
      initCropper: cropperRef!.current,
    });
    return () => {
      canvas.dispose(); //set unmount by dispote to make canvas not zoom-in when click on any object in workspace canvas
    };
  }, [init]);
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
          {/* <FontSidebar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
          /> */}
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
        <FilterSidebar
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
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
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
          {/* Cropping container */}

          <div
            id="cropping-container"
            style={{ display: showCropper ? "block" : "none" }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-white p-4 rounded-lg shadow-lg z-50"
          >
            <Cropper
              src={patternImageSrc!} // Use the extracted pattern image as the source for Cropper
              style={{ height: 400, width: "100%" }}
              aspectRatio={1} // Set the aspect ratio to 1 (square cropping)
              guides={true} // Show the grid guides in the cropping box
              ref={cropperRef}
              viewMode={1} // Restrict crop box to within the canvas
              autoCropArea={0.8} // Initial cropping area set to 80%
              background={false} // Disable background image behind crop box
            />
            <div className="flex flex-row justify-around">
              <button
                id="apply-crop"
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                onClick={() => {
                  editor?.handleCrop();
                }}
              >
                Apply Crop
              </button>
              <button
                id="Close"
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={() => {
                  setShowCropper(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
          <Footer editor={editor} />
        </main>
      </div>
    </div>
  );
};

export default Editor;

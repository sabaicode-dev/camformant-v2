import React, { useEffect, useState } from "react";
import {
  ActiveTool,
  Editor,
  FONT_SIZE,
  FONT_WEIGHT,
} from "@/features/editor/types";
import { fabric } from "fabric";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BsBorderWidth } from "react-icons/bs";
import { TbColorFilter } from "react-icons/tb";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Copy,
  ImageIcon,
  Trash,
} from "lucide-react";
import { ImFontSize } from "react-icons/im";

import { RxTransparencyGrid } from "react-icons/rx";
import { isTextType } from "@/features/editor/utils";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import { FontSizeInput } from "@/features/editor/components/font-size-input";
import FormatBold from "./icons/svg components/formatBold";
import FontSize from "./icons/svg components/FontSize";
import FontIcon from "./icons/svg components/FontIcon";
import TextColor from "./icons/svg components/textColor";
import { NudgePosition } from "./move-nudge";
import NudgeIcon from "./icons/svg components/nudge";
import { FaCropSimple } from "react-icons/fa6";
import { MdAlignHorizontalLeft, MdAlignVerticalCenter } from "react-icons/md";
import GroupVerticalAlign from "./groupVerticalAlign";
import GroupHorizontalAlign from "./groupHoriAlign";
//TODO: add picker moving work
interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) => {
  const selectedObject = editor?.selectedObjects[0];
  const selectedObjectType = editor?.selectedObjects[0]?.type;
  const selectImageInsideShape = (() => {
    const pattern = editor?.selectedObjects[0]?.fill as fabric.Pattern;

    // Check if the fill is a fabric.Pattern object
    if (pattern instanceof fabric.Pattern) {
      return pattern.source instanceof HTMLImageElement ||
        (pattern.source as any) instanceof HTMLCanvasElement
        ? "image"
        : "";
    }

    return null;
  })();
  const isImage =
    selectedObjectType === "image" || selectImageInsideShape === "image";
  const isText = isTextType(selectedObjectType);

  const isShape = selectedObjectType === "shape";
  const isGroup = editor?.selectedObjects && editor?.selectedObjects.length > 1;

  const initialFillColor = editor?.getActiveFillColor();
  const initialStrokeColor = editor?.getActiveStrokeColor();
  const initialFontFamily = editor?.getActiveFontFamily();
  const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
  const initialFontStyle = editor?.getActiveFontStyle();
  const initialFontLinethrough = editor?.getActiveFontLinethrough() || false;
  const initialFontUnderline = editor?.getActiveFontUnderline() || false;
  const initialTextAlign = editor?.getActiveTextAlign();
  const initialFontSize = editor?.getActiveFontSize() || FONT_SIZE;

  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    strokeColor: initialStrokeColor,
    fontFamily: initialFontFamily,
    fontWeight: initialFontWeight,
    fontStyle: initialFontStyle,
    fontLinethrough: initialFontLinethrough,
    fontUnderline: initialFontUnderline,
    textAlign: initialTextAlign,
    fontSize: initialFontSize,
  });

  const onChangeFontSize = (value: number) => {
    if (!selectedObject) {
      return;
    }
    editor?.changeFontSize(value);
    console.log(selectedObject);

    setProperties((current) => ({ ...current, fontSize: value }));
  };

  const onChangeTextAlign = (value: string) => {
    if (!selectedObject) {
      return;
    }
    editor?.changeTextAlign(value);
    setProperties((current) => ({
      ...current,
      textAlign: value,
    }));
  };

  const toggleBold = () => {
    const selectedObject = editor?.selectedObjects[0];
    if (!selectedObject) {
      return;
    }
    const newValue = initialFontWeight > 500 ? 500 : 700;
    editor?.changeFontWeight(newValue);
    setProperties((current) => ({
      ...current,
      fontWeight: newValue,
    }));
  };
  const toggleItalic = () => {
    const selectedObject = editor?.selectedObjects[0];
    if (!selectedObject) {
      return;
    }
    const isTalic = properties.fontStyle === "italic";
    const newValue = isTalic ? "normal" : "italic";
    editor?.changeFontStyle(newValue);
    setProperties((current) => ({
      ...current,
      fontStyle: newValue,
    }));
  };
  const toggleLinethrough = () => {
    const selectedObject = editor?.selectedObjects[0];
    if (!selectedObject) {
      return;
    }
    const newValue = properties.fontLinethrough ? false : true;
    editor?.changeFontLinethrough(newValue);
    setProperties((current) => ({
      ...current,
      fontLinethrough: newValue,
    }));
  };
  const toggleUnderline = () => {
    const selectedObject = editor?.selectedObjects[0];
    if (!selectedObject) {
      return;
    }
    const newValue = properties.fontUnderline ? false : true;
    editor?.changeFontUnderline(newValue);
    setProperties((current) => ({
      ...current,
      fontUnderline: newValue,
    }));
  };

  if (editor?.selectedObjects.length === 0) {
    return (
      <div className="shrink-0 h-[56px] border-b border-orange-300 bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }
  return (
    <div className="shrink-0 h-[56px] border-b border-orange-300 bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      {!isImage && !isText && (
        <div className="flex items-center justify-center h-full ">
          <Hint label="Color" side="top" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("fill")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "fill" && "bg-gray-100")}
            >
              <div
                className="border rounded-md size-5"
                style={{
                  backgroundColor: properties.fillColor,
                }}
              />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center justify-center h-full ">
          <Hint label="Text Color" side="top" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("textcolor")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "textcolor" && "bg-gray-100")}
            >
              <TextColor width={32} height={32} />
            </Button>
          </Hint>
        </div>
      )}
      {!isText && (
        <div className="flex items-center justify-center h-full">
          <Hint label="Stroke Color" side="top" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("stroke-color")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "stroke-color" && "bg-gray-100")}
            >
              <div
                className="bg-white border-2 rounded-sm size-4"
                style={{
                  borderColor: properties.strokeColor,
                }}
              />
            </Button>
          </Hint>
        </div>
      )}
      {!isText && (
        <div className="flex items-center justify-center h-full">
          <Hint label="Stroke Width" side="top" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("stroke-width")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "stroke-width" && "bg-gray-100")}
            >
              <BsBorderWidth className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center justify-center h-full">
          <Hint label="Font" side="top" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("font")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "font" && "bg-gray-100")}
            >
              <FontIcon height={30} width={30} />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center justify-center h-full">
          <Hint label="Format" side="top" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("format")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "format" && "bg-gray-100")}
            >
              <FormatBold height={32} width={32} />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center justify-center h-full">
          <Hint label="Font Size" side="top" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("fontSize")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "fontSize" && "bg-gray-100")}
            >
              <FontSize width={32} height={32} />

              {/* <FaBold  /> */}
            </Button>
          </Hint>
        </div>
      )}
      {isGroup && (
        <div className="flex items-center justify-center h-full">
          <Hint label="verticle align" side="top" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("vertical-align")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "vertical-align" && "bg-gray-100")}
            >
              <MdAlignVerticalCenter width={28} height={28} />
            </Button>
          </Hint>
        </div>
      )}
      {isGroup && (
        <div className="flex items-center justify-center h-full">
          <Hint label="horizontal align" side="top" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("horizontal-align")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "horizontal-align" && "bg-gray-100")}
            >
              <MdAlignHorizontalLeft width={28} height={28} />
            </Button>
          </Hint>
        </div>
      )}
      <div className="flex items-center justify-center h-full">
        <Hint label="nudge" side="top" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("nudge")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "nudge" && "bg-gray-100")}
          >
            <NudgeIcon width={28} height={28} />
          </Button>
        </Hint>
      </div>
      {isText && activeTool === "format" && (
        <div className="flex absolute bottom-[108px] z-[40] left-20 bg-white p-1">
          <div className="flex items-center justify-center h-full">
            <Hint label="Bold" side="top" sideOffset={5}>
              <Button
                onClick={toggleBold}
                size="icon"
                variant="ghost"
                className={cn(properties.fontWeight > 500 && "bg-gray-100")}
              >
                <FaBold className="size-4" />
              </Button>
            </Hint>
          </div>
          <div className="flex items-center justify-center h-full">
            <Hint label="Italic" side="top" sideOffset={5}>
              <Button
                onClick={toggleItalic}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.fontStyle === "italic" && "bg-gray-100"
                )}
              >
                <FaItalic className="size-4" />
              </Button>
            </Hint>
          </div>
          <div className="flex items-center justify-center h-full">
            <Hint label="Underline" side="top" sideOffset={5}>
              <Button
                onClick={toggleUnderline}
                size="icon"
                variant="ghost"
                className={cn(properties.fontUnderline && "bg-gray-100")}
              >
                <FaUnderline className="size-4" />
              </Button>
            </Hint>
          </div>
          <div className="flex items-center justify-center h-full">
            <Hint label="Strike" side="top" sideOffset={5}>
              <Button
                onClick={toggleLinethrough}
                size="icon"
                variant="ghost"
                className={cn(properties.fontLinethrough && "bg-gray-100")}
              >
                <FaStrikethrough className="size-4" />
              </Button>
            </Hint>
          </div>
        </div>
      )}
      {isText && (
        <div className="flex items-center justify-center h-full">
          <Hint label="Align left" side="top" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("left")}
              size="icon"
              variant="ghost"
              className={cn(properties.textAlign === "left" && "bg-gray-100")}
            >
              <AlignLeft className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center justify-center h-full">
          <Hint label="Align center" side="top" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("center")}
              size="icon"
              variant="ghost"
              className={cn(properties.textAlign === "center" && "bg-gray-100")}
            >
              <AlignCenter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center justify-center h-full">
          <Hint label="Align right" side="top" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("right")}
              size="icon"
              variant="ghost"
              className={cn(properties.textAlign === "right" && "bg-gray-100")}
            >
              <AlignRight className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && activeTool === "fontSize" && (
        <div className="flex absolute bottom-[108px] z-[40] left-28 bg-white p-1">
          <div className="flex items-center justify-center h-full">
            <FontSizeInput
              value={properties.fontSize}
              onChange={onChangeFontSize}
            />
          </div>
        </div>
      )}
      {activeTool === "vertical-align" && (
        <div className="flex absolute bottom-[108px] z-[40] left-[140px] bg-white p-1">
          <div className="flex items-center justify-center h-full">
            <GroupVerticalAlign editor={editor} />
          </div>
        </div>
      )}
      {activeTool === "horizontal-align" && (
        <div className="flex absolute bottom-[108px] z-[40] left-[175px] bg-white p-1">
          <div className="flex items-center justify-center h-full">
            <GroupHorizontalAlign editor={editor} />
          </div>
        </div>
      )}
      {activeTool === "nudge" && (
        <div className="flex absolute bottom-[108px] z-[40] left-[195px] bg-white p-1">
          <div className="flex items-center justify-center h-full">
            <NudgePosition
              value={properties.fontSize}
              onChange={onChangeFontSize}
              editor={editor}
            />
          </div>
        </div>
      )}
      {isImage && (
        <div className="flex items-center justify-center h-full">
          <Hint label="Filters" side="top" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("filter")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "filter" && "bg-gray-100")}
            >
              <TbColorFilter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isImage && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Replace Image" side="top" sideOffset={5}>
            <Button
              onClick={() => {
                onChangeActiveTool("imageReplace");
              }}
              size="icon"
              variant="ghost"
            >
              <ImageIcon className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isImage && (
        <div className="flex items-center h-full justify-center">
          <Hint label="CropD Image" side="top" sideOffset={5}>
            <Button
              onClick={() => {
                editor?.enableCropping();
              }}
              size="icon"
              variant="ghost"
            >
              <FaCropSimple className="size-4" />
            </Button>
          </Hint>
        </div>
      )}{" "}
      <div className="flex items-center justify-center h-full">
        <Hint label="Bring Forward" side="top" sideOffset={5}>
          <Button
            onClick={() => editor?.bringForward()}
            size="icon"
            variant="ghost"
          >
            <ArrowUp className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center justify-center h-full">
        <Hint label="Send Backward" side="top" sideOffset={5}>
          <Button
            onClick={() => editor?.sendBackwards()}
            size="icon"
            variant="ghost"
          >
            <ArrowDown className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center justify-center h-full">
        <Hint label="Opacity" side="top" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-100")}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center justify-center h-full">
        <Hint label="Duplicate" side="top" sideOffset={5}>
          <Button
            onClick={() => {
              editor?.onCopy();
              editor?.onPaste();
            }}
            size="icon"
            variant="ghost"
          >
            <Copy className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center justify-center h-full">
        <Hint label="Delete" side="top" sideOffset={5}>
          <Button onClick={() => editor?.delete()} size="icon" variant="ghost">
            <Trash className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

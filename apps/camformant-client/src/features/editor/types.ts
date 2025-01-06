import { CustomCvDataParams } from "@/utils/types/user-profile";
import { fabric } from "fabric";
import { ITextboxOptions } from "fabric/fabric-impl";
import * as material from "material-colors";
import React, { SetStateAction } from "react";
export interface CvContentParams {
  style: string;
  json: {
    version: string;
    objects: any[];
    clipPath: any;
  };
  userData: CustomCvDataParams | {};
}
export const JSON_KEYS = [
  "name",
  "gradientAngle",
  "selectable",
  "hasControls",
  "linkData",
  "editable",
  "extensionType",
  "extension",
  "filters",
];

export const filters = [
  "none",
  "polaroid",
  "sepia",
  // "kodachrome",
  "contrast",
  "brightness",
  "greyscale",
  "brownie",
  "vintage",
  "technicolor",
  "pixelate",
  "invert",
  "blur",
  "sharpen",
  "emboss",
  "removecolor",
  "blackwhite",
  "vibrance",
  "blendcolor",
  "huerotate",
  "resize",
  "saturation",
  "gamma",
];

export const fonts = [
  "Arial",
  "Arial Black",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
  "Palatino",
  "Comic Sans MS",
  "Impact",
  "Lucida Sans Unicode",
  "Lucida Console",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Oswald",
  "PT Sans",
  "Noto Sans",
  "Fira Sans",
  "Ubuntu",
  "Segoe UI",
  "Futura",
  "Gill Sans",
  "Century Gothic",
  "Calibri",
  "Cambria",
  "Droid Sans",
  "Lucida Bright",
  "Optima",
];

export interface EditorHookProps {
  setPatternImageSrc: React.Dispatch<React.SetStateAction<string | null>>;
  setShowCropper: React.Dispatch<React.SetStateAction<boolean>>;
  defaultState: CvContentParams;
  setCvContent: React.Dispatch<SetStateAction<CvContentParams>>;
  clearSelectionCallback?: () => void;
}

export const selectionDependentTools = [
  "fill",
  "font",
  "filter",
  "opacity",
  "remove-bg",
  "stroke-color",
  "stroke-width",
];

export const colors = [
  material.red["500"],
  material.pink["500"],
  material.purple["500"],
  material.deepPurple["500"],
  material.indigo["500"],
  material.blue["500"],
  material.lightBlue["500"],
  material.cyan["500"],
  material.teal["500"],
  material.green["500"],
  material.lightGreen["500"],
  material.lime["500"],
  material.yellow["500"],
  material.amber["500"],
  material.orange["500"],
  material.deepOrange["500"],
  material.brown["500"],
  material.blueGrey["500"],
  "transparent",
];

export type ActiveTool =
  | "select"
  | "hand"
  | "shapes"
  | "text"
  | "images"
  | "imageReplace"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-width"
  | "font"
  | "opacity"
  | "filter"
  | "settings"
  | "ai"
  | "remove-bg"
  | "templates"
  | "format"
  | "fontSize"
  | "textcolor"
  | "nudge"
  | "horizontal-align"
  | "vertical-align"
  ;

export type BuildEditorProps = {
  dataForUpdate: any;
  setDataForUpdate: React.Dispatch<SetStateAction<any>>;
  cvContent: CvContentParams;
  setCvContent: React.Dispatch<SetStateAction<CvContentParams>>;
  canvasHistory: React.MutableRefObject<string[]>;
  setHistoryIndex: React.Dispatch<SetStateAction<number>>;
  moveLeft: () => void;
  moveRight: () => void;
  moveUp: () => void;
  moveDown: () => void;
  save: (skip?: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  autoZoom: () => void;
  copy: () => void;
  paste: () => void;
  setPatternImageSrc: React.Dispatch<React.SetStateAction<string | null>>;
  setShowCropper: React.Dispatch<React.SetStateAction<boolean>>;
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray: number[];
  setStrokeDashArray: (value: number[]) => void;
  setFillColor: (value: string) => void;
  setStrokeColor: (value: string) => void;
  setStrokeWidth: (value: number) => void;
  selectedObjects: fabric.Object[];
  fontFamily: string;
  setFontFamily: (value: string) => void;
};

export interface Editor {
  alignVerticalTop:()=>void;
  alignVerticalBottom:()=>void;
  alignVerticalCenter:()=>void;
  alignHorizontalLeft:()=>void;
  alignHorizontalRight:()=>void;
  alignHorizontalCenter:()=>void;
  setEditable: () => void;
  setUneditable: () => void;
  updateCv: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  savePdf: () => void;
  savePng: () => void;
  saveJpg: () => void;
  saveSvg: () => void;
  saveJson: () => void;
  loadJson: (
    json: string,
    style?: string,
    userData?: CustomCvDataParams | {}
  ) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  autoZoom: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  getWorkspace: () => fabric.Object | undefined;
  changeSize: (value: { width: number; height: number }) => void;
  changeBackground: (value: string) => void;
  onCopy: () => void;
  onPaste: () => void;
  changeImageFilter: (value: string) => void;
  addImage: (value: string) => void;
  replaceImage: (value: string) => void;
  enableCropping: () => void;
  handleCrop: (imageurl: string) => void;
  delete: () => void;
  getActiveFontSize: () => number;
  changeFontSize: (value: number) => void;
  getActiveTextAlign: () => string;
  changeTextAlign: (value: string) => void;
  getActiveFontLinethrough: () => string;
  changeFontLinethrough: (value: boolean) => void;
  getActiveFontUnderline: () => string;
  changeFontUnderline: (value: boolean) => void;
  getActiveFontStyle: () => string;
  changeFontStyle: (value: string) => void;
  changeFontWeight: (value: number) => void;
  getActiveFontWeight: () => number;
  getActiveFontFamily: () => string;
  changeFontFamily: (value: string) => void;
  addText: (value: string, options?: ITextboxOptions) => void;
  getActiveOpacity: () => number;
  changeOpacity: (value: number) => void;
  bringForward: () => void;
  sendBackwards: () => void;
  changeFillColor: (value: string) => void;
  changeStrokeColor: (value: string) => void;
  changeStrokeWidth: (value: number) => void;
  changeStrokeDashArray: (value: number[]) => void;
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInverseTriangle: () => void;
  addDiamond: () => void;
  getActiveFillColor: () => string;
  getActiveStrokeColor: () => string;
  getActiveStrokeWidth: () => number;
  getActiveStrokeDashArray: () => number[];
  canvas: fabric.Canvas;
  selectedObjects: fabric.Object[];
}

export const FILL_COLOR = "rgba(0,0,0,1)";
export const STROKE_COLOR = "rgba(0,0,0,1)";
export const STROKE_WIDTH = 2;
export const STROKE_DASH_ARRAY = [];
export const FONT_FAMILY = "Arial";
export const FONT_SIZE = 32;
export const FONT_WEIGHT = 400;

export const CIRCLE_OPTIONS = {
  radius: 125,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};
export const RECTANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 250,
  height: 250,
  angle: 0,
};
export const DIAMOND_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 350,
  height: 350,
  angle: 0,
};
export const TRIANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};
export const TEXT_OPTIONS = {
  type: "textbox",
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY,
};

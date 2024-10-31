import { fabric } from "fabric";
import { useEvent } from "react-use"; //event listener hook
interface UseHotKeysProps {
  canvas: fabric.Canvas | null;
  undo: () => void;
  redo: () => void;
  save: (skip?: boolean) => void;
  copy: () => void;
  paste: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  moveUp: () => void;
  moveDown: () => void;
}

export const useHotKeys = ({
  canvas,
  undo,
  redo,
  save,
  copy,
  paste,
  moveLeft,
  moveDown,
  moveRight,
  moveUp,
}: UseHotKeysProps) => {
  useEvent("keydown", (event) => {
    const isCtrlKey = event.ctrlKey || event.metaKey;
    const isBackspace = event.key === "Backspace";
    const isRight = event.key === "ArrowRight";
    const isLeft = event.key === "ArrowLeft";
    const isUp = event.key === "ArrowUp";
    const isDown = event.key === "ArrowDown";
    const isInput = ["INPUT", "TEXTAREA"].includes(
      (event.target as HTMLElement).tagName
    );

    if (isInput) return;
    if (isBackspace) {
      canvas?.remove(...canvas.getActiveObjects());
      canvas?.discardActiveObject();
    }
    if (isCtrlKey && event.key === "z") {
      event.preventDefault();
      undo();
    }
    if (isCtrlKey && event.key === "y") {
      event.preventDefault();
      redo();
    }
    if (isCtrlKey && event.key === "c") {
      event.preventDefault();
      copy();
    }
    if (isCtrlKey && event.key === "v") {
      event.preventDefault();
      paste();
    }

    if (isCtrlKey && event.key === "s") {
      event.preventDefault();
      save(true);
    }
    if (isLeft) {
      event.preventDefault();
      moveLeft();
    }
    if (isRight) {
      event.preventDefault();
      moveRight();
    }
    if (isUp) {
      event.preventDefault();
      moveUp();
    }
    if (isDown) {
      event.preventDefault();
      moveDown();
    }

    if (isCtrlKey && event.key === "a") {
      event.preventDefault();
      canvas?.discardActiveObject();

      const allObjects = canvas?.getObjects().filter((obj) => obj.selectable);
      // .filter((obj) => obj.name !== "clip"); can use this too

      canvas?.setActiveObject(
        new fabric.ActiveSelection(allObjects, { canvas })
      );

      canvas?.renderAll();
    }
  });
};

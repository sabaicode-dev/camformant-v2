import { fabric } from "fabric";
import { useEffect, useRef } from "react";

import { CustomCvDataParams } from "@/utils/types/user-profile";
import { setFetchData } from "@/features/editor/utils";

interface UseLoadStateProps {
  autoZoom: () => void;
  canvas: fabric.Canvas | null;
  initialState: React.MutableRefObject<any | undefined>;
  canvasHistory: React.MutableRefObject<string[]>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  userData: CustomCvDataParams | {};
}

export const useLoadState = ({
  canvas,
  autoZoom,
  initialState,
  canvasHistory,
  setHistoryIndex,
  userData,
}: UseLoadStateProps) => {
  const initialized = useRef(false);

  useEffect(() => {
    async function loadState() {
      if (!initialized.current && initialState?.current && canvas) {
        const data = initialState.current;

        canvas.loadFromJSON(data, () => {
          const currentState = JSON.stringify(canvas.toJSON());

          canvasHistory.current = [currentState];
          setHistoryIndex(0);
          autoZoom();
          setFetchData(canvas, userData);
        });
        initialized.current = true;
      }
    }
    loadState();
  }, [
    canvas,
    autoZoom,
    canvasHistory,
    initialState,
    setHistoryIndex,
    userData,
  ]);
};

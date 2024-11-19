import { fabric } from "fabric";
import { useEffect, useRef } from "react";

import { JSON_KEYS } from "@/features/editor/types";
import { CustomCvDataParams } from "@/utils/types/user-profile";
import { setFetchData } from "@/features/editor/utils";
import Editor from "../components/editor";

interface UseLoadStateProps {
  autoZoom: () => void;
  canvas: fabric.Canvas | null;
  initialState: React.MutableRefObject<any | undefined>;
  canvasHistory: React.MutableRefObject<string[]>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  userData:CustomCvDataParams|{}

}

export const useLoadState = ({
  canvas,
  autoZoom,
  initialState,
  canvasHistory,
  setHistoryIndex,
  userData
}: UseLoadStateProps) => {
  const initialized = useRef(false);

  useEffect(() => {
    async function loadState() {
      console.log("inside loasState:::", initialState);
      if (!initialized.current && initialState?.current && canvas) {
        const data = initialState.current;

        canvas.loadFromJSON(data, () => {
          const currentState = JSON.stringify(canvas.toJSON(JSON_KEYS));

          canvasHistory.current = [currentState];
          setHistoryIndex(0);
          autoZoom();
          setFetchData(canvas,userData)
        });
        initialized.current = true;
      }
    }
    loadState();
  }, [
    canvas,
  ]);
};

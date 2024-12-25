import { CirclePicker } from "react-color";
import { colors } from "@/features/editor/types";
import { rgbaObjectToString } from "@/features/editor/utils";
interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({
  value = "rgba(0, 0, 0, 1)",
  onChange = () => {},
}: ColorPickerProps) => {
  return (
    <div>
      <div className="flex items-center justify-center h-full overflow-auto">
        <div className="w-full p-2" style={{ scrollBehavior: "smooth" }}>
          {/* @ts-ignore */}
          <CirclePicker
            circleSize={25}
            className="circle-picker "
            color={value}
            colors={colors}
            onChangeComplete={(color) => {
              const formattedValue = rgbaObjectToString(color.rgb);
              onChange(formattedValue);
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-start w-full gap-2 m-3 ">
        <p>Pick any Color:</p>
        <input
          type="color"
          value={value} // Initial color in HEX format
          onChange={(e) => {
            const selectedColor = e.target.value; // HEX format from input
            onChange(selectedColor); // Update color state
          }}
          className="flex w-10 h-10 border rounded-lg"
        />
      </div>
    </div>
  );
};

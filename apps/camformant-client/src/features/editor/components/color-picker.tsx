import { ChromePicker, CirclePicker } from "react-color";
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
        <div className="p-2  w-full" style={{ scrollBehavior: "smooth" }}>
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
      <div className="flex items-center gap-2 justify-start m-3 w-full ">
        <p>Pick any Color:</p>
        <input
          type="color"
          value={value} // Initial color in HEX format
          onChange={(e) => {
            const selectedColor = e.target.value; // HEX format from input
            onChange(selectedColor); // Update color state
          }}
          className="w-10 h-10 rounded-lg border flex"
        />
      </div>
    </div>
  );
};

// {/* <div className="flex w-full space-y-4 overflow-x-scroll"> */}
// {/* <ChromePicker
//   color={value}
//   onChange={(color) => {
//     const formattedValue = rgbaObjectToString(color.rgb);
//     onChange(formattedValue);
//   }}
//   className="border rounded-lg"
// // /> */}

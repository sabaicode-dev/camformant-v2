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
    <div className="flex items-center justify-center h-full overflow-x-scroll overflow-y-hidden">
      <div className="p-2" style={{ scrollBehavior: "smooth" }}>
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

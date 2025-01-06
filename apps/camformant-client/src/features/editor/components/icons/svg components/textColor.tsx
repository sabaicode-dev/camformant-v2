import React from "react";

type Props = {};

const TextColor: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <rect x="0.5" width="20" height="20" fill="url(#pattern0_1_41)" />
      <defs>
        <pattern
          id="pattern0_1_41"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_1_41" transform="scale(0.0104167)" />
        </pattern>
        <image
          id="image0_1_41"
          width="96"
          height="96"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAACRklEQVR4nO2bTU7DMBBGZ0FPgHIMRG5CbkJPQm5CbkKvAb0B3QyK1CIWWPlpPJ543pNm56iKHdvvSx0RAAAAAAAA37QiohM1toFM9DMGYGwDGTiIyHnGAJyvbWFjuhmdf6uxLWzMsGAAxrawIY2IXBYMwOV6DWzEcUHn32q8BjbitGIAxmvAyP2VTFDW/ZVMUMb9LxObM5kgs/u/z9BTMsEdDBOd+zJjkMgEmdz/67pEPYjIJ5nA3v3fFmzUZIIM7v/8p+0TmcDW/T9WDBj/Eyygn+jM1xVLFv8TbOj+zT/XPYrIN5nAxv1TkAmM3D8FmcDI/VOQCQzdPwWZwMj9U5AJDN0/BZnAyP1TkAmM3D8FmcDQ/VOQCYzcPwWZwMj9U5AJDN0/BZnAyP1TkAkM3T8FmcDI/VOQCYzcPwWZwIEmDhO/FfLs0DDRKZYV7uzQ0vP+mrnCfU+w5ry/Zq5QZ4fWnPfXzBXme4J7zvtr5gpxduie8/6auao/OzT3W18tVNV/T7DkW18tVFVnAg+BqIuaCabc/2w0/a1egbjD00uxPmIm8PRauI2WCTze8MnRAxFyyh8dLYkhN73GiRSE1r7BgRaHvsnO8cMRYpofnC6PoTa63qEghFK91qEih7ux0w4elKqn9nEHS2XVm1vjXBZC6N3gWJdD3Ey3w4emqul82NmyWeWG1u9IHKpUunZH6gwAAAAAAPCLVl7uKd1BygCU7yRlBpTvKGUJqrPcU7qDlAEo30nKDCjfURp1CQIAAAAAAHHND3R0Pzuj9eHoAAAAAElFTkSuQmCC"
        />
      </defs>
    </svg>
  );
};

export default TextColor;

import React from "react";

const FontSize: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1_36)">
        <path
          d="M8 3.33334V5.83334H12.1667V15.8333H14.6667V5.83334H18.8333V3.33334H8ZM3 10H5.5V15.8333H8V10H10.5V7.50001H3V10Z"
          fill="#27384C"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_36">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FontSize;

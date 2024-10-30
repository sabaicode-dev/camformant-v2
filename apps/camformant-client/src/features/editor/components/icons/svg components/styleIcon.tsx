import React from "react";

const StyleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1_173)">
        <path
          d="M2.5 14.1667H17.5V12.5H2.5V14.1667ZM2.5 16.6667H17.5V15.8333H2.5V16.6667ZM2.5 10.8333H17.5V8.33333H2.5V10.8333ZM2.5 3.33333V6.66666H17.5V3.33333H2.5Z"
          fill="#27384C"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_173">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default StyleIcon;

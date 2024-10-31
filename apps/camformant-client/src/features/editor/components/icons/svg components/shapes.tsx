import React from "react";

const Shapes: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1_165)">
        <path
          d="M15.5 3.33333H5.49998C4.58331 3.33333 3.83331 4.08333 3.83331 4.99999V15C3.83331 15.9167 4.58331 16.6667 5.49998 16.6667H15.5C16.4166 16.6667 17.1666 15.9167 17.1666 15V4.99999C17.1666 4.08333 16.4166 3.33333 15.5 3.33333ZM15.5 15H5.49998V4.99999H15.5V15Z"
          fill="#27384C"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_165">
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

export default Shapes;

import React from "react";

const NudgeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1_92)">
        <path
          d="M16.8662 6.78144L16.8734 9.22848L13.8093 9.22686L13.8137 10.7376L16.8778 10.718L16.885 13.165L20.0674 9.96383L16.8662 6.78144ZM7.28145 3.61786L9.72849 3.61065L9.72687 6.6748L11.2377 6.67035L11.218 3.60626L13.665 3.59906L10.4638 0.416668L7.28145 3.61786ZM4.11786 13.2026L4.11065 10.7556L7.1748 10.7572L7.17035 9.24642L4.10627 9.26608L4.09906 6.81904L0.916675 10.0202L4.11786 13.2026ZM13.7026 16.3662L11.2556 16.3734L11.2572 13.3093L9.74642 13.3137L9.76609 16.3778L7.31905 16.385L10.5202 19.5674L13.7026 16.3662Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_92">
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

export default NudgeIcon;

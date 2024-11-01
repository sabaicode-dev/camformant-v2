import React from "react";

interface CatePositionProps {
  text?: string;
  className?: string;
  isSelected?: boolean; // Add a prop to indicate if this category is selected
  onClick: () => void;
}

export const CategoryPosition: React.FC<CatePositionProps> = ({
  text,
  className,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`cursor-pointer px-5 py-2 rounded-3xl drop-shadow-md overflow-hidden whitespace-nowrap
        ${isSelected ? "bg-orange-500 text-white" : "bg-white text-secondaryCam"}
        ${className}`}
      onClick={onClick}
    >
      <button className="font-medium focus:outline-none">{text}</button>
    </div>
  );
};

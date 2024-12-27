import React from "react";

interface typeLoading {
  text?: string;
}

const SkeletonLoader: React.FC<typeLoading> = ({ text }) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col justify-center items-center">
        {/* Spinning circle loader */}
        <div className="loader rounded-full border-t-4 border-black dark:border-white border-solid w-16 h-16 mb-4 animate-spin"></div>
        <h1 className="text-black text-xl dark:text-white">{text || "Updating..."}</h1>
      </div>
    </div>
  );
};

export default SkeletonLoader;

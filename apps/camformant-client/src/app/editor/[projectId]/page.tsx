import Editor from "@/features/editor/components/editor";
import React from "react";
import "@/app/globals.css";
const page = () => {
  return (
    <div className="absolute w-full h-full bg-primaryCam">
      <Editor />
    </div>
  );
};

export default page;

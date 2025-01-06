
import React from 'react';

interface ButtonProps {
  lengthofData:number
  onAdd: () => void
  onDelete:()=>void
}

const Button: React.FC<ButtonProps> = ({ lengthofData,onAdd,onDelete}) => {
  return (
    <div className=" w-full container relative pt-10 flex gap-3">
    <button
      onClick={onAdd}
      className="w-full  outline-none rounded-2xl flex items-center justify-between p-5 pl-7 bg-orange-500 text-white  shadow-md hover:bg-orange-600 transition-colors"
    >
      <span>Add</span>
      <span className="ml-2">+</span>
    </button>
    {lengthofData>1&&
    <button
    onClick={onDelete}
    className="w-full  outline-none rounded-2xl flex items-center justify-between p-5 pl-7 bg-red-500 text-white  shadow-md hover:bg-red-600 transition-colors"
  >
    <span>Delete</span>
    <span className="ml-2">-</span>
  </button>}
    </div>
  );
};

export default Button;

"use client";
import Link from "next/link";
("react-icons/io");
import { IoClose } from "react-icons/io5";
interface UploadedFile {
  files: {url:string}[]|undefined;
  removeFile: (index: number) => void;
}
const UploadedFile: React.FC<UploadedFile> = ({ files, removeFile }) => {
  return (
    <div className="w-full grid grid-cols-2 container pt-10 gap-5">
      {files![0].url!=""&&files!.map((file, index) => (
        <div className=" flex justify-center items-center outline-none rounded-2xl shadow-md shadow-black-300 px-5 text-center">
          <Link
            href={file.url}
            className="p-2 overflow-hidden whitespace-nowrap overflow-ellipsis"
          >
           {file.url}
          </Link>
          <IoClose
            className="text-[50px] text-red-500 hover:text-red-700 cursor-pointer"
            onClick={() => {
              removeFile(index);
            }}
          />
        </div>
      ))}
   
    </div>
  );
};

export default UploadedFile;

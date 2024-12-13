"use client";
import Link from "next/link";
("react-icons/io");
interface UploadedFile {
  files: { url: string }[] | undefined;
  removeFile: (index: number) => void;
}

const UploadedFile: React.FC<UploadedFile> = ({ files, removeFile }) => {
  return (
    <div className="container grid w-full grid-cols-2 gap-5 pt-10">
      {files!.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-center px-5 text-center shadow-md outline-none  rounded-2xl shadow-black-300"
        >
          <Link
            href={file.url}
            onClick={(e) => {
              e.preventDefault();
              window.open(file.url, "_blank");
            }}
            className="p-2 overflow-hidden whitespace-nowrap overflow-ellipsis"
          >
            {file.url}
          </Link>
          <span
            className="font-bold text-red-500 cursor-pointer hover:text-red-700"
            onClick={() => {
              removeFile(index);
            }}
          >
            x
          </span>
        </div>
      ))}
    </div>
  );
};

export default UploadedFile;

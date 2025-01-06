"use client";
import { useNotification } from "@/hooks/user-notification";
import { S3FileResParams, uploadToS3 } from "@/utils/functions/upload-to-s3";
import { CertificateParams } from "@/utils/types/user-profile";
import { useState } from "react";
export interface InputFileParams {
  setFiles: React.Dispatch<React.SetStateAction<CertificateParams[]>>;
  setIsPost: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const InputFile: React.FC<InputFileParams> = ({
  setFiles,
  setIsPost,
  setLoading,
}) => {
  const [fileName, setFileName] = useState("No file chosen");
  const { addNotification, NotificationDisplay } = useNotification();
  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setLoading(true);
        const image: S3FileResParams | undefined = await uploadToS3(file);
        setFileName(file.name);
        if (image) {
          image.statusCode == 200 && image.value
            ? setFiles((previous: CertificateParams[]) => {
                return [...previous, { url: image.value! }];
              })
            : addNotification(image.errorMessage!, "error");
        }

        setIsPost(true);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    } else {
      setFileName("No file chosen");
    }
  };
  return (
    <div className="w-full container relative pt-10 `w-full outline-none rounded-2xl p-5 shadow-md shadow-black-300 pl-7">
      <NotificationDisplay />
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Custom button styled with Tailwind */}
      <div className="flex items-center w-full">
        <label
          htmlFor="file-upload"
          className="px-5 py-2 font-semibold text-white bg-orange-500 rounded-lg cursor-pointer hover:bg-orange-600 whitespace-nowrap"
        >
          Choose File
        </label>

        {/* Display selected file name */}
        <span className="ml-3 overflow-hidden text-gray-600 whitespace-nowrap overflow-ellipsis">
          {fileName}
        </span>
      </div>
    </div>
  );
};

export default InputFile;

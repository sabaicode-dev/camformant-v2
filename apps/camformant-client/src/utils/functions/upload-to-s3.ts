import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
export interface S3FileResParams {
  statusCode: number;
  value?: string;
  errorMessage?: string;
}
export const uploadToS3 = async (
  file: File
): Promise<S3FileResParams | undefined> => {
  if (!file) {
    return;
  }
  const formData = new FormData();
  formData.append("file", file);
  console.log("filename", formData);
  try {
    const response: any = await axiosInstance.post(
      API_ENDPOINTS.USER_PROFILE_UPLOADF_FILE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(" respinse from file::::", response);

    if (!response) {
      console.log("something wrong with uploading");
    }
    return {
      statusCode: 200,
      value: response.data,
    };
  } catch (err: any) {
    console.log("errror yeah", err);
    if (err.status == 413)
      return { statusCode: 413, errorMessage: "File is too large" };
  }
};

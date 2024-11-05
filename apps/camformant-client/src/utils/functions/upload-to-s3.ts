import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";

export const uploadToS3 = async (file: File):Promise<string|undefined> => {
  if (!file) {
    return;
  }
  const formData = new FormData();
  formData.append("file", file);
  console.log("filename", formData);
  try {
    const response: {data:string} = await axiosInstance.post(
     API_ENDPOINTS.USER_PROFILE_UPLOADF_FILE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
   
   
    if (!response) {
      console.log("something wrong with uploading");
    }
    return response.data
  } catch (err) {
    console.log("errror yeah", err);
  }
};
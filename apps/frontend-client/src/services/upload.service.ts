import axiosInstance from "@/utils/axios";

export const uploadToS3 = async (file: File): Promise<string | undefined> => {
    console.log("filename calllll upload", file);
    if (!file) {
        return;
    }
    const formData = new FormData();
    formData.append("file", file); // Append the file to the form data
    try {
        console.log("filename is perform :::::::", formData);
        const response = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/users/uploadFile`, // Your API endpoint for file upload
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
                },
            }
        );

        console.log("response s3 :::::::::::::::::::::::;;;", response.data);
        if (!response) {
            console.log("something wrong with uploading");
        }
        // Return the URL that the backend responds with (the S3 URL)
        return response.data;
    } catch (err) {
        console.error("Error during file upload:", err);
        throw new Error("File upload failed");
    }
};

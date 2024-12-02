import axiosInstance from "@/utils/axios";

interface UploadResponse {
    url: string;
}

export async function uploadToS3(file: File): Promise<UploadResponse> {
    try {
        // First, get the presigned URL from your backend
        const { data: presignedUrl } = await axiosInstance.get('/api/upload/presign');

        // Upload the file directly to S3 using the presigned URL
        await axiosInstance.put(presignedUrl.url, file, {
            headers: {
                'Content-Type': file.type,
            },
        });

        // Return the final URL where the file can be accessed
        return { url: presignedUrl.fileUrl };
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload file');
    }
}
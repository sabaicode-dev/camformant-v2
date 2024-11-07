import configs from "@/src/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const  uploadToS3 = async(file: Express.Multer.File, location?: string) => {
  const s3 = new S3Client({
    region: configs.awsRegion,
    credentials: {
      accessKeyId: configs.awsAcessKeyId,
      secretAccessKey: configs.awsSecretAccessKey,
    },
  });
  const uploadParams = {
    Bucket:configs.awsS3BucketName,
    Key: `${location}/${Date.now()}-${file.originalname}`, // File name in S3
    Body: file.buffer, // File data
    ContentType: file.mimetype, // MIME type of the file
  };
  try {
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);
    return `https://${configs.awsS3BucketName}.s3.${configs.awsRegion}.amazonaws.com/${uploadParams.Key}`;
  } catch (error) {
    throw error;
  }
};

import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { uploadToS3 } from '@/services/upload.service';
import { Input } from '@/components/ui/input';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadError: (error: Error) => void;
  onUploadStart: () => void;
}

export function ImageUpload({ onUploadComplete, onUploadError, onUploadStart }: ImageUploadProps) {
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      onUploadStart(); // Indicate upload started

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size should be less than 5MB');
      }

      const url = await uploadToS3(file);  // Upload the file and get the URL
      if (url) {
        onUploadComplete(url);  // Pass the URL to the parent component
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (error) {
      onUploadError(error instanceof Error ? error : new Error('Upload failed'));
    }
  }, [onUploadComplete, onUploadError, onUploadStart]);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Add Your Photo
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="profile-image"
        />
        <label
          htmlFor="profile-image"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="h-10 w-10 text-gray-400" />
          <span className="text-sm text-gray-500">
            Choose File or drag and drop SVG, PNG, JPG, or GIF (max. 5MB)
          </span>
        </label>
      </div>
    </div>
  );
}

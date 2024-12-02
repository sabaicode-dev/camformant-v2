import React, { useState } from 'react';
import type { ProfileData } from '../../../types/profile';
import { PersonalInfoSection } from './PersonalInfoSection';
import { LocationSection } from './LocationSection';
import { SocialLinksSection } from './SocialLinksSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from "@/components/ui/textarea"
import { cn } from '@/lib/utils';
import { ImageUpload } from './ImageUpload';
interface EditProfileFormProps {
  initialData?: ProfileData;
  onSubmit: (data: ProfileData) => void;
}

export function EditProfileForm({ initialData, onSubmit }: EditProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData | null>(initialData || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadStart = () => {
    setIsUploading(true);
    
  };

  const handleUploadComplete = (url: string) => {
    setIsUploading(false);
    setFormData(prev => ({
      ...prev,
      profile: url 
    }));
  };

  const handleUploadError = (error: Error) => {
    setIsUploading(false);
    console.error('Error uploading file:', error);
    
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as ProfileData);
  };

  return (
    <ScrollArea className='h-screen'>
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
      
      <div className="space-y-8">
        <PersonalInfoSection 
          formData={formData} 
          onChange={handleInputChange}
        />

        <ImageUpload
          onUploadStart={handleUploadStart}
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <Textarea
            name="description"
            value={formData?.description}
            onChange={handleInputChange}
            rows={4}
            className={cn("w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500")}
            placeholder="Write something about yourself..."
          />
        </div>

        <LocationSection 
          location={formData?.location}
          onChange={(location) => setFormData((prev) => ({ ...prev, location }))}
        />

        <SocialLinksSection 
          socialLinks={formData?.social_links}
          contact={formData?.contact}
          onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
        />

        <div className="flex justify-end">
   <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
    </ScrollArea>
  );
}
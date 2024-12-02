import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import type { ProfileData } from '../../../types/profile';
import { PersonalInfoSection } from './PersonalInfoSection';
import { LocationSection } from './LocationSection';
import { SocialLinksSection } from './SocialLinksSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { cn } from '@/lib/utils';

interface EditProfileFormProps {
  initialData?: ProfileData;
  onSubmit: (data: ProfileData) => void;
}

export function EditProfileForm({ initialData, onSubmit }: EditProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData | null>(initialData || null);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSubmit(formData);
    }
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

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Add Your Photo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-image"
            />
            <label
              htmlFor="profile-image"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="h-10 w-10 text-gray-400" />
              <span className="text-sm text-gray-500">
                Choose File or drag and drop SVG, PNG, JPG or GIF (max. 800 X 800px)
              </span>
            </label>
          </div>
        </div>

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
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
    </ScrollArea>
  );
}
import React from 'react';
import { Camera } from 'lucide-react';
import Image from 'next/image';

interface ProfileHeaderProps {
  name?: string;
  role?: string;
  coverImage?: string;
  profile?: string;
  onEdit?: () => void;
}

export function ProfileHeader({ name, role, coverImage, profile, onEdit }: ProfileHeaderProps) {
  return (
    <div className="relative">
      <div className="h-48 w-full overflow-hidden">
      <Image
            src={"https://media.istockphoto.com/id/1696167872/photo/aerial-view-of-forest-at-sunset-on-the-background-of-mountains-in-dolomites.jpg?s=1024x1024&w=is&k=20&c=sfRAnSjXlDxAAAMZ0ZtYG5GpetUCOqETKyVc0Oz6kyU="}
            alt="Background Banner"
            className="w-full h-full object-cover "
            width={1000}
            height={1000}
          />
      </div>
      
      {onEdit && (
        <button 
          onClick={onEdit}
          className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <Camera className="w-5 h-5 text-gray-700" />
        </button>
      )}

      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
        <div className="relative">
        <Image
              src={profile || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              width={1000}
              height={1000}
            />
          {onEdit && (
            <button 
              onClick={onEdit}
              className="absolute bottom-0 right-0 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <Camera className="w-4 h-4 text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { Phone, Video, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

interface ChatHeaderProps {
  name: string;
  profile: string;
  onBack: () => void;
}

export function ChatHeader({ name, profile, onBack }: ChatHeaderProps) {
  return (
    <div className="p-3 bg-white border-b flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="md:hidden">
          <ChevronLeft />
        </button>
        <div className="relative">
          <Image 
            src={profile} 
            alt={name} 
            className="rounded-full object-cover"
            width={40}
            height={40}
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h3 className="font-semibold">{name}</h3>
          <span className="text-xs text-green-500">Online</span>
        </div>
      </div>
      {/* <div className="flex space-x-3">
        <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
          <Phone className="text-gray-600" />
        </button>
        <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
          <Video className="text-gray-600" />
        </button>
      </div> */}
    </div>
  );
}
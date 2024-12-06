import React from 'react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileInfo } from './ProfileInfo';
import { ProfileData } from '@/types/profile';
interface ProfileProps {
    user?: ProfileData | null;
}
  
export function Profile({ user }: ProfileProps) {
  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <ProfileHeader name={user?.name}profile={user?.profile} />
          <div className="text-center mt-20">
            <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
          </div>
        <ProfileInfo data={user} />
    </div>
  );
}
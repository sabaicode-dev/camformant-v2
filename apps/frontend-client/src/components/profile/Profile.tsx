import React from 'react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileInfo } from './ProfileInfo';
import { useAuth } from '@/context/AuthContext';

export function Profile() {
    const { user } = useAuth();
  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <ProfileHeader
        name={user?.name}
        profile={user?.profile}
        onEdit={() => console.log('Edit clicked')}
      />
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
      </div>
      <ProfileInfo data={user} />
    </div>
  );
}
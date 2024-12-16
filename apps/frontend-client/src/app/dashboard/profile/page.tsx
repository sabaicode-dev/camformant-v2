"use client";
import { EditProfileForm } from "@/components/profile/editProfile/EditProfileForm";
import { EditProfileSkeleton } from "@/components/profile/editProfile/EditProfileSkeleton";
import { Profile } from "@/components/profile/Profile";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { useAuth } from "@/context/AuthContext";
import { ProfileData } from "@/types/profile";
import axiosInstance from "@/utils/axios";
import React, { useEffect } from "react";

const ProfilePage = () => {
  const { user, fetchUser, isLoading } = useAuth();

  const handleSubmit = async (data: ProfileData) => {
    try {
      await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/corporator/profile/${user?._id}`,
        data
      );
      await fetchUser();
    } catch (error) {
      console.error("Failed to update profile data:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="lg:sticky lg:top-12 lg:h-[calc(100vh-6rem)]">
              <ProfileSkeleton />
            </div>
            <div className="">
              <EditProfileSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        {!isLoading ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="lg:sticky lg:top-0 lg:h-[calc(100vh-8rem)]">
              <Profile user={user} />
            </div>
            <div className="h-screen">
              <EditProfileForm initialData={user} onSubmit={handleSubmit} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="lg:sticky lg:top-0 lg:h-[calc(100vh-8rem)]">
              <ProfileSkeleton />
            </div>
            <div className="">
              <EditProfileSkeleton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

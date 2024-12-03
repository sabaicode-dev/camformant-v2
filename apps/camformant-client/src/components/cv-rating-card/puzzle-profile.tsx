"use client";

import React, { useEffect, useState } from "react";
import ProfileRating from "@/components/cv-rating-card/profile-rating"
import { useAuth } from "@/context/auth";

interface ProfileRating {
  totalRating: number;
}
const PuzzleProfile: React.FC<ProfileRating> = ({ totalRating }) => {
  const {user}=useAuth()
  return (
    <div>
      <ProfileRating
        rating={totalRating}
        pic={user?.profile}
        username={user!.username}
        userId={user!._id}
      />
    </div>
  );
};

export default PuzzleProfile;

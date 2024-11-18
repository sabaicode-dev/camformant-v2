"use client";

import React, { useEffect, useState } from "react";
import ProfileRating from "./profile-rating";
// import { TypeProfile } from "../profile/typeProfile";
import axios from "axios";
import { useAuth } from "@/context/auth";

interface ProfileRating {
  totalRating: number;
}
const PuzzleProfile: React.FC<ProfileRating> = ({ totalRating }) => {
  const {user}=useAuth()
  const [User, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  return (
    <div>
      <ProfileRating
        rating={totalRating}
        pic={user?.profile}
        username={user!.username}
      />
    </div>
  );
};

export default PuzzleProfile;

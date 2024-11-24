"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BackButton_md } from "../back/BackButton";
import PuzzleCard from "./puzzle-card";
import { useAuth } from "@/context/auth";
import CallToAction from "@/components/calltoaction/call-to-action";
import PuzzleProfile from "@/components/cv-rating-card/puzzle-profile";

const AllPuzzle = () => {
  const { user } = useAuth();
  const [total, setTotal] = useState<number>(0);

  return (
    <div>
      <Link href={"/profile"}>
        <BackButton_md styles="absolute bg-white p-3 px-4 rounded-xl top-5  left-3  " />
      </Link>
      {user ? (
        <div>
          <div className=" container ">
            <PuzzleProfile totalRating={total}/>
          </div>
          <div>
            <PuzzleCard propTotal={setTotal} />
          </div>
        </div>
      ) : (
        <CallToAction text="Login Required" buttonText="Go to Login" buttonLink="/login" />
      )}
    </div>
  );
};

export default AllPuzzle;

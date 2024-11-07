"use client";
import Link from "next/link";
import React, { useState } from "react";
import { BackButton_md } from "../back/BackButton";
import PuzzleProfile from "./puzzle-profile";
import PuzzleCard from "./puzzle-card";
import { useAuth } from "@/context/auth";

const AllPuzzle = () => {
  const { user } = useAuth();
  const [total, setTotal] = useState<number>(0);

  return user ? (
    <div>
      <Link href={"/profile"}>
        <BackButton_md styles="absolute bg-white p-3 px-4 rounded-xl top-5  left-3  " />
      </Link>
      <div className=" container ">
        <PuzzleProfile totalRating={total} />
      </div>
      <div>
        <PuzzleCard propTotal={setTotal} />
      </div>
    </div>
  ) : (
    <p className="flex items-center justify-center w-full h-56 mb-20">
      Please Signin
    </p>
  );
};

export default AllPuzzle;

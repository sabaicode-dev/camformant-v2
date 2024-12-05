"use client";
import React, { useEffect, useState } from "react";
import CardRating from "./rating-card";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/context/auth";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import axiosInstance from "@/utils/axios";
import { calculateProgressBar } from "@/utils/functions/progressbar-function";

interface typePropsTotal {
  propTotal: (value: number) => void;
}
const PuzzleCard: React.FC<typePropsTotal> = ({ propTotal }) => {
  const [info, setInfo] = useState<number>(0);
  const [edu, setEdu] = useState<number>(0);
  const [exp, setExp] = useState<number>(0);
  const [self, setSelf] = useState<number>(0);
  const [cert, setCert] = useState<number>(0);
  const [port, setPort] = useState<number>(0);
  const [ref, setRef] = useState<number>(0);
  const [ability, setAbility] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    async function GetCard() {
      // const ip = 'http://localhost:3040'
      // const ip = 'http://192.168.3.167:3030'
      try {
        const response = await axiosInstance.get(
          `${API_ENDPOINTS.USER_PROFILE_DETAIL}/${user?._id}`
        ); //get uer data
        if (!response) {
          return null;
        }
        setInfo(calculateProgressBar(response.data.data.basic, 8));
        setEdu(calculateProgressBar(response.data.data.educations, 4));
        setExp(calculateProgressBar(response.data.data.experiences, 4));
        setSelf(calculateProgressBar(response.data.data.descriptions, 2));
        setCert(calculateProgressBar(response.data.data.certificates, 1));
        setPort(calculateProgressBar(response.data.data.portfolio, 2));
        setRef(calculateProgressBar(response.data.data.references, 5));
        console.log("skill");
        const skillProgress: number = calculateProgressBar(
          response.data.data.skills,
          2
        );
        const expertise: number = calculateProgressBar(
          response.data.data.expertise,
          2
        );
        const language: number = calculateProgressBar(
          response.data.data.languages,
          2
        );
        setAbility(Math.round((skillProgress + expertise + language) / 3));

        console.log("basic", info);
      } catch (error) {
        console.error(error);
      }
    }
    GetCard();
  }, [edu, info]);
  useEffect(() => {
    const totalRating = info + edu + exp + self + cert + port + ref + ability;
    console.log("Total rating: " + totalRating);
    const totalRatingNew = Math.round((totalRating * 100) / 800);
    totalRatingNew;
    propTotal(totalRatingNew);
  }, [info, edu, exp, self, cert, port, ref, ability, propTotal]);

  const TitleCard = [
    { txt: "Basic Information", rating: info, route: "/basic" },
    { txt: "Education", rating: edu, route: "/educ" },
    { txt: "Experience ", rating: exp, route: "/exp" },
    { txt: "Ability ", rating: ability, route: "/ability" },
    { txt: "Self Description", rating: self, route: "/description" },
    { txt: "Portfilio", rating: port, route: "/portfolio" },
    { txt: "Certificate", rating: cert, route: "/certificate" },
    { txt: "Reference", rating: ref, route: "/references" },
  ];
  return (
    <div className="flex container justify-center w-full gap-[4%] h-full pt-5 flex-wrap pb-40  ">
      {TitleCard.map((item, index) => (
        <div key={index} className=" h-24 w-[46%] shadow-md rounded-md ">
          <Link href={`jobs/${item.route}`}>
            <CardRating rating={item.rating} txt={item.txt} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PuzzleCard;

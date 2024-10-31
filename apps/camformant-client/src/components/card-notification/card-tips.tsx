/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React from "react";

interface TipCardProps {
  title: string;
  description: string;
  image: string;
}
const tips = [
  {
    title: "How to prepare for an Interview?",
    description:
      "Life presents a variety of situations in which someone will want to interview you.",
    image: "../../../images/tips1.png",
  },
  {
    title: "How to prepare for an Interview?",
    description:
      "Life presents a variety of situations in which someone will want to interview you.",
    image: "../../../images/tips2.png",
  },
  {
    title: "How to prepare for an Interview By Online?",
    description:
      "Life presents a variety of situations in which someone will want to interview you.",
    image: "../../../images/tips3.png",
  },
];

const TipCard: React.FC<TipCardProps> = ({ title, description, image }) => {
  return (
    <div className="flex items-center p-3 mb-6 shadow-md border-spacing-9 border-gray-50 rounded-3xl">
      <Image
        src={image}
        alt={title}
        className="object-cover w-24 h-24 mr-4 rounded-md"
      />
      <div>
        <h2 className="pb-3 font-semibold text-md">{title}</h2>
        <p className="text-sm text-gray-500 line-clamp-3">{description}</p>
      </div>
      <div className="relative ml-auto">
        <div className="absolute w-2 h-2 bg-blue-500 rounded-full  top-10"></div>
      </div>
    </div>
  );
};

export const CardTips: React.FC = () => {
  return (
    <div className="min-h-screen ">
      <h1 className="mb-6 text-sm text-gray-400">
        We have some tip for you to interview
      </h1>
      <div>
        {tips.map((tip, index) => (
          <TipCard
            key={index}
            title={tip.title}
            description={tip.description}
            image={tip.image}
          />
        ))}
      </div>
    </div>
  );
};

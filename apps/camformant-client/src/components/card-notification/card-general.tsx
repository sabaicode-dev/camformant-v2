/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React from "react";

interface NotificationProps {
  image: string | undefined;
  title: string;
  description?: string;
  time: string;
}

const notifications = [
  {
    title: "You have a New post to dfghjkjdfgdhjhdfjgjhdghdjhjkljhg",
    description:
      "Life presents a variety of situations in whndshvfhsdfvhjsbhfjbdhbrhgbhrdft thsjfhdrhgjdjrhgdhgjdro interview you.",
    time: "1 hour ago",
    image: "/images/G1.png",
  },
  {
    title: "How to prepare for an Interview?",
    description:
      "Life presents a variety of situations in which someone will want to interview you.",
    time: "1 hour ago",
    image: "/images/G2.png",
  },
  {
    title: "You have a New post to see in CamHR",
    description:
      "Life presents a variety of situations in which someone will want to interview you.",
    time: "1 hour ago",
    image: "/images/G3.png",
  },
  {
    title: "You have aNew post to see in CambHR",
    description:
      "Life presents a variety of situations in which someone will want to interview you.",
    time: "1 hour ago",
    image: "/images/G1.png",
  },
  {
    title: "How to prepare for an Interview?",
    description:
      "Life presents a variety of situations in which someone will want to interview you.",
    time: "1 hour ago",
    image: "/images/G2.png",
  },
  {
    title: "You have a New post to see in CamHR",
    description:
      "Life presents a variety of situations in which someone will want to interview you.",
    time: "1 hour ago",
    image: "/images/G3.png",
  },
  {
    title: "You have aNew post to see in CambHR",
    description:
      "Life presents a variety of situations in which someone will want to interview you.",
    time: "1 hour ago",
    image: "/images/G1.png",
  },
  {
    title: "How to prepare for an Interview?",
    description: "Life presents a variety of  want to interview you.",
    time: "1 hour ago",
    image: "/images/G2.png",
  },
  {
    title: "You have a New post to see in CamHR",
    description:
      "Life presents a variety of situations in which someone will want to interview you.",
    time: "1 hour ago",
    image: "/images/G3.png",
  },
];

const GeneralCard: React.FC<NotificationProps> = ({
  image,
  title,
  description,
  time,
}) => {
  return (
    <div className="relative flex items-center justify-between w-full px-2 mb-3 border shadow-md gap-x-4 h-28 border-gray-50 rounded-3xl">
      <span className="absolute bg-blue-500 rounded-full right-2 top-3 size-2"></span>
      <Image
        src={"https://sabaicode.com/sabaicode.jpg"}
        alt="companyLogo"
        width={50}
        height={50}
        className="rounded-full w-14"
      />
      <div className="flex flex-col w-[calc(100%-56px)] gap-y-1 gap-x-1 overflow-hidden">
        <p className="w-full line-clamp-1">{title}</p>
        <p className="w-full text-md line-clamp-1">{description}</p>
        <p className="w-full text-xs line-clamp-1">{time}</p>
      </div>
    </div>
  );
};

export const CardGeneral = () => {
  return (
    <div className="flex flex-col justify-center w-full mb-16 gap-y-2">
      {notifications.map((tip, index) => (
        <GeneralCard
          key={index}
          title={tip.title}
          time={tip.time}
          image={tip.image}
          description={tip.description}
        />
      ))}
    </div>
  );
};

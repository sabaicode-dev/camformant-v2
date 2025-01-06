/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";

interface NotificationProps {
  image: string | undefined;
  title: string;
  description?: string;
  time: string;
  handleOnClick: () => void;
}
export interface INotificationHistory {
  _id?: string;
  title?: string;
  description?: string;
  icon?: string;
  url?: string;
  updatedAt?: Date;
}
const notifications = [
  {
    title: "You have aNew post to see in CambHR",
    description:
      "Life presents a variety of situations in which someone will want to interview you.",
    time: "1 hour ago",
    image: "/images/G1.png",
  },
];

const GeneralCard: React.FC<NotificationProps> = ({
  image,
  title,
  description,
  time,
  handleOnClick,
}) => {
  // Calculate the difference in days between the current date and the provided date
  const daysAgo = differenceInDays(new Date(), new Date(time));

  // If the date is 5 days ago or older, show the full date, otherwise show relative time
  let displayTime: string;

  if (daysAgo >= 5) {
    displayTime = format(new Date(time), "dd MMMM, yyyy"); // e.g., "15 December, 2024"
  } else {
    displayTime = formatDistanceToNow(new Date(time), { addSuffix: true }); // e.g. 1 hour ago
  }

  return (
    <div
      className="relative flex items-center justify-between w-full px-2 mb-3 border shadow-md gap-x-4 h-28 border-gray-50 rounded-3xl"
      onClick={handleOnClick}
    >
      <span className="absolute bg-blue-500 rounded-full right-2 top-3 size-2"></span>
      <Image
        src={image || "https://sabaicode.com/sabaicode.jpg"}
        alt="companyLogo"
        width={50}
        height={50}
        className="rounded-full w-14"
      />
      <div className="flex flex-col w-[calc(100%-56px)] gap-y-1 gap-x-1 overflow-hidden">
        <p className="w-full line-clamp-1">{title}</p>
        <p className="w-full text-md line-clamp-1">{description}</p>
        <p className="w-full text-xs line-clamp-1">{displayTime}</p>
      </div>
    </div>
  );
};

export const CardGeneral = ({ data }: { data: INotificationHistory[] }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center w-full mb-16 gap-y-2">
      {data.map((tip, index) => (
        <GeneralCard
          key={index}
          title={tip.title!}
          time={
            tip.updatedAt ? tip.updatedAt.toLocaleString() : "No time available"
          }
          image={tip.icon}
          description={tip.description}
          handleOnClick={() => router.push(tip.url!)}
        />
      ))}
    </div>
  );
};

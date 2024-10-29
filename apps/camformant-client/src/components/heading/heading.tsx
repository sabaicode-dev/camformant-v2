import Link from "next/link";

interface Props {
  title: string;
  subTitle?: string;
  link?: string;
}

export const Heading: React.FC<Props> = ({ title, subTitle, link }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-1">
        <span className="text-lg font-semibold text-secondary">{title}</span>
        {subTitle && <span className="text-xs text-secondary">{subTitle}</span>}
      </div>
      {link && (
        <Link href={link} className="text-md text-primaryCam">
          Search more
        </Link>
      )}
    </div>
  );
};

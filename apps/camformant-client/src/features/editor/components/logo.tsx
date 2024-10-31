import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="size-10 relative shrink-0">
        <Image
          src="/hab_logo.svg"
          fill
          priority
          alt="logo"
          className="shrink-0 hover:opacity-75 transition"
        />
      </div>
    </Link>
  );
};

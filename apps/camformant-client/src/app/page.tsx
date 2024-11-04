"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/home");
  }, [router]);

  return (
    <>
      <div className="w-full text-2xl text-center text-primaryCam">
        Redirecting to Home Page...
      </div>
    </>
  );
}

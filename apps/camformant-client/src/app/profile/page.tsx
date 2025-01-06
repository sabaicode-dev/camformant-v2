"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { IoCameraSharp } from "react-icons/io5";
import Background from "@/components/background/background";
import Link from "next/link";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "@/components/profile/crop";
import HeaderBasic from "@/components/cv-rating-card/router-page/basic/header-basic";
import ButtonSignOut from "@/components/login-logout/sign-out";
import { useNotification } from "@/hooks/user-notification";
import NotificationComponent from "@/components/notification/notification";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { S3FileResParams, uploadToS3 } from "@/utils/functions/upload-to-s3";
import { Heart, Users } from "lucide-react";

const SkeletonLoader = ({
  width = "w-32",
  height = "h-32",
  rounded = "rounded-full",
}) => (
  <section className="container flex flex-col items-center p-4 gap-y-10">
    <div className="flex flex-col items-center gap-4">
      <div className={`${width} ${height} ${rounded} bg-gray-200`} />
      <div className="w-20 h-5 bg-gray-200 rounded-md" />
    </div>
    <div className="flex flex-col items-start w-full gap-4">
      <div className="flex justify-between gap-4">
        <div className="w-5 h-5 bg-gray-200 rounded-3xl" />
        <div className="w-40 h-5 bg-gray-200 rounded-md" />
      </div>
      <div className="flex justify-between gap-4">
        <div className="w-5 h-5 bg-gray-200 rounded-3xl" />
        <div className="w-40 h-5 bg-gray-200 rounded-md" />
      </div>
      <div className="flex justify-between gap-4">
        <div className="w-5 h-5 bg-gray-200 rounded-3xl" />
        <div className="w-40 h-5 bg-gray-200 rounded-md" />
      </div>
    </div>
  </section>
);

const Page: React.FC = () => {
  const { addNotification, NotificationDisplay } = useNotification();
  const { user, loading, logout, isAuthenticated, setUser } = useAuth();

  const RefFile = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const router = useRouter();

  function handleImage() {
    RefFile.current?.click();
  }

  function handleSelectImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setIsCropping(true);
      };
    }
  }

  async function changeProfile(photo: string) {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.USER_PROFILE}/photo`,
        { photo: photo }
      );
      setUser({
        ...user!,
        profile: response.data.data.profile,
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "cropped-image.png", { type: "image/png" });
      setIsCropping(false);
      const image: S3FileResParams | undefined = await uploadToS3(file);
      if (image) {
        image.statusCode == 200 && image.value
          ? changeProfile(image.value)
          : addNotification(image.errorMessage!, "error");
      }
    } catch (error) {
      console.error("Failed to crop image", error);
      addNotification("Failed to crop image", "error");
    }
  };

  function handleCropCancel() {
    setIsCropping(false);
  }

  return (
    <React.Fragment>
      <NotificationDisplay />
      <div className="w-full h-screen ipse:h-[130vh] ipx:h-screen">
        <Background style="bg-mybg-linear ipx:h-[20%] ipse:h-[22%]">
          <div className="container mt-[-70px] flex flex-col items-center justify-center gap-5">
            {/* ==================== PROFILE PICTURE  ================================*/}
            <div className={`relative ${loading ? "hidden" : ""}`}>
              <div
                className={` w-32 h-32 rounded-full overflow-hidden bg-white`}
              >
                <Image
                  className={`object-cover`}
                  src={user?.profile || "/images/def-user-profile.png"}
                  height={200}
                  width={200}
                  alt="Profile Picture"
                />
              </div>
              <input
                onChange={handleSelectImage}
                ref={RefFile}
                className="hidden"
                type="file"
                name="myImage"
                accept="image/*"
              />
              {isAuthenticated && (
                <span
                  onClick={handleImage}
                  className="absolute bottom-0 right-0 flex items-center p-3 text-2xl text-gray-400 bg-white rounded-full shadow-xl"
                >
                  <IoCameraSharp />
                </span>
              )}
            </div>

            {/* ==================== CROPPING IMAGE  ================================*/}
            {isCropping && (
              <div className="fixed inset-0 z-40 flex items-center justify-center w-full bg- bg-opacity-60 ">
                <div className="relative h-screen p-4 rounded w-96">
                  <Cropper
                    image={imageSrc || ""}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  />
                </div>
                <div className="absolute top-0 z-50 w-full bg-white ">
                  <HeaderBasic
                    title="Profile Picture"
                    save="Save"
                    next={handleCropSave}
                    cacel={handleCropCancel}
                  />
                </div>
              </div>
            )}

            {/* ==================== USERNAME  ================================*/}
            <h1 className={`relative text-xl ${loading ? "hidden" : ""}`}>
              {user ? user.username : "Please login to get your detail"}
            </h1>

            {/* ==================== PERSONAL INFO  ================================*/}
            {loading ? (
              <SkeletonLoader />
            ) : (
              <div className="p-5 w-full flex flex-col gap-6 justify-center items-center bg-white shadow-[0_35px_224px_15px_rgba(0,0,0,0.2)] rounded-3xl">
                <Link className={`w-full`} href={"/cv-rating"}>
                  <span className="flex items-center w-full gap-5 text-lg">
                    <Users size={22} />
                    <div>Personal Profile</div>
                  </span>
                </Link>
                <Link className="w-full" href={"/favorite"}>
                  <span className="flex items-center w-full gap-5 text-lg">
                    <Heart size={22} />
                    <div className="pl-1">favorite</div>
                  </span>
                </Link>
                <NotificationComponent addNotification={addNotification} />
              </div>
            )}
            <ButtonSignOut
              onHandleLogout={
                isAuthenticated ? logout : () => router.push("/login")
              }
              isLogout={user?.username || null}
            />
          </div>
        </Background>
      </div>
    </React.Fragment>
  );
};

export default Page;

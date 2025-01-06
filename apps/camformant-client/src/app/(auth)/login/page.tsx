"use client";
//
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoArrowBack } from "react-icons/io5";
import { useAuth } from "@/context/auth";
import { useNotification } from "@/hooks/user-notification";
import { isAPIErrorResponse } from "@/utils/types/common";
import { LoginProps, UserSchemaLogin } from "@/schema/login";
import { FormFieldLogin } from "@/components/auth/form/form-field-login";
import { ContactSocialMedia } from "@/components/auth/contact-social-media/contact-social-media";
import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Page: React.FC = () => {
  const { login, loading, resStatus } = useAuth();
  const { addNotification, NotificationDisplay } = useNotification();
  const [isVisible, setIsVisible] = useState(false);
  const onChangeVisible = () => {
    setIsVisible(!isVisible);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>({
    resolver: zodResolver(UserSchemaLogin), // Apply the zodResolver
  });

  const onSubmit = async (data: LoginProps) => {
    let contactMethod = "";
    if (emailRegex.test(data.email)) {
      contactMethod = "email";
    } else {
      contactMethod = "phone_number";
    }

    try {
      await login({
        [contactMethod]: data.email,
        password: data.password,
      });
      if (resStatus === 200) {
        addNotification("Login Successful", "success");
      }
    } catch (error) {
      if (isAPIErrorResponse(error)) {
        addNotification(error.response.data.message, "error");
      } else {
        addNotification(error as string, "error");
      }
    }
  };

  return (
    <>
      <NotificationDisplay />
      <form className="container" onSubmit={handleSubmit(onSubmit)}>
        <div className="pt-4">
          <a href="/home">
            <span className="text-2xl">
              <IoArrowBack />
            </span>
          </a>
        </div>
        <h1 className="flex items-center justify-center w-full my-5 text-xl font-bold">
          Sign in Account
        </h1>
        <div className="flex flex-col gap-5">
          <FormFieldLogin
            type="email"
            placeholder="Email"
            name="email"
            register={register}
            error={errors.email}
          />
          <FormFieldLogin
            type={isVisible ? "text" : "password"}
            placeholder="Password"
            name="password"
            register={register}
            isIcon={true}
            error={errors.password}
            onChangeVisible={onChangeVisible}
          />

          <div className="flex pl-6 font-semibold gap-x-2">
            <span>{"Don't an account already?"} </span>
            <Link href={"/register"} className="text-orange-500 ">
              Register
            </Link>
          </div>
          <button
            type="submit"
            className="px-10 py-4 mt-2 text-white bg-primaryCam rounded-3xl"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </div>
        <div className="mt-20">
          <ContactSocialMedia />
        </div>
      </form>
    </>
  );
};

export default Page;

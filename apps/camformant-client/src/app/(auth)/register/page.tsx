"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { useAuth } from "@/context/auth";
import { useNotification } from "@/hooks/user-notification";
import { isAPIErrorResponse } from "@/utils/types/common";
import { ContactSocialMedia } from "@/components/auth/contact-social-media/contact-social-media";
import { FormFieldRegister } from "@/components/auth/form/form-field-register";
import { RegisterProps, UserSchema } from "@/schema/register";
import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Page: React.FC = () => {
  const { signup, loading, resStatus } = useAuth();
  const { addNotification, NotificationDisplay } = useNotification();
  const [isVisible, setVisible] = useState(false);
  const onChangeVisible = () => {
    setVisible(!isVisible);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterProps>({
    resolver: zodResolver(UserSchema), // Apply the zodResolver
  });
  const onSubmit = async (data: RegisterProps) => {
    let contactMethod = "";
    if (emailRegex.test(data.contact)) {
      contactMethod = "email";
    } else {
      contactMethod = "phone_number";
    }

    try {
      await signup({ ...data, [contactMethod]: data.contact });
      if (resStatus === 200) {
        addNotification("Register Successful", "success");
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
        <div className="flex pt-4">
          <a href="/home">
            <span className="text-2xl">
              <IoArrowBack />
            </span>
          </a>
          <h1 className="flex items-center justify-center w-full mb-3 text-xl font-bold">
            Register Account
          </h1>
        </div>
        <div className="flex flex-col gap-x-5 gap-y-3">
          <FormFieldRegister
            type="text"
            placeholder="Sur Name"
            name="sur_name"
            register={register}
            error={errors.sur_name}
          />
          <FormFieldRegister
            type="text"
            placeholder="Last Name"
            name="last_name"
            register={register}
            error={errors.last_name}
          />
          <FormFieldRegister
            type="text"
            placeholder="Email or Phone Number"
            name="contact"
            register={register}
            error={errors.contact}
          />
          <FormFieldRegister
            type={isVisible ? "text" : "password"}
            placeholder="Password"
            name="password"
            register={register}
            isIcon={true}
            onChangeVisible={onChangeVisible}
            error={errors.password}
          />
          <FormFieldRegister
            type={isVisible ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirmPassword"
            register={register}
            isIcon={true}
            onChangeVisible={onChangeVisible}
            error={errors.confirmPassword}
          />

          <div className="flex pl-6 font-semibold gap-x-2">
            <span>Have an account already? </span>
            <Link href={"/login"} className="text-orange-500 ">
              Sign in
            </Link>
          </div>
          <button
            type="submit"
            className="px-10 py-4 mt-2 text-white bg-primaryCam rounded-3xl"
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </div>
        <div className="mt-5 mb-24">
          <ContactSocialMedia />
        </div>
      </form>
    </>
  );
};

export default Page;

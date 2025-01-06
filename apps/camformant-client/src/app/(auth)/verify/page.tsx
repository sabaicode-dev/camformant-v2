"use client";

import { useForm, Controller } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useNotification } from "@/hooks/user-notification";
import { useAuth } from "@/context/auth";
import { isAPIErrorResponse } from "@/utils/types/common";

type VerifyFormProps = {
  otp: string[];
};

const Page: React.FC = () => {
  const { verify, loading, resStatus } = useAuth();
  const searchParams = useSearchParams();
  const contactQuery = searchParams.get("contact");
  const contactMethodQuery = searchParams.get("method");
  const { addNotification, NotificationDisplay } = useNotification();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormProps>();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const onSubmit = async () => {
    const otpCode = otp.join("");

    try {
      await verify({
        [contactMethodQuery!]: contactQuery,
        code: otpCode,
      });
      if (resStatus === 200) {
        addNotification("Verify Successful", "success");
      }
    } catch (error) {
      if (isAPIErrorResponse(error)) {
        addNotification(error.response.data.message, "error");
      } else {
        addNotification(error as string, "error");
      }
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input box if a digit is entered
    if (value.length === 1 && index < otp.length - 1) {
      const nextSibling = document.getElementById(`otp-input-${index + 1}`);
      if (nextSibling) {
        nextSibling.focus();
      }
    }
  };

  return (
    <div>
      <NotificationDisplay />
      <form className="container" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="mt-6 mb-6 text-2xl font-bold text-center">
          Verify Your Account
        </h1>
        <p className="mb-8 text-center text-gray-600">
          We have sent a 6-digit code to your{" "}
          {contactMethodQuery === "email" ? "email" : "phone number"}:{" "}
          {contactQuery}. Please enter it below:
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Controller
                key={index}
                name={`otp.${index}`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    className="w-12 h-12 text-xl font-semibold text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryCam"
                  />
                )}
              />
            ))}
        </div>

        {errors.otp && (
          <p className="text-center text-red-500">{errors.otp.message}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 mt-4 font-semibold text-white transition-colors duration-300 rounded-lg bg-primaryCam hover:bg-primaryCam-dark"
        >
          {loading ? "Loading..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default Page;

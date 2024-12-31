"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { signUpSchema } from "@/lib/validations/authValidations";
import { useState } from "react";
import { FormFields } from "../signupForm/FormFields";
import { SignUpFormWrapper } from "../signupForm/SignUpFormWrapper";

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const { signUp } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      sur_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      contact: {
        phone_number: "",
      },
      employee_count: "1",
    },
  });

  async function onSubmit(data: SignUpFormValues) {
    try {
      setIsLoading(true);
      await signUp(data);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    }
  }

  return (
    <SignUpFormWrapper title="Submit an account" description="Submit an account to get started">
    <FormFields form={form} onSubmit={onSubmit} isLoading={isLoading} error={error} />
    </SignUpFormWrapper>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { signInSchema } from "@/lib/validations/authValidations";
import { Icons } from "@/components/ui/icons";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { SignUpFormWrapper } from "../signupForm/SignUpFormWrapper";

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInFormValues) {
    let contactMethod = "";
    if (data.email.includes("@")) {
      contactMethod = "email";
    } else {
      contactMethod = "phone_number";
    }
    try {
      setIsLoading(true);
      await signIn({
        email: contactMethod === "email" ? data.email : "",
        phone_number: contactMethod === "phone_number" ? data.email : "",
        password: data.password,
      });
      setIsLoading(false);
    } catch (error: any) {
      form.setError("root", {
        message: error.response.data.message || "Invalid credentials",
      });
    } finally {
    }
  }

  return (
    <SignUpFormWrapper title="Sign In" description="Enter your email and password to sign in to your account">
      <div className="w-full flex justify-center items-center">
          <Card className="w-full max-w-sm border-none dark:bg-gray-700">
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name@example.com"
                            {...field}
                            type="email"
                            disabled={isLoading}
                            className="w-full p-1 rounded-md border font-medium min-h-10 h-auto placeholder-gray-400 placeholder:pl-2 pl-3"

                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              disabled={isLoading}
                              placeholder="password"
                              className="w-full p-1 rounded-md border font-medium min-h-10 h-auto placeholder-gray-400 placeholder:pl-2 pl-3"

                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              disabled={isLoading}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                              {showPassword ? (
                                <EyeOpenIcon />
                              ) : (
                                <EyeClosedIcon />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Error Message */}
                  {form.formState.errors.root && (
                    <div className="text-sm font-medium text-red-600">
                      {form.formState.errors.root.message}
                    </div>
                  )}
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 text-white hover:bg-orange-600"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign In
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-muted-foreground text-center">
                {"Don't have an account? "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => router.push("/signup")}
                >
                  Create account
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
    </SignUpFormWrapper>
    // <div className="flex items-center justify-center min-h-screen dark:bg-black bg-gray-100 p-4">
    //   <div className="flex flex-col-reverse md:flex-row w-full md:w-3/4 lg:w-2/3 dark:bg-gray-700 h-auto md:h-[550px] bg-white rounded-lg shadow-lg overflow-hidden">
    //     {/* Left Image Section */}
    //     <div className="w-full md:w-1/2 flex justify-center items-center">
    //       <Image
    //         className="w-full h-auto object-cover"
    //         src="/img/Job hunt-amico.png"
    //         alt="Job image"
    //         width={800}
    //         height={800}
    //         priority
    //       />
    //     </div>
    //     {/* Right Form Section */}

        
    //   </div>
    // </div>
  );
}

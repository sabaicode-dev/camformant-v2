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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signUpSchema } from "@/lib/validations/authValidations";
import { Icons } from "../ui/icons";

type SignUpFormValues = z.infer<typeof signUpSchema>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignUpForm() {
  const { signUp, isLoading } = useAuth();
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      sur_name: "",
      last_name: "",
      contact: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignUpFormValues) {
    let contactMethod = "";
    if (emailRegex.test(data.contact)) {
      contactMethod = "email";
    } else {
      contactMethod = "phone_number";
    }
    try {
      await signUp({
        ...data,
        email: contactMethod === "email" ? data.contact : "",
        phone_number: contactMethod === "phone_number" ? data.contact : "",
      });
    } catch (error: any) {
      form.setError("root", {
        message: error.message || "Something went wrong",
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex w-4/6 h-[590px] items-center border shadow-lg">
        {/* Left side with image */}
        <div className="w-2/4 h-full">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTF8fGJvb2slMjB3aXRoJTIwcGxhbnR8ZW58MHx8MHx8fDA%3D"
            alt=""
          />
        </div>

        {/* Right side with form */}
        <div className="w-2/4 flex justify-center items-center">
          <Card className="w-5/6 bg-transparent flex-shrink-0 border-none p-2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>
                Enter your details below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="sur_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            disabled={isLoading}
                            className="h-[45px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            disabled={isLoading}
                            className="h-[45px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name@example.com"
                            {...field}
                            type="email"
                            disabled={isLoading}
                            className="h-[45px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="password"
                            {...field}
                            type="password"
                            disabled={isLoading}
                            className="h-[45px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Confirm your password"
                            {...field}
                            type="password"
                            disabled={isLoading}
                            className="h-[45px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Show error message if passwords do not match */}
                  {form.formState.errors.confirmPassword && (
                    <div className="text-sm font-medium text-red-600">
                      {form.formState.errors.confirmPassword.message}
                    </div>
                  )}
                  <Button
                    type="submit"
                    variant={"orange"}
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create account
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => router.push("/signin")}
                >
                  Sign in
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

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
import { signInSchema } from "@/lib/validations/authValidations";
import { Icons } from "@/components/ui/icons";
import Image from "next/image";

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { signIn, isLoading } = useAuth();
  const router = useRouter();

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
      await signIn({
        email: contactMethod === "email" ? data.email : "",
        phone_number: contactMethod === "phone_number" ? data.email : "",
        password: data.password,
      });
    } catch (error: any) {
      form.setError("root", {
        message: error.message || "Invalid credentials",
      });
    } finally {
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex w-4/6 h-[590px] items-center border shadow-lg">
        <div className="w-2/4 h-full">
          <Image
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTF8fGJvb2slMjB3aXRoJTIwcGxhbnR8ZW58MHx8MHx8fDA%3D"
            alt=""
            width={800}
            height={800}
          />
        </div>
        <div className="w-2/4 flex justify-center items-center">
          <Card className="w-[400px] border-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>
                Enter your email and password to sign in to your account
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
                            {...field}
                            type="password"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.formState.errors.root && (
                    <div className="text-sm font-medium text-destructive">
                      {form.formState.errors.root.message}
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign in
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-muted-foreground text-center">
                {" Don't have an account? "}
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
      </div>
    </div>
  );
}

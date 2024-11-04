'use client';

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { signUpSchema } from "@/lib/validations/authValidations";
import { Icons } from "../ui/icons";

type SignUpFormValues = z.infer<typeof signUpSchema>

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

export function SignUpForm() {
  const { signUp ,isLoading} = useAuth()
  const router = useRouter()

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      sur_name: "",
      last_name: "",
      contact: "",
      password: "",
    },
  })

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
        phone_number: contactMethod === "phone_number" ? data.contact : ""
      })
    } catch (error : any) {
      form.setError("root", { 
        message: error.message || "Something went wrong" 
      })
    } 
  }

  return (
    <Card className="w-[400px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sur_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} disabled={isLoading} />
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
                    <Input placeholder="Doe" {...field} disabled={isLoading} />
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
                    <Input placeholder="name@example.com" {...field} type="email" disabled={isLoading} />
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
                    <Input {...field} type="password" disabled={isLoading} />
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
              Create account
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Button variant="link" className="p-0" onClick={() => router.push('/signin')}>
            Sign in
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
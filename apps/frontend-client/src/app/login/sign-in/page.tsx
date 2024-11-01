// pages/signin.tsx
"use client"
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useRouter } from "next/navigation";
import { SignInSchema } from "./schema/signInSchema";

const SignIn = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof SignInSchema>) {
        setIsLoading(true);
        setError(null);
        console.log("values ::::: ", values);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("authToken", data.token); // Assuming token is returned
                router.push("/dashboard"); // Redirect to dashboard on success
            } else {
                setError(data.message || "Sign-in failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
            setError("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="px-20">
            <h1 className="text-3xl font-semibold text-start mb-5">Sign In</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Email..."
                                        {...field}
                                        type="email"
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
                                        placeholder="Password..."
                                        {...field}
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    <Button type="submit" className="mt-3 bg-[#FB923C]" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default SignIn;

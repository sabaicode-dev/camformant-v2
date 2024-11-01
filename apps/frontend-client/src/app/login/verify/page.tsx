// pages/verify-otp.js
"use client";

import React, { useState, useEffect } from "react";
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
import { OtpSchema } from "./schema/otpSchema";

const VerifyOtp = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Retrieve email from localStorage
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            // Redirect to sign-up page if email is missing
            router.push("/login");
        }
    }, [router]);

    const form = useForm<z.infer<typeof OtpSchema>>({
        resolver: zodResolver(OtpSchema),
        defaultValues: {
            code: "",
        },
    });

    async function onSubmit(values: z.infer<typeof OtpSchema>) {
        if (!email) return; // Exit if email is not set

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/verify`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, code: values.code }), // Send email and code
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem("userEmail"); // Clear email from storage
                router.push("/login/sign-in"); // Redirect to dashboard on success
            } else {
                setError(
                    data.message || "OTP verification failed. Please try again."
                );
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setError("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="px-20">
            <h1 className="text-3xl font-semibold text-start mb-5">
                Verify OTP
            </h1>
            <p className="mb-4 text-sm text-gray-500">
                Enter the 6-digit code sent to your email to verify your
                account.
            </p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                >
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>OTP Code</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter OTP code..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    <Button
                        type="submit"
                        className="mt-3 bg-[#FB923C]"
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "Verify Code"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default VerifyOtp;

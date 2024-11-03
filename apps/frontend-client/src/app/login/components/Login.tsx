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
import Google from "../../../../public/Google.png";
import Image from "next/image";

// Extend FormSchema to include sur_name, last_name, email, password fields
const FormSchema = z.object({
    sur_name: z.string().min(1, "Surname is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

interface LoginProps {
    title: string;
}

const Login: React.FC<LoginProps> = ({ title }) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            sur_name: "",
            last_name: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_AUTH_ENDPOINT}/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                }
            );

            const data = await response.json();
            console.log("data ::::: ", data);
            if (response.ok) {
                localStorage.setItem("userEmail", values.email); // Save email in localStorage
                router.push("/login/verify"); // Redirect to OTP verification page
            } else {
                setError(data.message || "Sign-up failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="px-20">
            <h1 className="text-3xl font-semibold text-start mb-5">{title}</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                >
                    <FormField
                        control={form.control}
                        name="sur_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Surname</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Surname..."
                                        {...field}
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
                                        placeholder="Last Name..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <Button
                        type="submit"
                        className="mt-3 bg-[#FB923C]"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing up..." : "Sign up"}
                    </Button>
                    <Button
                        type="button"
                        className="mt-3 bg-[#E2E8F0] text-slate-500 flex items-center justify-center"
                    >
                        <Image src={Google} alt="Google" className="w-5 mr-2" />
                        Sign in with Google
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default Login;

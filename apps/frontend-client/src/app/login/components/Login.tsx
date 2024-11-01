import React from "react";
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
import { FormSchema } from "../schema/formSchema";
import Google from "../../../../public/Google.png";
import Image from "next/image";
interface LoginProps {
    title: string;
}

const Login: React.FC<LoginProps> = ({ title }) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: "",
            rememberMe: false, // Default value for the checkbox
        },
    });

    function onSubmit(values: z.infer<typeof FormSchema>) {
        router.push("/dashboard");
        console.log(values);
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
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email or Phone Number</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Email or Phone Number..."
                                        {...field}
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
                    <Button type="submit" className="mt-3 bg-[#FB923C]">
                        Sign in
                    </Button>
                    <Button
                        type="button"
                        className="mt-3 bg-[#E2E8F0] text-slate-500"
                    >
                        <Image src={Google} alt="Google" className="w-5" />
                        Sign in with Google
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default Login;

// git fetch origin
// git checkout 8--frontend-client----secure-dashboard-access

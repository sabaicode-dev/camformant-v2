"use client";
import React from "react";
import Login from "./components/Login";
import Image from "next/image";
import Logim from "../../../public/Rectangle 5135.png";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const LoginPage = () => {
    return (
        <div className="w-full h-screen p-20 flex items-center justify-center">
            <div className="w-[1000px] flex items-center overflow-hidden border-2 rounded-lg gap-5 shadow-lg">
                <div className="w-full">
                    <AspectRatio>
                        <Image
                            src={Logim}
                            alt="Image"
                            className="w-full h-full"
                        />
                    </AspectRatio>
                </div>

                <div className="w-full">
                    <Login title="Sign in" />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

'use client'
import { BackButton_md } from "@/components/back/BackButton";
import {useRouter} from "next/navigation";
import React from "react";

interface typeofHeader{
    next?:()=>void;
    title?:string;
    save?:string;
    cacel?:()=>void;
    nextRoute?:string;
}
const HeaderBasic:React.FC<typeofHeader> = ({next,title,save,cacel,nextRoute}) => {
    const router = useRouter();
    return (
        <div className="flex p-3 pt-7 shadow-md w-full h-full justify-between ">
            <div className="flex container gap-5 ">
                <div onClick={cacel?cacel:()=>history.back()}>
                <BackButton_md />                    
                </div>

                <h1 className="text-xl ">{title}</h1>
            </div>
            <button onClick={()=>{
                next&&next()
                if(next){
                    console.log("sth chnmaged")
                }
                nextRoute&&router.push(nextRoute);
            }} className="text-orange-500 text-lg pr-3 ">{save? save:'Next'}</button>
        </div>
    );
};

export default HeaderBasic;

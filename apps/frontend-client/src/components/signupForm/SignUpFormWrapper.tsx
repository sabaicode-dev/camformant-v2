import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface SignUpFormWrapperProps {
  children: React.ReactNode;
}

export function SignUpFormWrapper({ children }: SignUpFormWrapperProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col-reverse md:flex-row w-full md:w-3/4 lg:w-2/3 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Side - Image */}
        <div className="md:w-1/2 w-full flex items-center justify-center p-8">
          <Image
            src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop"
            alt="Corporate signup"
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 w-full p-8">
          <Card className="w-full border-none shadow-none">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                <p className="text-gray-500">Enter your information to get started</p>
              </div>
              {children}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
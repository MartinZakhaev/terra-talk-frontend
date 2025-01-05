"use client";

import { useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";

import SignInForm from "@/components/auth/signInForm";
import Image from "next/image";
import { HashLoader } from "react-spinners";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-white bg-opacity-75 backdrop-blur-sm z-50">
          <div className="text-xl font-bold">
            Please wait, we&apos;re logging you in
          </div>
          <HashLoader />
        </div>
      )}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Terra Talk
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInForm setIsLoading={setIsLoading} />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="/images/signin.gif"
          alt="Image"
          width={800}
          height={800}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

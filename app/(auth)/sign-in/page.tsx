"use client";

import { useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { Moon, MoonIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import SignInForm from "@/components/auth/signInForm";
import Image from "next/image";
import { HashLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LoginPage() {
  // const { setTheme } = useTheme();
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
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
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

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "@/auth";
import { ChevronLeft } from "lucide-react";

const RegisterPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary-gradient">
      <Card className={"max-w-[380px] mx-auto w-full"}>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-start">
              <Link
                href={"/"}
                className="text-xs cursor-pointer flex items-center gap-1 font-medium text-body"
              >
                <ChevronLeft size={12} />
                Back
              </Link>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Image
                src="/images/logo.png"
                alt="Codematic Logo"
                height={40}
                width={40}
              />

              <span className="font-space-grotesk text-primary text-[24px] font-bold ">
                Ksscode
              </span>
            </div>
          </CardTitle>
          <CardDescription>
            Welcome to Codematic Technology Services Knowledge Sharing and
            collaboration platform. Please this platform is for only Codematic
            technology staff, for more enquires please send an{" "}
            <Link
              className="text-primary underline"
              href="mailto: developers@codematic"
            >
              email
            </Link>{" "}
            on how you can have a customized experience
          </CardDescription>
        </CardHeader>
        <CardContent className=""></CardContent>
        <CardFooter>
          <form
            action={async () => {
              "use server";

              await signIn("google", { redirectTo: "/dashboard" });
            }}
            className="w-full block"
          >
            <Button size={"lg"} className="w-full">
              <div className="p-1 bg-white rounded-sm">
                <Image
                  src="/icons/google.svg"
                  alt="google"
                  width={16}
                  height={16}
                />
              </div>
              Sign in with Google
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;

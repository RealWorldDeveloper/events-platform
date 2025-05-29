"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/authContext";

export default function SignIn() {
  const { handleLogin, loading } = useAuth();
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDelayedLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || delayedLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-gray-900/70 border-gray-800">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-12 h-12 flex items-center justify-center">
                <span className="font-bold text-xl">JV</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to your JV Events account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full h-12 flex items-center bg-white justify-center border-solid border-2  text-md gap-4 border-gray-500 "
              onClick={handleLogin}
            >
              <span>Continue with Google</span>
              <FcGoogle />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full h-12 flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white border-0 hover:text-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                  </svg>
                  <span>Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1A94DA] text-white border-0 hover:text-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M22 5.8a8.49 8.49 0 0 1-2.36.64 4.13 4.13 0 0 0 1.81-2.27 8.21 8.21 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.64 11.64 0 0 1-8.45-4.29 4.16 4.16 0 0 0-.55 2.07 4.09 4.09 0 0 0 1.82 3.41 4.05 4.05 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.3 4 3.93 3.93 0 0 1-1.1.17 4.9 4.9 0 0 1-.77-.07 4.11 4.11 0 0 0 3.83 2.84A8.22 8.22 0 0 1 3 18.34a7.93 7.93 0 0 1-1-.06 11.57 11.57 0 0 0 6.29 1.85A11.59 11.59 0 0 0 20 8.45v-.53a8.43 8.43 0 0 0 2-2.12Z" />
                  </svg>
                  <span>Twitter</span>
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-gray-400">
              By signing in, you agree to our{" "}
              <Link
                href="#"
                className="underline text-purple-400 hover:text-black"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="underline text-purple-400 hover:text-black"
              >
                Privacy Policy
              </Link>
              .
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} JV Events. All rights reserved.
        </div>
      </div>
    </div>
  );
}

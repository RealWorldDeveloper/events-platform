"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "../../hooks/use-toast"
function Admin() {
  const {toast} = useToast();
  const router = useRouter();
const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    pin: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use inputValue directly as the data to send
    const data = inputValue;

    const response = await fetch("/api/auth/admin/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.success) {
      router.push("/admin/dashboard");
      toast({
        title: "Success",
        description: "Access granted",
        variant: "outline",
      });
      setInputValue({
        email: "",
        password: "",
        pin: "",
      });
      
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };
  return (
    <div className="min-h-screen flex flex-col" >
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-gray-900/70 border-gray-800">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-12 h-12 flex items-center justify-center">
                <span className="font-bold text-xl">JV</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Welcome To Admin Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action="submit" onSubmit={handleSubmit} className="space-y-4">
               <Input placeholder="Email" onChange={handleInputChange} name="email" type="text" />
            <Input placeholder="Enter Password" onChange={handleInputChange} name="password" type="password"  />
            <Input placeholder="Organization Pin" onChange={handleInputChange} name="pin" type="password"  />
            <div className="space-y-2">
              <Button
                className="w-full h-12 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 border-0"
                type="submit"
              >
                <span>Access</span>
              </Button>
            </div>
            </form>
           

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-gray-800" />
              </div>
            </div>

            <div className="text-center text-sm text-gray-400">
              By signing in, you agree to our{" "}
              <Link
                href="#"
                className="underline text-purple-400 hover:text-purple-300"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="underline text-purple-400 hover:text-purple-300"
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

export default Admin;

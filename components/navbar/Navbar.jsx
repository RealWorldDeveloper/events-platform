import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, UserRoundCog, Settings, User } from "lucide-react";
import { is } from "date-fns/locale";
function Navbar() {
  const { user,isLoading, handleLogout,setLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg ">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-8 h-8 flex items-center justify-center">
            <span className="font-bold">JV</span>
          </div>
          <span className="font-bold text-xl">Events</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-300 hover:text-white transition-colors"
          >
            {user ? "Dashboard" : ''}
          </Link>
          <Link
            href="#testimonials"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="#contact"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </nav>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={(user && user.image) ? user.image : "/placeholder.svg"}
                    alt={user && user.name ? user.name : "User"}
                    className="h-12 w-12"
                  />
                  <AvatarFallback>{user && user.name ? user.name.charAt(0) : "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-gray-900 border-gray-800 text-white"
              align="end"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem
                className="hover:bg-gray-800 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-12 rounded-full border border-gray-700"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src='/profile-logo.png'
                    alt=""
                  />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-gray-900 border-gray-800 text-white"
              align="end"
            >
              <DropdownMenuLabel>Sign in as</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800" />
              <Link href="/signin" passHref legacyBehavior>
                <DropdownMenuItem as="a" className="hover:bg-gray-800 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Client</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/admin" passHref legacyBehavior>
                <DropdownMenuItem as="a" className="hover:bg-gray-800 cursor-pointer">
                  <UserRoundCog className="mr-2 h-4 w-4" />
                  <span>Admin</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

export default Navbar;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  Heart,
  MapPin,
  Share2,
  Ticket,
  Users,
} from "lucide-react";
import { useToast } from "../../../hooks/use-toast"
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/authContext";

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
 
  
  const { toast } = useToast()
  const { event, user} = useAuth();
  const eventId = params.id;
  const [singleEvent, setSingleEvent] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    // Simulate API loading
    const findEvent = event.find((event) => event._id === params.id);

    
    setSingleEvent(findEvent);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [event, eventId]);


  const handleEventRegister = () => {
    if (!user || !user.id) {
      // Handle unauthenticated user (e.g., redirect to sign in or show a message)
      router.push("/signin");
      return;
    }
    fetch("/api/register-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({eventId:singleEvent._id, userId: user.id }),
    })
      .then((response) => {
        if (!response.ok) {
            toast({
          title: response.message,
        });
        }
        return response.json();
      })
      .then((data) => {
        toast({
          title: data.message,
        });
        
      })
      .catch((error) => {
        // Handle errors (e.g., show an error message)
        console.error("Registration error:", error);
      });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <Button
            variant="outline"
            className="mb-8"
            onClick={() => router.push("/events")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>

          <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="text-gray-400 mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => router.push("/events")}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Browse All Events
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Navbar */}
    <Navbar/>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/events">Events</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-gray-400 max-w-[200px] truncate">
                {singleEvent.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <Button
          variant="outline"
          className="mb-8"
          onClick={() => router.push("/events")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Button>

        {/* Event Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Event Image */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-800">
              <Image src={singleEvent.image || "/placeholder.svg"} alt={singleEvent.title} fill className="object-cover" />
              {singleEvent.featured && (
                <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                  Featured
                </div>
              )}
              {singleEvent.price && (
                <div className="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                  {singleEvent.price}
                </div>
              )}
            </div>
          </div>

          {/* Event Quick Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
              <h1 className="text-2xl font-bold mb-4">{singleEvent.title}</h1>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <span className="font-medium">Date & Time: </span>
                    <span className="text-gray-400"> {singleEvent.date
                        ? new Date(singleEvent.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}</span>
                    <p className="text-gray-400">Start: {singleEvent.startTime}</p>
                    <p className="text-gray-400">End: {singleEvent.endTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-gray-400">{singleEvent.location}</p>
                    {singleEvent.address && (
                      <p className="text-gray-400">{singleEvent.address}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Price</h3>
                    <p className="text-gray-400">
                      £{singleEvent.price || "Free"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Attendees</h3>
                    <p className="text-gray-400">
                      {singleEvent.maxAttendees} people attending
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => handleEventRegister(event)}
                >
                  Register Now
                </Button>

                <div className="grid grid-cols-3 gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-gray-700"
                          onClick={() => setIsLiked(!isLiked)}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              isLiked
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isLiked
                            ? "Remove from favorites"
                            : "Add to favorites"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-gray-700"
                        >
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add to calendar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-gray-700"
                        >
                          <Share2 className="h-5 w-5 text-gray-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share event</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="bg-gray-900 border border-gray-800 mb-6">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Details
            </TabsTrigger>
         
        
          </TabsList>

          <TabsContent value="details" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Event Description */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                  <div className="prose prose-invert max-w-none">
                    <p>
                      {singleEvent.longDescription || singleEvent.description}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm">1</span>
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Networking Opportunities
                        </h3>
                        <p className="text-gray-400">
                          Connect with other attendees and expand your
                          professional network.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm">2</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Interactive Sessions</h3>
                        <p className="text-gray-400">
                          Participate in hands-on activities and collaborative
                          discussions.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm">3</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Expert Insights</h3>
                        <p className="text-gray-400">
                          Learn from industry leaders and gain valuable
                          knowledge.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Location</h2>
                  <div className="aspect-video relative rounded-xl overflow-hidden border border-gray-800">
                    <Image
                      src={"/placeholder.svg"}
                      alt="Event location map"
                      fill
                      sizes="(max-width: 1024px) 100vw, 800px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        variant="outline"
                        className="bg-black/50 border-white/20 backdrop-blur-sm"
                      >
                        <MapPin className="mr-2 h-4 w-4" /> View Map
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Organizer Info */}
                <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">Organizer</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={
                          event.organizer?.image ||
                          "/placeholder.svg?height=40&width=40"
                        }
                      />
                      <AvatarFallback>
                        {event.organizer?.name?.charAt(0) || "O"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {event.organizer?.name || "Event Organizer"}
                      </p>
                      <p className="text-sm text-gray-400">Event Host</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    {event.organizer?.description ||
                      "We organize community events to bring people together and create memorable experiences."}
                  </p>
                  <Button variant="outline" className="w-full border-gray-700">
                    Contact Organizer
                  </Button>
                </div>

                {/* Share */}
                <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">Share This Event</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

      </div>

      {/* Footer */}
      <footer className="bg-black py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="font-bold">JV</span>
              </div>
              <span className="font-bold text-xl">Events</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} JV Events. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

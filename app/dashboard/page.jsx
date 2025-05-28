"use client";
import { useToast } from "../../hooks/use-toast";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CalendarDays,
  Clock,
  LogOut,
  MapPin,
  Plus,
  Settings,
  Trash2,
  User,
  UserRoundCog,
  X,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function Dashboard() {
  const router = useRouter();
  const { user, loading, setLoading, handleLogout } = useAuth();
  const [registrEvent, setRegisterEvent] = useState([]);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("all");
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const dateFormat = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  useEffect(() => {
    if (!user && !loading) {
      router.push("/signin");
    }

    if (user) {
      fetch(`/api/register-event?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setRegisterEvent(data.events || []);
        })
        .catch((err) => {
          console.error("Failed to fetch registered events:", err);
          setRegisterEvent([]);
        });
    }
  }, [user, loading, router]);

  // Handle delete event
  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setShowDeleteDialog(true);
  };

  // Confirm add to calendar
  const handleGoogleCalendar = async (event) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to add events to your Google Calendar.");
      return;
    }
    try {
      const response = await fetch("/api/calender/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          event: event,
          token,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Event Added",
          description:
            "Event has been successfully added to your Google Calendar.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add event to calendar.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding event to calendar:", error);
    }
  };

  // Filter events based on active tab
  const filteredEvents = registrEvent.filter((event) => {
    if (activeTab === "all") return true;
    return event.status === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Navbar */}

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
              href="/events"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Event
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
                      src={user.image || "/placeholder.svg"}
                      alt={user.name}
                      className="h-12 w-12"
                    />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
                  className="relative h-12 w-12 rounded-full"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        "data:image/jpeg;base64,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"
                      }
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
                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <Link href="/signin">
                    <span>Client</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                  <UserRoundCog className="mr-2 h-4 w-4" />
                  <Link href="/admin">
                    <span>Admin</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        {/* User Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-gray-400">
            Manage your registered events and preferences
          </p>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                All Events
              </TabsTrigger>
            </TabsList>

            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => router.push("/events")}
            >
              <Plus className="mr-2 h-4 w-4" /> Find New Events
            </Button>
          </div>

          {/* Events Content */}
          <TabsContent value={activeTab} className="mt-0">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <Card
                    key={event._id}
                    className={`bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-500 transition-all duration-300`}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-48 md:h-auto md:w-1/3 min-w-[120px] min-h-[192px]">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <CardContent className="p-5 flex-1">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <CalendarDays className="h-4 w-4" />
                          <span>{dateFormat.format(new Date(event.date))}</span>
                          <Separator
                            orientation="vertical"
                            className="h-3 mx-1 bg-gray-700"
                          />
                          <Clock className="h-4 w-4" />
                          <span>{event.startTime}</span>
                          <span>- {event.endTime}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-gray-800 text-white border-gray-700 mb-4"
                        >
                          {event.category}
                        </Badge>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-400">
                            Registered on {event.registeredOn}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-700 hover:bg-gray-800"
                              onClick={() => handleGoogleCalendar(event)}
                            >
                              <Calendar className="h-4 w-4 mr-1" /> Calendar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteEvent(event)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">No events found</h3>
                <p className="text-gray-400 mb-6">
                  {activeTab === "upcoming"
                    ? "You haven't registered for any upcoming events yet."
                    : activeTab === "past"
                    ? "You don't have any past events."
                    : activeTab === "canceled"
                    ? "You don't have any canceled events."
                    : "You haven't registered for any events yet."}
                </p>
                <Button
                  onClick={() => router.push("/events")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> Browse Events
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Remove Event</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to remove this event from your registered
              events?
            </DialogDescription>
          </DialogHeader>
          {eventToDelete && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-md overflow-hidden relative flex-shrink-0">
                  <Image
                    src={eventToDelete.image || "/placeholder.svg"}
                    alt={eventToDelete.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{eventToDelete.title}</h4>
                  <p className="text-sm text-gray-400">{eventToDelete.date}</p>
                </div>
              </div>
              <Alert variant="destructive" className="mt-4">
                <X className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This will remove the event from your list. You can register
                  again if you change your mind.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-700"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive">Remove Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-black py-8 border-t border-gray-800 mt-12">
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

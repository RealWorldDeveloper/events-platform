"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Filter,
  MapPin,
  Search,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/authContext";
import Navbar from "@/components/navbar/Navbar";

export default function EventsPage() {
  const router = useRouter();
  const { event } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [allEvents, setAllEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch events and extract categories

  useEffect(() => {
    setTimeout(() => {
      if (Array.isArray(event)) {
        setAllEvents(event);
        setFilteredEvents(event);
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(event.map((event) => event.category))
        ).filter(Boolean);
        setCategories(uniqueCategories);
      } else {
        setAllEvents([]);
        setFilteredEvents([]);
        setCategories([]);
      }
      setLoading(false);
    }, 500);
  }, [event]);

  // Filter events based on search, categories, and tab
  useEffect(() => {
    let events = [...allEvents];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          (event.description && event.description.toLowerCase().includes(query))
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      events = events.filter((event) =>
        selectedCategories.includes(event.category)
      );
    }

    // Filter by tab
    if (activeTab === "featured") {
      events = events.filter((event) => event.isFeatured);
    } else if (activeTab === "upcoming") {
      const now = new Date();
      events = events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now;
      });
    } else if (activeTab === "free") {
      events = events.filter(
        (event) =>
          !event.price ||
          event.price.toLowerCase() === "free" ||
          event.price === "0"
      );
    }

    setFilteredEvents(events);
  }, [searchQuery, selectedCategories, activeTab, allEvents]);

  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setActiveTab("all");
  };

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
      <Navbar />
      {/* Page Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Discover Events
          </h1>
          <p className="text-gray-400">
            Find and join events in your community
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search events, locations, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-700 bg-gray-900 text-white"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Categories
                  {selectedCategories.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-purple-600 text-white"
                    >
                      {selectedCategories.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-white">
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                    className="hover:bg-gray-800"
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters Button */}
            {(searchQuery ||
              selectedCategories.length > 0 ||
              activeTab !== "all") && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-gray-400 hover:text-white"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Selected Categories */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="bg-gray-800 text-white border-gray-700 flex items-center gap-1"
                >
                  {category}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="ml-1 hover:text-gray-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              All Events
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Featured
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="free"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Free
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event._id}
                className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-500 transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 mt-4 rounded-full">
                    {event.category}
                  </div>
                  {event.isFeatured && (
                    <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                  {event.price && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      £{event.price}
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {event.date
                        ? new Date(event.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Date TBA"}
                    </span>
                    <Separator
                      orientation="vertical"
                      className="h-3 mx-1 bg-gray-700"
                    />
                    <Clock className="h-4 w-4" />
                    <span>{event.startTime}</span>
                    <span>- {event.endTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-gray-300">
                        {event.maxAttendees} attending
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => router.push(`/events/${event._id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800">
            <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No events found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-gray-700"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

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

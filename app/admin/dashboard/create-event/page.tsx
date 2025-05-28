"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CalendarIcon, ImagePlus, Info, Loader2, MapPin, Save, X } from "lucide-react"
import { useToast } from "../../../../hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Define event type
type EventFormData = {
  title: string
  description: string
  longDescription: string
  date: Date | undefined
  startTime: string
  endTime: string
  location: string
  address: string
  category: string
  price: string
  isPaid: boolean
  isFeatured: boolean
  maxAttendees: string
  image: string | null
  organizerName: string
  organizerDescription: string
}

// Define form errors type
type FormErrors = {
  [key in keyof EventFormData]?: string
}

export default function CreateEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    longDescription: "",
    date: undefined,
    startTime: "",
    endTime: "",
    location: "",
    address: "",
    category: "",
    price: "0.00",
    isPaid: false,
    isFeatured: false,
    maxAttendees: "",
    image: null,
    organizerName: "",
    organizerDescription: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name as keyof EventFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name as keyof EventFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, date }))

    // Clear error when field is edited
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: undefined }))
    }
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        if (!response.ok) throw new Error("Upload failed")
        const data = await response.json()
        setFormData((prev) => ({ ...prev, image: data.url }))

        // Clear error when field is edited
        if (errors.image) {
          setErrors((prev) => ({ ...prev, image: undefined }))
        }
      } catch (err) {
        console.error("Image upload error:", err)
      }
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Basic info validation
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.startTime) newErrors.startTime = "Start time is required"
    if (!formData.endTime) newErrors.endTime = "End time is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (formData.isPaid && !formData.price) newErrors.price = "Price is required for paid events"
    if (!formData.image) newErrors.image = "Event image is required"

    // Additional info validation
    if (!formData.organizerName.trim()) newErrors.organizerName = "Organizer name is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Find the first tab with errors and switch to it
      if (
        errors.title ||
        errors.description ||
        errors.date ||
        errors.startTime ||
        errors.endTime ||
        errors.location ||
        errors.category ||
        errors.price ||
        errors.image
      ) {
        setActiveTab("basic")
      } else if (errors.organizerName || errors.organizerDescription) {
        setActiveTab("details")
      }
      return
    }

    try {
      const response = await fetch('/api/events/create-event', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        throw new Error("Failed to create event")
      }
      const data = await response.json()
          
      toast({
        title: data.message,
        description: "created by ",
        variant: "default",
      })
     
    } catch (error) {
      console.error("Error creating event:", error)
    } 
  }



  // Toggle preview mode
  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="font-bold">JV</span>
            </div>
            <span className="font-bold text-xl">Events</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/events" className="text-gray-300 hover:text-white transition-colors">
              Events
            </Link>
            <Link href="/admin" className="text-white font-medium transition-colors">
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
            <p className="text-gray-400">Fill in the details to create a new community event</p>
          </div>
          <Button variant="outline" className="border-gray-700" onClick={togglePreview}>
            {previewMode ? "Edit Event" : "Preview Event"}
          </Button>
        </div>

        {previewMode ? (
          // Event Preview
          <div className="mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl">Event Preview</CardTitle>
                <CardDescription className="text-gray-400">This is how your event will appear to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Event Image */}
                  <div className="lg:col-span-2">
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-800">
                      {formData.image ? (
                        <Image
                          src={formData.image || "/placeholder.svg"}
                          alt={formData.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <ImagePlus className="h-16 w-16 text-gray-600" />
                        </div>
                      )}
                      {formData.isFeatured && (
                        <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                      {formData.isPaid && formData.price && (
                        <div className="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                          ${formData.price}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Quick Info */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                      <h1 className="text-2xl font-bold mb-4">{formData.title || "Event Title"}</h1>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                          <CalendarIcon className="h-5 w-5 text-purple-400 mt-0.5" />
                          <div>
                            <h3 className="font-medium">Date & Time</h3>
                            <p className="text-gray-400">
                              {formData.date ? format(formData.date, "MMMM d, yyyy") : "Date not set"}
                            </p>
                            <p className="text-gray-400">
                              {formData.startTime && formData.endTime
                                ? `${formData.startTime} - ${formData.endTime}`
                                : "Time not set"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-purple-400 mt-0.5" />
                          <div>
                            <h3 className="font-medium">Location</h3>
                            <p className="text-gray-400">{formData.location || "Location not set"}</p>
                            {formData.address && <p className="text-gray-400">{formData.address}</p>}
                          </div>
                        </div>

                        {formData.category && (
                          <div className="flex items-center gap-2 mt-4">
                            <Badge variant="outline" className="bg-gray-800 text-white border-gray-700">
                              {formData.category}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          Register Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Description */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                  <div className="prose prose-invert max-w-none">
                    <p>{formData.description || "No description provided."}</p>
                    {formData.longDescription && <p>{formData.longDescription}</p>}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-800 pt-6">
                <Button variant="outline" className="border-gray-700" onClick={togglePreview}>
                  Back to Editing
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Event
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          // Event Creation Form
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-3">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Event Information</CardTitle>
                    <CardDescription className="text-gray-400">Fill in the details about your event</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid grid-cols-2 mb-8 bg-gray-800">
                        <TabsTrigger
                          value="basic"
                          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                        >
                          Basic Info
                        </TabsTrigger>
                        <TabsTrigger
                          value="details"
                          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                        >
                          Details
                        </TabsTrigger>
                      </TabsList>

                      {/* Basic Info Tab */}
                      <TabsContent value="basic" className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title">
                              Event Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="title"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              placeholder="Enter event title"
                              className={cn("bg-gray-800 border-gray-700 mt-1.5", errors.title && "border-red-500")}
                            required
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                          </div>

                          <div>
                            <Label htmlFor="description">
                              Short Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              placeholder="Brief description of your event (max 200 characters)"
                              required
                              className={cn(
                                "bg-gray-800 border-gray-700 mt-1.5 resize-none h-20",
                                errors.description && "border-red-500",
                              )}
                              maxLength={200}
                            />
                            {errors.description ? (
                              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            ) : (
                              <p className="text-gray-500 text-sm mt-1">{formData.description.length}/200 characters</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="longDescription">Full Description</Label>
                            <Textarea
                              id="longDescription"
                              name="longDescription"
                              value={formData.longDescription}
                              onChange={handleInputChange}
                              placeholder="Detailed description of your event"
                              required
                              className="bg-gray-800 border-gray-700 mt-1.5 resize-none h-32"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="date">
                                Event Date <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="date"
                                name="date"
                                type="date"
                                value={formData.date ? (formData.date instanceof Date ? formData.date.toISOString().slice(0, 10) : formData.date) : ""}
                                onChange={e => {
                                  const value = e.target.value;
                                  setFormData(prev => ({
                                    ...prev,
                                    date: value ? new Date(value) : undefined,
                                  }));
                                  if (errors.date) {
                                    setErrors(prev => ({ ...prev, date: undefined }));
                                  }
                                }}
                                className={cn(
                                  "bg-gray-800 border-gray-700 mt-1.5",
                                  errors.date && "border-red-500"
                                )}
                                required
                              />
                              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="startTime">
                                  Start Time <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="startTime"
                                  name="startTime"
                                  type="time"
                                  value={formData.startTime}
                                  onChange={handleInputChange}
                                  required
                                  className={cn(
                                  
                                    "bg-gray-800 border-gray-700 mt-1.5",
                                    errors.startTime && "border-red-500",
                                  )}
                                />
                                {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
                              </div>

                              <div>
                                <Label htmlFor="endTime">
                                  End Time <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="endTime"
                                  name="endTime"
                                  type="time"
                                  value={formData.endTime}
                                  onChange={handleInputChange}
                                  required
                                  className={cn(
                                  
                                    "bg-gray-800 border-gray-700 mt-1.5",
                                    errors.endTime && "border-red-500",
                                  )}
                                />
                                {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="location">
                                Venue Name <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="e.g. City Conference Center"
                                required
                                className={cn(
                                
                                  "bg-gray-800 border-gray-700 mt-1.5",
                                  errors.location && "border-red-500",
                                )}
                              />
                              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                            </div>

                            <div>
                              <Label htmlFor="address">Address</Label>
                              <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                placeholder="Full address of the venue"
                                className="bg-gray-800 border-gray-700 mt-1.5"
                              
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="category">
                                Category <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={formData.category}
                                onValueChange={(value) => handleSelectChange("category", value)}
                              >
                                <SelectTrigger
                                  className={cn(
                                    "bg-gray-800 border-gray-700 mt-1.5",
                                    errors.category && "border-red-500",
                                  )}
                                >
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                  <SelectItem value="Workshop">Workshop</SelectItem >
                                  <SelectItem value="Music">Music</SelectItem>
                                  <SelectItem value="Sports">Sports</SelectItem>
                                  <SelectItem value="Art">Art</SelectItem>
                                  <SelectItem value="Business">Business</SelectItem>
                                  <SelectItem value="Community">Community</SelectItem>
                                  <SelectItem value="Film">Film</SelectItem>
                                  <SelectItem value="Food">Food</SelectItem>
                                  <SelectItem value="Fitness">Fitness</SelectItem>
                                  <SelectItem value="Education">Education</SelectItem>
                                  <SelectItem value="Theater">Theater</SelectItem>
                                  <SelectItem value="Technology">Technology</SelectItem>
                                </SelectContent>
                              </Select>
                              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                            </div>

                            <div>
                              <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                              <Input
                                id="maxAttendees"
                                name="maxAttendees"
                                type="number"
                                min="1"
                                value={formData.maxAttendees}
                                onChange={handleInputChange}
                                required
                                placeholder="Leave blank for unlimited"
                                className="bg-gray-800 border-gray-700 mt-1.5"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="isPaid">Is this a paid event?</Label>
                                <Switch
                                  id="isPaid"
                                  checked={formData.isPaid}
                                  onCheckedChange={(checked) => handleSwitchChange("isPaid", checked)}
                                />
                              </div>
                              {formData.isPaid && (
                                <div className="mt-4">
                                  <Label htmlFor="price">
                                    Price ($) <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 25.00"
                                    className={cn(
                                      "bg-gray-800 border-gray-700 mt-1.5",
                                      errors.price && "border-red-500",
                                    )}
                                  />
                                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <Label htmlFor="isFeatured">Feature this event?</Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center">
                                      <Info className="h-4 w-4 text-gray-400 mr-2" />
                                      <Switch
                                        id="isFeatured"
                                        checked={formData.isFeatured}
                                        onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-900 border-gray-700">
                                    <p>Featured events appear prominently on the homepage</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="image">
                              Event Image <span className="text-red-500">*</span>
                            </Label>
                            <div
                              className={cn(
                                "mt-1.5 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-800/50 transition-colors",
                                errors.image ? "border-red-500" : "border-gray-700",
                                formData.image && "border-purple-500/50",
                              )}
                              onClick={() => fileInputRef.current?.click()}
                            >
                              {formData.image ? (
                                <div className="relative aspect-video w-full max-w-md mx-auto">
                                  <Image
                                    src={formData.image || "/placeholder.svg"}
                                    alt="Event preview"
                                    fill
                                    className="object-cover rounded-md"
                                  />
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setFormData((prev) => ({ ...prev, image: null }))
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="py-8">
                                  <ImagePlus className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                                  <p className="text-gray-400">Click to upload an image</p>
                                  <p className="text-gray-500 text-sm mt-1">Recommended size: 1200 x 600 pixels</p>
                                </div>
                              )}
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                            
                            </div>
                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Details Tab */}
                      <TabsContent value="details" className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Organizer Information</h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="organizerName">
                                Organizer Name <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="organizerName"
                                name="organizerName"
                                value={formData.organizerName}
                                onChange={handleInputChange}
                                placeholder="Name of the organizing person or group"
                                required
                                className={cn(
                                
                                  "bg-gray-800 border-gray-700 mt-1.5",
                                  errors.organizerName && "border-red-500",
                                )}
                              />
                              {errors.organizerName && (
                                <p className="text-red-500 text-sm mt-1">{errors.organizerName}</p>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="organizerDescription">About the Organizer</Label>
                              <Textarea
                                id="organizerDescription"
                                name="organizerDescription"
                                value={formData.organizerDescription}
                                onChange={handleInputChange}
                                placeholder="Brief description of the organizer"
                                required
                                className="bg-gray-800 border-gray-700 mt-1.5 resize-none h-20"
                              />
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-gray-800 my-6" />

                        <div>
                          <h3 className="text-lg font-medium mb-4">Event Settings</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-base">Registration Deadline</Label>
                                <p className="text-sm text-gray-400">
                                  By default, registration closes when the event starts
                                </p>
                              </div>
                              <Button variant="outline" className="border-gray-700">
                                Set Deadline
                              </Button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-base">Event Visibility</Label>
                                <p className="text-sm text-gray-400">Control who can see this event</p>
                              </div>
                              <RadioGroup defaultValue="public" className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="public" id="public" className="border-gray-700" />
                                  <Label htmlFor="public">Public</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="private" id="private" className="border-gray-700" />
                                  <Label htmlFor="private">Private</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-gray-800 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-700"
                      onClick={() => router.push("/events")}
                    >
                      Cancel
                    </Button>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="border-gray-700" onClick={togglePreview}>
                        Preview
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Create Event
                          </>
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Right Column - Help */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle>Tips for Creating Events</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Clear Title</h4>
                        <p className="text-sm text-gray-400">
                          Use a descriptive title that clearly communicates what your event is about.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Detailed Description</h4>
                        <p className="text-sm text-gray-400">
                          Provide all the information attendees need to know, including what to expect and what to
                          bring.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Compelling Image</h4>
                        <p className="text-sm text-gray-400">
                          Upload a high-quality image that represents your event and attracts attention.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Complete Agenda</h4>
                        <p className="text-sm text-gray-400">
                          Break down your event schedule so attendees know what to expect and when.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle>Required Fields</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="text-red-500">*</span>
                          <span className="text-gray-400">Event Title</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-red-500">*</span>
                          <span className="text-gray-400">Description</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-red-500">*</span>
                          <span className="text-gray-400">Date and Time</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-red-500">*</span>
                          <span className="text-gray-400">Location</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-red-500">*</span>
                          <span className="text-gray-400">Category</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-red-500">*</span>
                          <span className="text-gray-400">Event Image</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-red-500">*</span>
                          <span className="text-gray-400">Organizer Name</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Success Dialog */}
      <AlertDialog >
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Event Created Successfully!</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Your event has been created and is now visible to community members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="bg-green-900/30 border border-green-800 text-green-300 rounded-lg p-4 flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Event "{formData.title}" has been created</p>
                <p className="text-sm mt-1">You can now manage this event from your dashboard</p>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Create Another Event
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          
            >
              View All Events
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
   
    </div>
  )
}

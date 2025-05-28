"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast"

export default function UpdateEventModal({ open, onClose, event, onUpdated }) {
  const [formData, setFormData] = useState(event || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  useEffect(() => {
    setFormData(event || {});
    setErrors({});
  }, [event, open]);

  if (!open) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formDataImg = new FormData();
      formDataImg.append("file", file);
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataImg,
        });
        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        setFormData((prev) => ({ ...prev, image: data.url }));
        if (errors.image) setErrors((prev) => ({ ...prev, image: undefined }));
      } catch (err) {
        console.error("Image upload error:", err);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.description?.trim()) newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.location?.trim()) newErrors.location = "Location is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.isPaid && !formData.price) newErrors.price = "Price is required for paid events";
    if (!formData.image) newErrors.image = "Event image is required";
    if (!formData.organizerName?.trim()) newErrors.organizerName = "Organizer name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: event._id }),
      });
      if (!response.ok) throw new Error("Failed to update event");
      onUpdated && onUpdated();
      onClose();
      toast({
        title: "Success",
        description: "Event updated successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-8 w-full max-w-2xl relative overflow-y-auto"
        style={{
          maxHeight: "90vh",
          minHeight: "0",
        }}
      >
        <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={onClose}>
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
            <Input id="title" name="title" value={formData.title || ""} onChange={handleInputChange}
              className={cn("bg-gray-800 border-gray-700 mt-1.5", errors.title && "border-red-500")} required />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <Label htmlFor="description">Short Description <span className="text-red-500">*</span></Label>
            <Textarea id="description" name="description" value={formData.description || ""} onChange={handleInputChange}
              className={cn("bg-gray-800 border-gray-700 mt-1.5 resize-none h-20", errors.description && "border-red-500")} maxLength={200} required />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div>
            <Label htmlFor="longDescription">Full Description</Label>
            <Textarea id="longDescription" name="longDescription" value={formData.longDescription || ""} onChange={handleInputChange}
              className="bg-gray-800 border-gray-700 mt-1.5 resize-none h-32" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Event Date <span className="text-red-500">*</span></Label>
              <Input id="date" name="date" type="date"
                value={formData.date ? (typeof formData.date === "string" ? formData.date.slice(0, 10) : new Date(formData.date).toISOString().slice(0, 10)) : ""}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className={cn("bg-gray-800 border-gray-700 mt-1.5", errors.date && "border-red-500")} required />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time <span className="text-red-500">*</span></Label>
                <Input id="startTime" name="startTime" type="time" value={formData.startTime || ""} onChange={handleInputChange}
                  className={cn("bg-gray-800 border-gray-700 mt-1.5", errors.startTime && "border-red-500")} required />
                {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
              </div>
              <div>
                <Label htmlFor="endTime">End Time <span className="text-red-500">*</span></Label>
                <Input id="endTime" name="endTime" type="time" value={formData.endTime || ""} onChange={handleInputChange}
                  className={cn("bg-gray-800 border-gray-700 mt-1.5", errors.endTime && "border-red-500")} required />
                {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="location">Venue Name <span className="text-red-500">*</span></Label>
            <Input id="location" name="location" value={formData.location || ""} onChange={handleInputChange}
              className={cn("bg-gray-800 border-gray-700 mt-1.5", errors.location && "border-red-500")} required />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
          <div>
            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
            <Select value={formData.category || ""} onValueChange={value => handleSelectChange("category", value)}>
              <SelectTrigger className={cn("bg-gray-800 border-gray-700 mt-1.5", errors.category && "border-red-500")}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="Workshop">Workshop</SelectItem>
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
            <Label htmlFor="image">Event Image <span className="text-red-500">*</span></Label>
            <div className={cn("mt-1.5 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-800/50 transition-colors", errors.image ? "border-red-500" : "border-gray-700", formData.image && "border-purple-500/50")}
              onClick={() => fileInputRef.current?.click()}>
              {formData.image ? (
                <div className="relative aspect-video w-full max-w-md mx-auto">
                  <Image src={formData.image || "/placeholder.svg"} alt="Event preview" fill className="object-cover rounded-md" />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2"
                    onClick={e => { e.stopPropagation(); setFormData(prev => ({ ...prev, image: null })); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="py-8">
                  <span className="text-gray-400">Click to upload an image</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>
          <div>
            <Label htmlFor="organizerName">Organizer Name <span className="text-red-500">*</span></Label>
            <Input id="organizerName" name="organizerName" value={formData.organizerName || ""} onChange={handleInputChange}
              className={cn("bg-gray-800 border-gray-700 mt-1.5", errors.organizerName && "border-red-500")} required />
            {errors.organizerName && <p className="text-red-500 text-sm mt-1">{errors.organizerName}</p>}
          </div>
          <div>
            <Label htmlFor="organizerDescription">About the Organizer</Label>
            <Textarea id="organizerDescription" name="organizerDescription" value={formData.organizerDescription || ""} onChange={handleInputChange}
              className="bg-gray-800 border-gray-700 mt-1.5 resize-none h-20" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isPaid">Is this a paid event?</Label>
            <Switch id="isPaid" checked={!!formData.isPaid} onCheckedChange={checked => handleSwitchChange("isPaid", checked)} />
          </div>
          {formData.isPaid && (
            <div>
              <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
              <Input id="price" name="price" type="number" min="0" step="0.01" value={formData.price || ""} onChange={handleInputChange}
                className={cn("bg-gray-800 border-gray-700 mt-1.5", errors.price && "border-red-500")} />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label htmlFor="isFeatured">Feature this event?</Label>
            <Switch id="isFeatured" checked={!!formData.isFeatured} onCheckedChange={checked => handleSwitchChange("isFeatured", checked)} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" className="border-gray-700" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
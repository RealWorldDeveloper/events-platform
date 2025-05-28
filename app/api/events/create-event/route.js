import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/lib/eventModel";

export async function POST(request) {
  const {
    title,
    description,
    longDescription,
    date,
    startTime,
    endTime,
    location,
    address,
    category,
    price,
    isPaid,
    isFeatured,
    maxAttendees,
    image,
    organizerName,
    organizerDescription
  } = await request.json();

  try {
    await connectDB();
    await Event.findOne({ title }).then(event => {
      if (event) {
        return NextResponse.json({ error: "Event with this title already exists" }, { status: 400 });
      }
    }
    );
    
    const newEvent = new Event({
      title,
      description,
      longDescription,
      date,
      startTime,
      endTime,
      location,
      address,
      category,
      price,
      isPaid,
      isFeatured,
      maxAttendees,
      image: image || null, // Set to null if no image is provided
      organizerName,
      organizerDescription
    });
   
    
    await newEvent.save();

    return NextResponse.json({ message: "Event created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
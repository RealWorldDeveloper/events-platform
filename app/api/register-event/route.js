import { NextResponse } from "next/server";
import EventRegistration from "../../../lib/eventRegisterModel";
import User from "../../../lib/userModel";
import Event from "../../../lib/eventModel";
import connectDB from "../../../lib/mongodb";


export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();
    const { eventId, userId } = body;
        const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    
    
    if (!user || !event) {
      return NextResponse.json({ message: "User or Event not found." }, { status: 404 });
    }

    const existingRegistration = await EventRegistration.findOne({
      userId: user._id,
      eventId: event._id,
    });
    if (existingRegistration) {
      return NextResponse.json({ message: "Already registered for this event." }, { status: 400 });
    }

    const newRegistration = new EventRegistration({
      userId: user._id,
      eventId: event._id,
    });
    await newRegistration.save();
    return NextResponse.json({
      success: true,
      message: "Event registered successfully.",
      registration: newRegistration,
    });
  } catch (error) {
    console.error("Error registering event:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function GET(request) {
  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing userId parameter." }, { status: 400 });
    }

    const registrations = await EventRegistration.find({ userId }).populate("eventId");
    if (!registrations || registrations.length === 0) {
     return NextResponse.json({ success: true, events: [] });
    }

    const events = registrations.map((registration) => registration.eventId);
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("Error fetching registered events:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

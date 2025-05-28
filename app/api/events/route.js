import connectDB from "../../../lib/mongodb";
import Event from "../../../lib/eventModel";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({});
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
//delete
export async function DELETE(request) {
  try {
    await connectDB();
    const { id } = await request.json();
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
// update
export async function PUT(request) {
  try {
    await connectDB();
    const { id, ...formData } = await request.json();
    const updatedEvent = await Event.findByIdAndUpdate(id, formData, { new: true });
    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Event updated successfully", event: updatedEvent });
  }
  catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}
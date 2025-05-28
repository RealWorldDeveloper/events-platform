import mongoose from 'mongoose';


const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  isPaid: { type: Boolean, required: true },
  isFeatured: { type: Boolean, required: true },
  maxAttendees: { type: String, required: true },
  image: { type: String, default: null },
  organizerName: { type: String, required: true },
  organizerDescription: { type: String, required: true }
});

const Event = mongoose.models.event || mongoose.model("event", eventSchema);
module.exports = Event;

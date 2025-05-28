import mongoose from "mongoose";

const EventRegistrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Reference to the User model
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "event",  // Reference to the Event model
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.EventRegistration || mongoose.model("EventRegistration", EventRegistrationSchema);

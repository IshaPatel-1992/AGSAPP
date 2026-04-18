import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  user_email: { type: String, required: true },
  message: { type: String },
  notify_membership: { type: String, default: "No" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Contact", contactSchema);

import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  caption: String,
  imageUrl: { type: String, required: true },  // Cloudinary URL
  public_id: { type: String, required: true }, // For deletion
  folderPath: String, // e.g. "events/Diwali2025"
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Gallery", gallerySchema);

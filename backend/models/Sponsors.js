import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String }, // URL of the sponsor logo
  website: { type: String }, // optional
  description: { type: String }, // optional
  type: {
    type: String,
    enum: ["Title", "Platinum", "Gold", "Silver"],
    default: "Silver",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Sponsor", sponsorSchema);

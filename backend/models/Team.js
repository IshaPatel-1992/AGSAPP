import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  photo: {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  },
  bio: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true  // <-- Automatically adds createdAt and updatedAt
});

export default mongoose.model("Team", TeamSchema,"Team");

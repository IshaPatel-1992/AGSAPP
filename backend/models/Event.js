import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  location: String,
  image: {
    url: String,
    public_id: String
  },
  registrationOpen: Boolean,
  registrationLink: String
});

export default mongoose.model("Events", eventSchema,"Events");

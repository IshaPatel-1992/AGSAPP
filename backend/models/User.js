import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
  type: String,
  startDate: Date,
  endDate: Date,
  status: { type: String, default: "inactive" },
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  picture: String,
  provider: String,
  membership: membershipSchema,
}, { timestamps: true });

const User = mongoose.model("User", userSchema, "Users");
export default User;

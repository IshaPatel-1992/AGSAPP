// services/authService.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Find a user by email or create a new one.
 * @param {Object} param0
 * @param {string} param0.email
 * @param {string} param0.firstName
 * @param {string} param0.lastName
 * @param {string} param0.picture
 * @param {string} param0.provider
 */
export const findOrCreateUser = async ({ email, firstName, lastName, picture, provider }) => {
  try {
    // 1️⃣ Look for existing user
    let user = await User.findOne({ email });

    if (user) {
      console.log("✅ User exists:", user.email);
      return {
        user,
        jwt: generateJWT(user._id, user.email),
        isNew: false,
      };
    }

    // 2️⃣ Create new user if not found
    console.log("ℹ️ Creating new user:", email);

    user = new User({
      firstName,
      lastName,
      email,
      picture,
      provider,
    });

    const savedUser = await user.save(); // ⚠️ must await!

    console.log("✅ New user saved:", savedUser);

    return {
      user: savedUser,
      jwt: generateJWT(savedUser._id, savedUser.email),
      isNew: true,
    };
  } catch (err) {
    console.error("❌ Error in findOrCreateUser:", err);
    throw new Error("Failed to create or find user");
  }
};

/**
 * Generate JWT token for user
 * @param {string} userId
 * @param {string} email
 */
const generateJWT = (userId, email) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

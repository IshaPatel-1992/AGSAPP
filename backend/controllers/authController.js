// controllers/authController.js
import { OAuth2Client } from "google-auth-library";
import { findOrCreateUser } from "../services/authService.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      console.log("❌ No token received in request body");
      return res.status(400).json({ message: "Token missing" });
    }

    console.log("ℹ️ Verifying Google token...");

    // 1️⃣ Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("✅ Google token verified:", payload.email);

    // 2️⃣ Find or create user in DB
    const { user, jwt, isNew } = await findOrCreateUser({
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      picture: payload.picture,
      provider: "google",
    });

    console.log(`ℹ️ User returned: ${user.email}, isNew: ${isNew}`);

    // 3️⃣ Respond to frontend
    res.json({ jwt, user, isNew });
  } catch (err) {
    console.error("❌ Google auth error:", err);

    // Detailed error for debugging
    let message = "Google login failed";

    if (err.response) message += ` | Response: ${JSON.stringify(err.response.data)}`;
    if (err.code) message += ` | Code: ${err.code}`;

    res.status(400).json({ message });
  }
};

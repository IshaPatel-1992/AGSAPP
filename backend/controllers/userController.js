import User from "../models/User.js";

// GET /api/user/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/user/membership
export const updateMembership = async (req, res) => {
  try {
    const { plan, duration } = req.body; // e.g., "Family Membership", 12 (months)
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + duration);

    user.membership = {
      type: plan,
      startDate,
      endDate,
      status: "active",
    };
    await user.save();

    res.json({ message: "Membership updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update membership", error: err.message });
  }
};

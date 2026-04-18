import Sponsor from "../models/Sponsors.js";

// Get all sponsors
export const getSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find().sort({ createdAt: -1 });
    res.status(200).json(sponsors);
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: Create new sponsor
export const createSponsor = async (req, res) => {
  try {
    const { name, logoUrl, website, description, type } = req.body;
    const sponsor = new Sponsor({ name, logoUrl, website, description, type });
    await sponsor.save();
    res.status(201).json(sponsor);
  } catch (error) {
    console.error("Error creating sponsor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import Gallery from "../models/Gallery.js";
import Event from "../models/Event.js";

const router = express.Router();

/* ✅ Upload Photo Route */
router.post("/upload/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: "Event not found" });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `events/${event.title.replace(/\s+/g, "")}${new Date(event.date).getFullYear()}`,
      allowed_formats: ["jpg", "png", "jpeg"],
    },
  });

  const upload = multer({ storage }).single("image");

  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ message: err.message });

    const newPhoto = await Gallery.create({
      event: eventId,
      uploadedBy: req.user?._id || null,
      caption: req.body.caption,
      imageUrl: req.file.path,      // ✅ Cloudinary URL
      public_id: req.file.filename, 
      folderPath: req.file.folder,
    });

    res.status(201).json(newPhoto);
  });
});

/* ✅ ✅ ADD THIS — Fetch all photos */
router.get("/", async (req, res) => {
  try {
    const photos = await Gallery.find()
      .populate("event", "title date")
      .sort({ uploadedAt: -1 });

    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery", error });
  }
});

export default router;

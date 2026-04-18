import express from "express";
import { getSponsors, createSponsor } from "../controllers/sponsorsController.js";

const router = express.Router();

// GET all sponsors
router.get("/", getSponsors);

// POST new sponsor (optional, can restrict to admin)
router.post("/", createSponsor);

export default router;

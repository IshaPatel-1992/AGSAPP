// routes/teamRoutes.js
import express from "express";
import { getAllTeamMembers } from "../controllers/teamController.js";

const router = express.Router();

router.get("/", getAllTeamMembers);

export default router;

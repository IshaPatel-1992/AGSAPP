import express from "express";
import { getUserProfile, updateMembership } from "../controllers/userController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", verifyJWT, getUserProfile);
router.post("/membership", verifyJWT, updateMembership);

export default router;

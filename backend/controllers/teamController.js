import Team from "../models/Team.js";

// GET all team members
export const getAllTeamMembers = async (req, res, next) => {
  try {
    const team = await Team.find().sort({ order: 1 }); // sort by order
    res.status(200).json(team);
  } catch (err) {
    next(err);
  }
};

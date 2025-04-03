import express from "express";
import Profile from "../models/Profile.js";

const router = express.Router();

// Search Profiles
router.post("/search", async (req, res) => {
    try {
        const { community, jobLocation, userGender } = req.body;
        const oppositeGender = userGender === "male" ? "female" : "male";

        const query = { gender: oppositeGender };
        if (community) query.community = { $regex: new RegExp(community, "i") };
        if (jobLocation) query.jobLocation = { $regex: new RegExp(jobLocation, "i") };

        const profiles = await Profile.find(query);
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: "Error searching profiles", error: error.message });
    }
});

// Express Interest
router.post("/interest", async (req, res) => {
    try {
        const { profileId, interest } = req.body;
        // In a real app, you'd store this interest in a separate collection (e.g., Interests)
        // For now, we'll just return a success message
        res.json({ success: true, message: `Interest in profile ${profileId} recorded` });
    } catch (error) {
        res.status(500).json({ message: "Error recording interest", error: error.message });
    }
});

export default router;
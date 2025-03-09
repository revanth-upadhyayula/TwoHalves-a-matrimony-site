import express from "express";
import User from "../models/Profile.js";

const router = express.Router();


router.post("/search", async (req, res) => {
    try {
        const {  community ,job_location, userGender } = req.body;
        const oppositeGender = userGender === "Male" ? "Female" : "Male";
        
        // Build search query with filters
        const query = { gender: oppositeGender };
        if (community) query.community = { $regex: new RegExp(community, "i") };
        if (job_location) query.job_location = { $regex: new RegExp(job_location, "i") };


        const profiles = await User.find(query);
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/interest", async (req, res) => {
    try {
        const { profileId, interest } = req.body;
        // Save the interest action (you may update User model to store this)
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

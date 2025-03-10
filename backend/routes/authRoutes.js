import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import Profile from "../models/Profile.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ User Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, gender, dob, community, job_location, city } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, gender, dob, community, job_location, city });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ User Login (Return Full Profile)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        const profile = await Profile.findOne({ userId: user._id });
        // ✅ Send the full user profile
        res.status(200).json({ token, user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            gender: profile.gender} });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;

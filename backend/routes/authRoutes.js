// authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import Profile from "../models/Profile.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();



const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Authorization token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};



// User Signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword
        });
        await newUser.save();

        // Generate a JWT token for the user (to link to profile registration)
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({
            message: "User signed up successfully",
            userId: newUser._id,
            token
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// User Registration (Profile Creation)
router.post('/register', async (req, res) => {
    try {
        const {
            personalInfo,
            aboutMe,
            educationCareer,
            familyBackground,
            lifestyle,
            partnerPreferences,
            contactInfo,
            userId // We'll pass the userId from the signup response
        } = req.body;

        // Validate that userId is provided
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if profile already exists for this user
        const existingProfile = await Profile.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists for this user" });
        }

        // Create a profile for the user
        const newProfile = new Profile({
            userId: user._id,
            personalInfo,
            aboutMe,
            educationCareer,
            familyBackground,
            lifestyle,
            partnerPreferences,
            contactInfo
        });

        // Log the profile data for debugging
        // console.log('New Profile:', newProfile);

        await newProfile.save();

        res.status(201).json({ message: "Profile created successfully" });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// User Login (Return Full Profile)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const profile = await Profile.findOne({ userId: user._id });
        if (!profile) return res.status(404).json({ message: "Profile not found" });

        res.status(200).json({
            token,
            user: {
                _id: profile._id,
                name: profile.personalInfo.fullName,
                email: profile.contactInfo.email,
                gender: profile.personalInfo.gender
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



// Fetch User Profile (New Endpoint)
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId; // Retrieved from the JWT token
        const profile = await Profile.findOne({ userId }).populate('userId', 'email');
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({
            message: "Profile retrieved successfully",
            profile: {
                userId: profile.userId._id,
                email: profile.userId.email,
                personalInfo: profile.personalInfo,
                aboutMe: profile.aboutMe,
                educationCareer: profile.educationCareer,
                familyBackground: profile.familyBackground,
                lifestyle: profile.lifestyle,
                partnerPreferences: profile.partnerPreferences,
                contactInfo: profile.contactInfo,
                createdAt: profile.createdAt
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



// Update User Profile
router.put('/update-profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId; // Retrieved from the JWT token
        const {
            personalInfo,
            aboutMe,
            educationCareer,
            familyBackground,
            lifestyle,
            partnerPreferences,
            contactInfo
        } = req.body;

        // Find the existing profile
        const profile = await Profile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Update the profile fields
        profile.personalInfo = { ...profile.personalInfo, ...personalInfo };
        profile.aboutMe = { ...profile.aboutMe, ...aboutMe };
        profile.educationCareer = { ...profile.educationCareer, ...educationCareer };
        profile.familyBackground = { ...profile.familyBackground, ...familyBackground };
        profile.lifestyle = { ...profile.lifestyle, ...lifestyle };
        profile.partnerPreferences = { ...profile.partnerPreferences, ...partnerPreferences };
        profile.contactInfo = { ...profile.contactInfo, ...contactInfo };

        await profile.save();

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


export default router;
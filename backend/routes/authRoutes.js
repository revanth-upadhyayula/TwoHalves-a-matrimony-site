// authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import Profile from "../models/Profile.js";
import dotenv from "dotenv";
import authMiddleware from "../middleware/auth.js";

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
router.post('/register', authMiddleware, async (req, res) => {
    try {
        const {
            userId,
            personalInfo,
            aboutMe,
            educationCareer,
            familyBackground,
            lifestyle,
            partnerPreferences,
            contactInfo
        } = req.body;

        // Basic validation for required fields
        if (
            !userId ||
            !personalInfo?.fullName ||
            !personalInfo?.age ||
            !personalInfo?.dob ||
            !personalInfo?.gender ||
            !personalInfo?.height ||
            !personalInfo?.maritalStatus ||
            !personalInfo?.location ||
            !educationCareer?.education ||
            !educationCareer?.profession ||
            !contactInfo?.email ||
            !contactInfo?.phone
        ) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Check if a profile already exists for this user
        const existingProfile = await Profile.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists for this user' });
        }

        // Create a new profile
        const profile = new Profile({
            userId,
            personalInfo,
            aboutMe,
            educationCareer,
            familyBackground,
            lifestyle,
            partnerPreferences,
            contactInfo
        });

        // Save the profile to the database
        await profile.save();

        res.status(201).json({ message: 'Profile created successfully', profile });
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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



// Get the user's profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from the JWT token by authMiddleware
        const profile = await Profile.findOne({ userId });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ profile });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



// Update the user's profile
router.put('/update-profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from the JWT token by authMiddleware
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
        let profile = await Profile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Update the profile fields
        profile.personalInfo = { ...profile.personalInfo, ...personalInfo };
        profile.aboutMe = { ...profile.aboutMe, ...aboutMe };
        profile.educationCareer = { ...profile.educationCareer, ...educationCareer };
        profile.familyBackground = { ...profile.familyBackground, ...familyBackground };
        profile.lifestyle = { ...profile.lifestyle, ...lifestyle };
        profile.partnerPreferences = { ...profile.partnerPreferences, ...partnerPreferences };
        profile.contactInfo = { ...profile.contactInfo, ...contactInfo };

        // Save the updated profile
        await profile.save();

        res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


export default router;
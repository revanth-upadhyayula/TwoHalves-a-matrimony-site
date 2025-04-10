import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import Profile from "../models/Profile.js";
import dotenv from "dotenv";
import authMiddleware from "../middleware/auth.js";

dotenv.config();

const router = express.Router();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Authorization token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; // Store user info in req.user
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

// User Signup (Create User Account)
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

        // Generate a JWT token
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

// User Registration (Create Profile)
router.post('/register', authenticateToken, async (req, res) => {
    try {
        const {
            personalInfo, // Maps to modal IDs: efull-name, eage, edob, egender, eheight, emarital-status, elocation, ehometown, ecommunity
            aboutMe,     // Maps to modal IDs: eabout, elanguages, einterests
            educationCareer, // Maps to modal IDs: eeducation, euniversity, efieldOfStudy, eprofession, ecompany, ecurrentJob, eachievements, ecareerGoals
            familyBackground, // Maps to modal IDs: efamily-type, esiblings, efather-occupation, emother-occupation, efamily-values, efamily-location, efamily-background
            lifestyle,   // Maps to modal IDs: ediet, edrinking, esmoking, efitness, emusic, emovies, etravel, ebooks
            partnerPreferences, // Maps to modal IDs: epref-age-range, epref-height-range, epref-education, epref-occupation, epref-locations, epref-marital-status, epartner-preferences
            contactInfo, // Maps to modal IDs: eemail, ephone
            password     // Optional password for initial profile creation with user
        } = req.body;
        const userId = req.user.id;

        // Basic validation for required fields
        if (
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
            return res.status(400).json({ message: 'All required personal and career fields must be provided' });
        }

        // Age validation
        if (personalInfo.age < 18 || personalInfo.age > 100) {
            return res.status(400).json({ message: 'Age must be between 18 and 100' });
        }

        // Email validation
        if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if a profile already exists for this user
        const existingProfile = await Profile.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists for this user' });
        }

        // Update user password if provided (for initial registration)
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.findByIdAndUpdate(userId, { password: hashedPassword });
        }

        // Create a new profile
        const profile = new Profile({
            userId,
            personalInfo,
            aboutMe: aboutMe || {},
            educationCareer,
            familyBackground,
            lifestyle: lifestyle || {},
            partnerPreferences: partnerPreferences || {},
            contactInfo
        });

        // Save the profile to the database
        await profile.save();

        // Associate profile with user (optional, depending on your schema)
        await User.findByIdAndUpdate(userId, { profile: profile._id });

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
                _id: user._id,
                name: profile.personalInfo.fullName,
                email: profile.contactInfo.email,
                gender: profile.personalInfo.gender
            },
            profile
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get the user's profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await Profile.findOne({ userId }).populate('userId', 'email');

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Ensure all fields are present with defaults
        const responseProfile = {
            personalInfo: {
                fullName: profile.personalInfo.fullName,
                age: profile.personalInfo.age,
                dob: profile.personalInfo.dob,
                gender: profile.personalInfo.gender,
                height: profile.personalInfo.height,
                maritalStatus: profile.personalInfo.maritalStatus,
                community: profile.personalInfo.community || '',
                location: profile.personalInfo.location,
                hometown: profile.personalInfo.hometown
            },
            aboutMe: {
                about: profile.aboutMe.about || '',
                languages: profile.aboutMe.languages || [],
                interests: profile.aboutMe.interests || []
            },
            educationCareer: {
                education: profile.educationCareer.education,
                university: profile.educationCareer.university,
                fieldOfStudy: profile.educationCareer.fieldOfStudy || '',
                profession: profile.educationCareer.profession,
                company: profile.educationCareer.company || '',
                currentJob: profile.educationCareer.currentJob || '',
                achievements: profile.educationCareer.achievements || '',
                careerGoals: profile.educationCareer.careerGoals || ''
            },
            familyBackground: {
                familyType: profile.familyBackground.familyType,
                siblings: profile.familyBackground.siblings,
                fatherOccupation: profile.familyBackground.fatherOccupation,
                motherOccupation: profile.familyBackground.motherOccupation,
                familyValues: profile.familyBackground.familyValues || '',
                familyLocation: profile.familyBackground.familyLocation || '',
                familyBackground: profile.familyBackground.familyBackground || ''
            },
            lifestyle: {
                diet: profile.lifestyle.diet,
                drinking: profile.lifestyle.drinking,
                smoking: profile.lifestyle.smoking,
                fitness: profile.lifestyle.fitness || '',
                music: profile.lifestyle.music || '',
                movies: profile.lifestyle.movies || '',
                travel: profile.lifestyle.travel || '',
                books: profile.lifestyle.books || ''
            },
            partnerPreferences: {
                ageRange: profile.partnerPreferences.ageRange || '',
                heightRange: profile.partnerPreferences.heightRange || '',
                education: profile.partnerPreferences.education || [],
                occupation: profile.partnerPreferences.occupation || [],
                locations: profile.partnerPreferences.locations || [],
                maritalStatus: profile.partnerPreferences.maritalStatus || '',
                preferences: profile.partnerPreferences.preferences || ''
            },
            contactInfo: {
                email: profile.contactInfo.email,
                phone: profile.contactInfo.phone
            },
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt
        };

        res.status(200).json({ profile: responseProfile });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
// Update the user's profile
router.put('/update-profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
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

        // Update the profile fields with new values, preserving existing ones if not provided
        profile.personalInfo = { ...profile.personalInfo, ...personalInfo };
        profile.aboutMe = { ...profile.aboutMe, ...aboutMe };
        profile.educationCareer = { ...profile.educationCareer, ...educationCareer };
        profile.familyBackground = { ...profile.familyBackground, ...familyBackground };
        profile.lifestyle = { ...profile.lifestyle, ...lifestyle };
        profile.partnerPreferences = { ...profile.partnerPreferences, ...partnerPreferences };
        profile.contactInfo = { ...profile.contactInfo, ...contactInfo };
        profile.updatedAt = Date.now();

        // Save the updated profile
        await profile.save();

        res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
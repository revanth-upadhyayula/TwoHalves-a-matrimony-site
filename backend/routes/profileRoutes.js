import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";
import Profile from "../models/Profile.js";

const router = express.Router();

// ✅ Multer Storage for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// ✅ Save or Update Profile (Authenticated User)
router.post("/", authMiddleware, upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "additional_photos", maxCount: 5 }
]), async (req, res) => {
    try {
        const userId = req.user.id; // ✅ Get User ID from JWT Token

        const profileData = {
            userId,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender,
            city: req.body.city,
            dob: req.body.dob,
            height: req.body.height,
            weight: req.body.weight,
            father_name: req.body.father_name,
            mother_name: req.body.mother_name,
            community: req.body.community,
            address: req.body.address,
            company: req.body.company,
            position: req.body.position,
            salary: req.body.salary,
            job_location: req.body.job_location,
            instagram: req.body.instagram,
            linkedin: req.body.linkedin,
            facebook: req.body.facebook,
            youtube: req.body.youtube,
            profilePhoto: req.files["profile_photo"] ? req.files["profile_photo"][0].path : null,
            additionalPhotos: req.files["additional_photos"] ? req.files["additional_photos"].map(file => file.path) : []
        };

        let profile = await Profile.findOne({ userId });

        if (profile) {
            // ✅ Update existing profile
            profile = await Profile.findOneAndUpdate({ userId }, { $set: profileData }, { new: true });
            return res.status(200).json({ message: "Profile updated successfully!", profile });
        }

        // ✅ Create new profile if it doesn't exist
        profile = new Profile(profileData);
        await profile.save();
        res.status(201).json({ message: "Profile created successfully!", profile });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Get Profile Data (Authenticated User)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // ✅ Get User ID from JWT Token
        const profile = await Profile.findOne({ userId });

        if (!profile) return res.status(404).json({ message: "Profile not found" });

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

export default router;

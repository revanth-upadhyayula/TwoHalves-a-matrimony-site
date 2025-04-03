// // routes/profileRoutes.js
// import { Router } from 'express';
// const router = Router();
// import User from '../models/Users.js';
// import Profile from '../models/Profile.js';

// router.post('/register', async (req, res) => {
//     try {
//         const formData = req.body;
//         console.log('Received formData:', formData);
//         // Basic validation
//         if (
//             !formData.personalInfo?.fullName ||
//             !formData.personalInfo?.age ||
//             !formData.contactInfo?.email
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Required fields are missing',
//             });
//         }

//         // Check if user already exists
//         const existingUser = await findOne({
//             email: formData.contactInfo.email,
//         });

//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email already registered',
//             });
//         }

//         // Create new user (minimal data for authentication)
//         const newUser = new User({
//             email: formData.contactInfo.email,
//             password: 'defaultPassword', // In production, hash the password
//         });
//         await newUser.save();

//         // Create new profile
//         const newProfile = new Profile({
//             user: newUser._id, // Link to the user
//             personalInfo: formData.personalInfo,
//             aboutMe: formData.aboutMe,
//             educationCareer: formData.educationCareer,
//             familyBackground: formData.familyBackground,
//             lifestyle: formData.lifestyle,
//             partnerPreferences: formData.partnerPreferences,
//             contactInfo: formData.contactInfo,
//         });
//         await newProfile.save();

//         // Update user with profile reference
//         newUser.profile = newProfile._id;
//         await newUser.save();

//         res.status(201).json({
//             success: true,
//             message: 'Profile created successfully',
//             data: {
//                 userId: newUser._id,
//                 profileId: newProfile._id,
//                 email: newUser.email,
//             },
//         });
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error occurred',
//             error: error.message,
//         });
//     }
// });

// // Get user profile by email
// router.get('/user/:email', async (req, res) => {
//     try {
//         const user = await findOne({ email: req.params.email }).populate('profile');

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found',
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: user,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Server error occurred',
//             error: error.message,
//         });
//     }
// });

// export default router;
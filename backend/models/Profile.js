// models/Profile.js
import { Schema, model } from 'mongoose';

const profileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    personalInfo: {
        fullName: { type: String, required: true },
        age: { type: String, required: true },
        dob: { type: Date, required: true },
        gender: { type: String, required: true },
        height: { type: String, required: true },
        maritalStatus: { type: String, required: true },
        location: { type: String, required: true },
        hometown: String,
    },
    aboutMe: {
        about: String,
        languages: [String],
        interests: [String],
    },
    educationCareer: {
        education: { type: String, required: true },
        university: String,
        profession: { type: String, required: true },
        company: String,
    },
    familyBackground: {
        familyType: String,
        siblings: String,
        fatherOccupation: String,
        motherOccupation: String,
        familyValues: String,
        familyBackground: String,
    },
    lifestyle: {
        diet: String,
        drinking: String,
        smoking: String,
        fitness: String,
    },
    partnerPreferences: {
        ageRange: String,
        heightRange: String,
        education: [String],
        occupation: [String],
        preferences: String,
    },
    contactInfo: {
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now },
});

export default model('Profile', profileSchema);
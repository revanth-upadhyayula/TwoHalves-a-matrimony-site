// models/Profile.js
import { Schema, model } from 'mongoose';

const profileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personalInfo: {
        fullName: { type: String, required: true },
        age: { type: Number, required: true },
        dob: { type: String, required: true },
        gender: { type: String, required: true },
        height: { type: String, required: true },
        maritalStatus: { type: String, required: true },
        community: { type: String }, // New field
        location: { type: String, required: true },
        hometown: { type: String }
    },
    aboutMe: {
        about: { type: String },
        languages: [{ type: String }],
        interests: [{ type: String }]
    },
    educationCareer: {
        education: { type: String, required: true },
        university: { type: String },
        fieldOfStudy: { type: String }, // New field
        profession: { type: String, required: true },
        company: { type: String }
    },
    familyBackground: {
        familyType: { type: String },
        siblings: { type: Number },
        fatherOccupation: { type: String },
        motherOccupation: { type: String },
        familyValues: { type: String },
        familyLocation: { type: String }, // New field
        familyBackground: { type: String }
    },
    lifestyle: {
        diet: { type: String },
        drinking: { type: String },
        smoking: { type: String },
        fitness: { type: String },
        music: { type: String }, // New field
        movies: { type: String }, // New field
        travel: { type: String }, // New field
        books: { type: String } // New field
    },
    partnerPreferences: {
        ageRange: { type: String },
        heightRange: { type: String },
        education: [{ type: String }],
        occupation: [{ type: String }],
        locations: [{ type: String }], // New field
        maritalStatus: { type: String }, // New field
        preferences: { type: String }
    },
    contactInfo: {
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model('Profile', profileSchema);
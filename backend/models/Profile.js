import { Schema, model } from 'mongoose';

const profileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  personalInfo: {
    fullName: { type: String, required: true },
    age: { type: Number, required: true, min: 18, max: 100 },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    height: { type: String, required: true },
    maritalStatus: { type: String, enum: ['never-married', 'divorced', 'widowed'], required: true },
    community: { type: String },
    location: { type: String, required: true },
    hometown: { type: String, required: true }
  },
  aboutMe: {
    about: { type: String },
    languages: [{ type: String }],
    interests: [{ type: String }]
  },
  educationCareer: {
    education: { type: String, required: true },
    university: { type: String, required: true },
    fieldOfStudy: { type: String },
    profession: { type: String, required: true },
    company: { type: String },
    currentJob: { type: String },
    achievements: { type: String },
    careerGoals: { type: String }
  },
  familyBackground: {
    familyType: { type: String, required: true },
    siblings: { type: Number, default: 0 },
    fatherOccupation: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    familyValues: { type: String },
    familyLocation: { type: String },
    familyBackground: { type: String }
  },
  lifestyle: {
    diet: { type: String, enum: ['vegetarian', 'non-vegetarian', 'vegan'], required: true },
    drinking: { type: String, enum: ['never', 'occasionally', 'regularly'], required: true },
    smoking: { type: String, enum: ['non-smoker', 'occasional', 'regular'], required: true },
    fitness: { type: String },
    music: { type: String },
    movies: { type: String },
    travel: { type: String },
    books: { type: String }
  },
  partnerPreferences: {
    ageRange: { type: String },
    heightRange: { type: String },
    education: [{ type: String }],
    occupation: [{ type: String }],
    locations: [{ type: String }],
    maritalStatus: { type: String },
    preferences: { type: String }
  },
  contactInfo: {
    email: { type: String, required: true, match: /\S+@\S+\.\S+/ },
    phone: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default model('Profile', profileSchema);
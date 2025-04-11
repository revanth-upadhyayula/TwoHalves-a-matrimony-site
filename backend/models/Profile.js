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
    community: { type: String, default: '' },
    location: { type: String, required: true },
    hometown: { type: String, required: true }
  },
  aboutMe: {
    about: { type: String, default: '' },
    languages: [{ type: String, default: [] }],
    interests: [{ type: String, default: [] }]
  },
  educationCareer: {
    education: { type: String, required: true },
    university: { type: String, required: true },
    fieldOfStudy: { type: String, default: '' },
    profession: { type: String, required: true },
    company: { type: String, default: '' },
    currentJob: { type: String, default: '' },
    achievements: { type: String, default: '' },
    careerGoals: { type: String, default: '' }
  },
  familyBackground: {
    familyType: { type: String, required: true },
    siblings: { type: Number, default: 0 },
    fatherOccupation: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    familyValues: { type: String, default: '' },
    familyLocation: { type: String, default: '' },
    familyBackground: { type: String, default: '' }
  },
  lifestyle: {
    diet: { type: String, enum: ['vegetarian', 'non-vegetarian', 'vegan'], required: true },
    drinking: { type: String, enum: ['never', 'occasionally', 'regularly'], required: true },
    smoking: { type: String, enum: ['non-smoker', 'occasional', 'regular'], required: true },
    fitness: { type: String, default: '' },
    music: { type: String, default: '' },
    movies: { type: String, default: '' },
    travel: { type: String, default: '' },
    books: { type: String, default: '' }
  },
  partnerPreferences: {
    ageRange: { type: String, default: '' },
    heightRange: { type: String, default: '' },
    education: [{ type: String, default: [] }],
    occupation: [{ type: String, default: [] }],
    locations: [{ type: String, default: [] }],
    maritalStatus: { type: String, default: '' },
    preferences: { type: String, default: '' }
  },
  contactInfo: {
    email: { type: String, required: true, match: /\S+@\S+\.\S+/ },
    phone: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default model('Profile', profileSchema);
import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    email: String,
    phone: String,
    gender: String,
    city: String,
    dob: Date,
    height: String,
    weight: String,
    father_name: String,
    mother_name: String,
    community: String,
    address: String,
    company: String,
    position: String,
    salary: String,
    job_location: String,
    instagram: String,
    linkedin: String,
    facebook: String,
    youtube: String,
    profilePhoto: String,
    additionalPhotos: [String]
}, { timestamps: true });

export default mongoose.model("Profile", ProfileSchema);

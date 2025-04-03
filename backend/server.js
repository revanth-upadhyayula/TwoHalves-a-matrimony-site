import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"; // Import authentication routes
// import profileRoutes from "./routes/profileRoutes.js"; // Import profile routes
import searchRoutes from "./routes/searchRoutes.js"; // Import search routes

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({ 
    origin: 'http://127.0.0.1:5500', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);     // Authentication Routes
// app.use("/api/profile", profileRoutes); // Profile Routes
app.use("/api", searchRoutes); // Search Routes

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

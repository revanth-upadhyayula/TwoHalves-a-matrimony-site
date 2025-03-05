import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import jwt from 'jsonwebtoken'; // ✅ Import JWT
import User from './models/Users.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS
app.use(cors({ 
    origin: 'http://127.0.0.1:5500', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// ✅ User Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Save user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ✅ User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // ✅ Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // ✅ Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

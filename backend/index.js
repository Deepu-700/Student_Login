const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// ================= SCHEMA =================
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    course: { type: String },
    password: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);


// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));


// ================= JWT MIDDLEWARE =================
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};


// ================= ROUTES =================

// 🔹 REGISTER
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, course } = req.body;

        const existingUser = await Student.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({
            name,
            email,
            password: hashedPassword,
            course
        });

        await student.save();

        res.status(201).json({ message: "Student registered successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 LOGIN
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: student._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            student
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 DASHBOARD (PROTECTED)
app.get('/api/dashboard', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select("-password");
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 UPDATE PASSWORD
app.put('/api/update-password', authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const student = await Student.findById(req.user.id);

        const isMatch = await bcrypt.compare(oldPassword, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong old password" });
        }

        student.password = await bcrypt.hash(newPassword, 10);
        await student.save();

        res.json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 UPDATE COURSE
app.put('/api/update-course', authMiddleware, async (req, res) => {
    try {
        const { course } = req.body;

        const student = await Student.findByIdAndUpdate(
            req.user.id,
            { course },
            { new: true }
        );

        res.json({
            message: "Course updated successfully",
            student
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ================= SERVER =================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
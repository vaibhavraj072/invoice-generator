const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Invoice = require("./models/Invoice");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/invoiceDB"; // Use default if not provided

async function connectDB() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,  // 30 seconds (prevents connection timeout)
            socketTimeoutMS: 45000, // 45 seconds (prevents operation timeout)
        });

        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1); // Exit if DB connection fails
    }
}

// Connect to DB before handling requests
connectDB();

// Generate Invoice API
app.post("/api/generate-invoice", async (req, res) => {
    try {
        console.log("✅ Incoming Request:", req.body);

        const { companyName, billedTo, items } = req.body;
        if (!companyName || !billedTo || !items || items.length === 0) {
            return res.status(400).json({ message: "❌ Missing required fields" });
        }

        const invoice = new Invoice(req.body);
        await invoice.save();

        res.json({ message: "✅ Invoice generated", invoice });
    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ message: "❌ Server error", error: error.message });
    }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

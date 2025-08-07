const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "https://family-cookbook-frontend-g6of15ap7-jake-fuhrimans-projects.vercel.app",
          "https://family-cookbook-frontend.vercel.app",
        ]
      : ["http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    console.log("🔗 Connecting to MongoDB Atlas...");

    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://jnfuhriman:EiYOxjgQf9CFqU3H@cluster0.t69m3qm.mongodb.net/family-cookbook?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("✅ Successfully connected to MongoDB Atlas");
    console.log(`🌐 Database: ${mongoose.connection.name}`);
    console.log(`🏠 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Atlas connection error:", error);
    console.error("💡 Please check your connection string and network access");
    process.exit(1);
  }
};

// Connection event listeners
mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB Atlas disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB Atlas reconnected");
});

// Connect to database
connectDB();

// Import routes
const recipeRoutes = require("./routes/recipes");
const adminRoutes = require("./routes/admin");

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Family Cookbook API is running!",
    database:
      mongoose.connection.readyState === 1
        ? "Connected to Atlas"
        : "Disconnected",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Use recipe routes
app.use("/api/recipes", recipeRoutes);

// Use admin routes
app.use("/api/admin", adminRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

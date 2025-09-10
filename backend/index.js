require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

// models
const User = require("./models/User");

// routes
const authRoutes = require("./routes/auth");
const questionRoutes = require("./routes/questions");
const rewardsRoutes = require("./routes/rewards"); // bila ada
const redemptionsRoutes = require("./routes/redemptions"); // bila ada
const customQuestionRoutes = require("./routes/customQuestions"); // ✅ custom soal
const adminSummaryRoutes = require("./routes/adminSummary"); // bila ada
const customQuestionStatsRoutes = require("./routes/customQuestionStats"); // bila ada
const usersRoutes = require("./routes/users");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// register routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/redemptions", redemptionsRoutes);
app.use("/api/custom-questions", customQuestionRoutes);
app.use("/api/admin/summary", adminSummaryRoutes);
app.use("/api/admin/custom-question-stats", customQuestionStatsRoutes);
app.use("/api/users", usersRoutes);

// default route
app.get("/", (_, res) => res.send("API OK"));

// MongoDB connection + seed admin
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    // seed akun admin
    const adminEmail = "mathematic@mood.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin1!", 10);
      const adminUser = new User({
        fullName: "Admin MOOD",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      });
      await adminUser.save();
      console.log("✅ Admin created:", adminEmail);
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));

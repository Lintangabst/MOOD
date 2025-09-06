require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const questionRoutes = require("./routes/questions");

const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);


mongoose
.connect(process.env.MONGO_URI)
.then(async () => {
  // 🔥 Tambahkan admin jika belum ada
  const adminEmail = "mathematic@mood.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin1!", 10);
    const adminUser = new User({
      fullName: "Admin MOOD",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isVerified: true
    });
    await adminUser.save();
    console.log("✅ Admin account created.");
  }

  app.listen(5000, () => console.log("Server running on port 5000"));
})
.catch((err) => console.log(err));
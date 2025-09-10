const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // ambil token dari header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    // verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // cari user dari database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // simpan user ke request agar bisa diakses di route
    req.user = user;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = auth;

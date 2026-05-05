const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");

//Regiter (POST)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Generate a salt
  const salt = await bcrypt.genSalt(10);

  //Hash the password
  const hashedPassword = await bcrypt.hash(password, salt);

  //3.Save the new user with the Hashed password
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();
  res.status(201).json({ message: "User registered successfully" });
});

//Login (POST)
router.post("/login", async (req, res) => {
  try {
    // 1. Find user
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    // 2. Compare incoming password with stored hash
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    // 3. Create token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 4. Send back token AND user info (excluding password)
    res
      .status(200)
      .header("Authorization", token)
      .json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (err) {
    console.log(err);
    // Fixed a small typo: err.message instead of err.messgae
    res.status(500).send("Server error: " + err.message);
  }
});
//Profile (Get)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("Auth Header:", req.header("Authorization"));

    const token = req.header("Authorization")?.split("")[1];
    if (!token) return res.status(401).send("No token provided");

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified._id).select("-password");

    res.json(user);
  } catch (err) {
    console.log("JWT Error:", err.message)
    res.status(400).send("Invalid Token");
  }
});

module.exports = router;

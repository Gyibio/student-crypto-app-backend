require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://student-crypto-demo-app.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }),
);
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/crypto", require("./routes/crypto"));

// Basic Route
app.get("/", (req, res) => {
  res.send("Crypto Backend API is live!");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server is running: http://localhost:5000");
    });
  })
  .catch((err) => console.log(err));

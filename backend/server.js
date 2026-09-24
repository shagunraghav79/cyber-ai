const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const gemini = require("./config/gemini");
const scannerRoutes = require("./routes/url");
const app = express();
app.use(cors({
  origin: "https://cyber-ai-inky.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/api/url", scannerRoutes);
app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await gemini.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: question,
    });

    res.json({
      answer: response.text,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGODB;

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

startServer();

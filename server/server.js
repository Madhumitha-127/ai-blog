import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ROUTES
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blog.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();

const app = express();

/* 🔴 MIDDLEWARE (ORDER MATTERS) */
app.use(cors());
app.use(express.json());

/* 🔴 DATABASE CONNECTION */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

/* 🔴 ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/ai", aiRoutes);

/* 🔴 TEST ROUTE */
app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


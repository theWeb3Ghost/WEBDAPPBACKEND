import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";


// Load environment variables
dotenv.config();

// Connect to database
connectDB();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import tokenRoutes from "./routes/token.js";
 

// Add the /api prefix so frontend matches backend
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/token", tokenRoutes);

// ================================
// START SERVER
// ================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
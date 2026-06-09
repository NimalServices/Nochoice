const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
// const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const path = require("path");

console.log("Current directory:", process.cwd());
console.log("Env path:", path.resolve(".env"));

if (!process.env.JWT_SECRET) {
  console.error("Environment error: JWT_SECRET is required.");
  process.exit(1);
}

connectDB();

const app = express();

app.use(cors({
  origin: "https://carryz.online",
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/carriers", require("./routes/carrierRoutes"));
app.use("/api/travels", require("./routes/carrierTravelRoutes"));
app.use("/api/records", require("./routes/deliveryRecordRoutes"));

app.use("/api/admin",require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
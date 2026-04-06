const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/carriers", require("./routes/carrierRoutes"));
app.use("/api/travels", require("./routes/carrierTravelRoutes"));
app.use("/api/records", require("./routes/deliveryRecordRoutes"));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
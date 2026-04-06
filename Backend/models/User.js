const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    nic: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "carrier", "customer"],
      default: "customer"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
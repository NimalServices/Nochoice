const mongoose = require("mongoose");

const carrierSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    nic: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ["university_traveler", "usual_traveler"],
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    joinedDate: {
      type: Date,
      default: Date.now
    },
    approved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Carrier", carrierSchema);
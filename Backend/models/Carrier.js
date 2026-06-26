const mongoose = require("mongoose");

const carrierSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
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
    email: {
      type: String,
      required: true,
      unique: true
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
    password: {
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
    },
    referralCode: {
      type: String,
    },

    // --Password reset fields --
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Carrier", carrierSchema);
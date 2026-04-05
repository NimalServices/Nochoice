const mongoose = require("mongoose");

const carrierTravelSchema = new mongoose.Schema(
  {
    carrierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carrier",
      required: true
    },
    fromWhere: {
      type: String,
      required: true
    },
    toWhere: {
      type: String,
      required: true
    },
    travelDate: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarrierTravel", carrierTravelSchema);
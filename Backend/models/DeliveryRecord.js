const mongoose = require("mongoose");

const deliveryRecordSchema = new mongoose.Schema(
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
    customerNo: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    dateTime: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "completed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryRecord", deliveryRecordSchema);
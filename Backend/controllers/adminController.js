const Carrier = require("../models/Carrier");
const CarrierTravel = require("../models/CarrierTravel");
const User = require("../models/User");

// Get all carriers (pending approval - approved: false)
exports.getPendingCarriers = async (req, res) => {
  try {
    const carriers = await Carrier.find({ approved: false });
    res.json(carriers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all carriers
exports.getAllCarriers = async (req, res) => {
  try {
    const carriers = await Carrier.find();
    res.json(carriers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve a carrier
exports.approveCarrier = async (req, res) => {
  try {
    const carrier = await Carrier.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!carrier) return res.status(404).json({ message: "Carrier not found" });
    res.json({ message: "Carrier approved", carrier });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject/Delete a carrier
exports.deleteCarrier = async (req, res) => {
  try {
    const carrier = await Carrier.findByIdAndDelete(req.params.id);
    if (!carrier) return res.status(404).json({ message: "Carrier not found" });
    res.json({ message: "Carrier removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all travel records
exports.getAllTravels = async (req, res) => {
  try {
    const travels = await CarrierTravel.find().populate("carrierId", "name nic phone category");
    res.json(travels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard stats
exports.getStats = async (req, res) => {
  try {
    const totalCarriers = await Carrier.countDocuments();
    const pendingCarriers = await Carrier.countDocuments({ approved: false });
    const approvedCarriers = await Carrier.countDocuments({ approved: true });
    const totalTravels = await CarrierTravel.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      totalCarriers,
      pendingCarriers,
      approvedCarriers,
      totalTravels,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
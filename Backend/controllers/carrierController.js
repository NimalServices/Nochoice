const Carrier = require("../models/Carrier");

exports.createCarrier = async (req, res) => {
  try {
    const carrier = await Carrier.create(req.body);
    res.status(201).json(carrier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCarriers = async (req, res) => {
  try {
    const carriers = await Carrier.find().populate("userId", "username role");
    res.json(carriers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCarrierById = async (req, res) => {
  try {
    const carrier = await Carrier.findById(req.params.id).populate("userId", "username role");
    if (!carrier) {
      return res.status(404).json({ message: "Carrier not found" });
    }
    res.json(carrier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCarrier = async (req, res) => {
  try {
    const carrier = await Carrier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!carrier) {
      return res.status(404).json({ message: "Carrier not found" });
    }
    res.json(carrier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCarrier = async (req, res) => {
  try {
    const carrier = await Carrier.findByIdAndDelete(req.params.id);
    if (!carrier) {
      return res.status(404).json({ message: "Carrier not found" });
    }
    res.json({ message: "Carrier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
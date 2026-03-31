const CarrierTravel = require("../models/CarrierTravel");

exports.createTravel = async (req, res) => {
  try {
    const travel = await CarrierTravel.create(req.body);
    res.status(201).json(travel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTravels = async (req, res) => {
  try {
    const travels = await CarrierTravel.find().populate("carrierId", "name nic phone");
    res.json(travels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTravelById = async (req, res) => {
  try {
    const travel = await CarrierTravel.findById(req.params.id).populate("carrierId", "name nic phone");
    if (!travel) {
      return res.status(404).json({ message: "Travel not found" });
    }
    res.json(travel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTravel = async (req, res) => {
  try {
    const travel = await CarrierTravel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!travel) {
      return res.status(404).json({ message: "Travel not found" });
    }
    res.json(travel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTravel = async (req, res) => {
  try {
    const travel = await CarrierTravel.findByIdAndDelete(req.params.id);
    if (!travel) {
      return res.status(404).json({ message: "Travel not found" });
    }
    res.json({ message: "Travel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const DeliveryRecord = require("../models/DeliveryRecord");

exports.createRecord = async (req, res) => {
  try {
    const record = await DeliveryRecord.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRecords = async (req, res) => {
  try {
    const records = await DeliveryRecord.find().populate("carrierId", "name nic phone");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecordById = async (req, res) => {
  try {
    const record = await DeliveryRecord.findById(req.params.id).populate("carrierId", "name nic phone");
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const record = await DeliveryRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const record = await DeliveryRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
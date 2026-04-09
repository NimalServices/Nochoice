const User = require("../models/User");
const Carrier = require("../models/Carrier");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.register = async (req, res) => {
  try {
    const { nic, username, password, role, name, category, phone } = req.body;

    const existingUser = await User.findOne({
      $or: [{ nic }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nic,
      username,
      password: hashedPassword,
      role
    });

    let carrierProfile = null;

    if (role === "carrier") {
      carrierProfile = await Carrier.create({
        userId: user._id,
        nic,
        name,
        category,
        phone,
        approved: false
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id, user.role),
      user,
      carrierProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        nic: user.nic,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.loginCarrier = async (req, res) => {
  try {
    const { nic, password } = req.body;

    // 1. Check carrier exists
    const carrier = await Carrier.findOne({ nic });
    if (!carrier) {
      return res.status(400).json({ message: "Invalid NIC or password" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, carrier.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid NIC or password" });
    }

    // 3. (Optional) Check approval
    // if (!carrier.approved) {
    //   return res.status(403).json({ message: "Carrier not approved yet" });
    // }

    // 4. Success response
    res.json({
      message: "Login successful",
      carrier: {
        id: carrier._id,
        name: carrier.name,
        nic: carrier.nic,
        category: carrier.category,
        phone: carrier.phone
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
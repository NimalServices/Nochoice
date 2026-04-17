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
        password: hashedPassword,
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
    const { username, nic, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (nic) {
      const carrier = await Carrier.findOne({ nic });
      if (!carrier || !carrier.password) {
        return res.status(400).json({ message: "Invalid NIC or password" });
      }

      const isMatch = await bcrypt.compare(password, carrier.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid NIC or password" });
      }

      const token = generateToken(carrier._id, "carrier");
      return res.json({
        message: "Login successful",
        token,
        carrier: {
          id: carrier._id,
          name: carrier.name,
          nic: carrier.nic,
          category: carrier.category,
          phone: carrier.phone
        }
      });
    }

    if (username) {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid username or password" });
      }

      return res.json({
        message: "Login successful",
        token: generateToken(user._id, user.role),
        user: {
          id: user._id,
          nic: user.nic,
          username: user.username,
          role: user.role
        }
      });
    }

    return res.status(400).json({ message: "Username or NIC is required" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginCarrier = exports.login;

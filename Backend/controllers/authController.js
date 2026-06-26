const User = require("../models/User");
const Carrier = require("../models/Carrier");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../src/utils/sendEmail");

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id, role }, secret, { expiresIn: "7d" });
};

const register = async (req, res) => {
  try {
    const { nic, username, password, name, category, phone } = req.body;

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
      role: "carrier",
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

const login = async (req, res) => {
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
          phone: carrier.phone,
          approved: carrier.approved
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


const NIC_REGEX = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const hashToken = (rawToken) => crypto.createHash("sha256").update(rawToken).digest("hex");

const forgotPassword = async (req, res) => {
  try {
    const {nic,email} = req.body;

    if( !NIC_REGEX.test(nic.trim()) && !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ message: "Invalid NIC or email" });
    }


    const carrier = await Carrier.findOne({ nic: nic.trim() });

    if (!carrier) {
      return res.status(404).json({ message: "Carrier not found" });
    }


    if(carrier.email == null) {
      carrier.email = email.trim();
      await carrier.save();
    }else {
      if(carrier.email !== email.trim()) {
        return res.status(400).json({ message: "Email does not match our records" });
      }
    }

    if (
      carrier.resetPasswordToken &&
      carrier.resetPasswordExpires &&
      carrier.resetPasswordExpires > Date.now()
    ) {
      const minutesLeft = Math.ceil(
        (carrier.resetPasswordExpires - Date.now()) / 60000
      );
      return res.status(429).json({
        success: false,
        message: `A reset link was already sent. Please wait ${minutesLeft} minute(s) before requesting another.`,
      });
    }

    // ── 5. Generate raw token & store its hash ─────────────────────────────
    const rawToken = crypto.randomBytes(32).toString("hex");
 
    carrier.resetPasswordToken = hashToken(rawToken);
    carrier.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    await carrier.save();
 
    // ── 6. Build reset URL & send email ───────────────────────────────────
    // rawToken goes in the URL — the DB only stores the hash
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
 
    await sendPasswordResetEmail(carrier.email, resetUrl, carrier.name);
 
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
    });
  }
  catch (error) {
  console.error("verifyResetToken error:", error);
  res.status(500).json({ success: false, message: "Server error." });
  }
  
};


// verify reset token
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required." });
    }

    const hashedToken = hashToken(token);

    const carrier = await Carrier.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!carrier) {
      return res.status(400).json({ success: false, message: "Invalid or expired token." });
    }

    return res.status(200).json({ success: true, message: "Token is valid." });
  }
  catch (error) {
    console.error("verifyResetToken error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// const resetpassword

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Basic validation
    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required." });
    }
    if (!newPassword) {
      return res.status(400).json({ success: false, message: "New password is required." });
    }

    const hashedToken = hashToken(token);

    const carrier = await Carrier.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!carrier) {
      return res.status(400).json({ success: false, message: "Invalid or expired token." });
    }

    // Update password
    carrier.password = await bcrypt.hash(newPassword, 12);
    carrier.resetPasswordToken = undefined;
    carrier.resetPasswordExpires = undefined;
    await carrier.save();

    return res.status(200).json({ success: true, message: "Password reset successfully." });
  }
  catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  verifyResetToken,
  resetPassword,
};
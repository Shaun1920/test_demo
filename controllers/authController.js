// authController.js
import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
  const { name, phoneNo, pin, userType } = req.body;

  // Make the name field optional
  if (name && !name.trim()) {
    return res.status(400).json({ success: false, message: "Invalid name" });
  }

  if (!phoneNo) {
    return res.status(400).json({ success: false, message: "Phone is required" });
  }

  if (!pin) {
    return res.status(400).json({ success: false, message: "Pin is required" });
  }

  if (!userType) {
    return res.status(400).json({ success: false, message: "User type is required" });
  }

  const existingUser = await userModel.findOne({ phoneNo });

  if (existingUser) {
    return res.status(400).json({ success: false, message: "Phone No already exists. Please login." });
  }

  const user = await userModel.create({ name, phoneNo, pin, userType });
  const token = user.createJWT();

  res.status(201).send({
    success: true,
    message: "User Created Successfully",
    user,
    token,
  });
};

export const loginController = async (req, res, next) => {
  const { phoneNo, pin, userType } = req.body;

  if (!phoneNo || !pin || !userType) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  const user = await userModel.findOne({ phoneNo }).select("+pin");

  if (!user || !(await user.comparePin(pin))) {
    return res.status(401).json({ success: false, message: "Invalid phone or pin" });
  }

  user.pin = undefined;
  const token = user.createJWT();

  res.status(200).json({
    success: true,
    message: "Login Successfully",
    user,
    token,
  });
};

const crypto = require("crypto");
const axios = require("axios");
const { successResponse, errorResponse } = require("../utils/responseUtil");
const db = require("../models/index");
const UserInfo = db.UserInfo;
const otpCache = new Map();

const otpExpiry = 5 * 60 * 1000;

exports.generateOtp = async (req, res) => {
  try {
    const data = req.body;
    // Generate OTP locally
    const otp = generateOtp();
    console.log(`OTP for ${data.number}: ${otp}`);

    const smsApiUrl = "https://msgn.mtalkz.com/api";
    const response = await axios.post(smsApiUrl, {
      apikey: "FTA4cOBIfjmlAdPL",
      senderid: "KKTEKS",
      number: data.number,
      message: `Hi ${otp}, Thank you for submitting your details. One of our expert counsellor will get in touch shortly to provide complete details. KKTEKS`,
      format: "json",
    });

    // If successful, store OTP in memory (for validation later)
    if (response.data && response.data.status === "OK") {
      otpCache.set(number, { otp, createdAt: Date.now() });

      return successResponse(res, "OTP sent successfully.", otp);
    } else {
      return errorResponse(res, "Failed to send OTP.", 500);
    }
  } catch (error) {
    return errorResponse(res, "Failed to generate OTP.", 500);
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { name, email, number, providedOtp, source, city } = req.body;

    const otpData = otpCache.get(number);
    if (!otpData) throw new Error("OTP not found or expired.");
    const { otp: savedOtp, createdAt } = otpData;

    if (Date.now() - createdAt > otpExpiry) {
      otpCache.delete(number);
      throw new Error("OTP expired.");
    }

    if (savedOtp !== providedOtp) throw new Error("Invalid OTP.");

    otpCache.delete(number);
    const data = {
      name,
      email,
      phone_number: number,
      source,
      city,
    };
    const userData = await UserInfo.create(data);
    return successResponse(res, "OTP verified successfully.", userData);
  } catch (error) {
    return errorResponse(res, "Failed to verify OTP.", 500);
  }
};

// Resend OTP
exports.resendOtp = async (req, res) => {
  try {
    const { number } = req.body;

    const otp = generateOtp();
    console.log(`OTP for ${number}: ${otp}`);
    const smsApiUrl = "https://msgn.mtalkz.com/api";
    const response = await axios.post(smsApiUrl, {
      apikey: "FTA4cOBIfjmlAdPL",
      senderid: "KKTEKS",
      number: data.number,
      message: `Hi ${otp}, Thank you for submitting your details. One of our expert counsellor will get in touch shortly to provide complete details. KKTEKS`,
      format: "json",
    });

    if (response.data && response.data.status === "OK") {
      otpCache.set(number, { otp, createdAt: Date.now() });
      return successResponse(res, "OTP resent successfully.", otp);
    } else {
      return errorResponse(res, "Failed to resend OTP.", 500);
    }
  } catch (error) {
    return errorResponse(res, "Failed to resend OTP.", 500);
  }
};

// Generate OTP - This function generates a 4-digit OTP
const generateOtp = () => crypto.randomInt(1000, 9999).toString();

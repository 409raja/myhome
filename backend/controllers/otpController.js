const pool = require("../config/db");

exports.sendOTP = async (req, res) => {
  const { phone } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await pool.query(
    "INSERT INTO otp_verifications (phone, otp, expires_at) VALUES ($1, $2, NOW() + interval '5 minutes')",
    [phone, otp]
  );

  console.log("OTP:", otp); // Later integrate SMS API

  res.json({ message: "OTP sent" });
};

exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  const result = await pool.query(
    "SELECT * FROM otp_verifications WHERE phone=$1 AND otp=$2 AND expires_at > NOW()",
    [phone, otp]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  res.json({ message: "Verified" });
};
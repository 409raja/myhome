const pool = require("../config/db");

// Create Enquiry (Public)
exports.createEnquiry = async (req, res) => {
  const { property_id, name, mobile, email, message } = req.body;

  if (!mobile.match(/^[6-9]\d{9}$/)) {
    return res.status(400).json({ message: "Invalid mobile number" });
  }

  const result = await pool.query(
    "INSERT INTO enquiries (property_id,name,mobile,email,message) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [property_id, name, mobile, email, message]
  );

  res.json(result.rows[0]);
};

// Agent's Enquiries
exports.getMyEnquiries = async (req, res) => {
  const result = await pool.query(
    `SELECT e.* FROM enquiries e
     JOIN properties p ON e.property_id = p.id
     WHERE p.agent_id = $1`,
    [req.user.id]
  );

  res.json(result.rows);
};

// Update Lead Status (Agent Only)
exports.updateEnquiryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = ["new", "contacted", "site_visit", "closed", "rejected"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  // Check enquiry belongs to this agent
  const check = await pool.query(
    `SELECT e.* FROM enquiries e
     JOIN properties p ON e.property_id = p.id
     WHERE e.id = $1 AND p.agent_id = $2`,
    [id, req.user.id]
  );

  if (check.rows.length === 0) {
    return res.status(403).json({ message: "Not authorized to update this enquiry" });
  }

  const result = await pool.query(
    "UPDATE enquiries SET status=$1 WHERE id=$2 RETURNING *",
    [status, id]
  );

  res.json(result.rows[0]);
};

const pool = require("../config/db");

// Create Property
exports.createProperty = async (req, res) => {
  const { title, description, city, type } = req.body;

  const price = parseInt(req.body.price);

  if (!price || isNaN(price)) {
    return res.status(400).json({ message: "Price must be a valid number" });
  }

  let imageUrls = [];

  if (req.files) {
    imageUrls = req.files.map(file => `/uploads/${file.filename}`);
  }

  const result = await pool.query(
    "INSERT INTO properties (agent_id,title,description,price,city,type,images) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
    [req.user.id, title, description, price, city, type, imageUrls]
  );

  res.json(result.rows[0]);
};


// Public Properties
exports.getProperties = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM properties WHERE is_approved = true"
  );

  res.json(result.rows);
};

// Approve Property (Admin Only)
exports.approveProperty = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "UPDATE properties SET is_approved = true WHERE id=$1 RETURNING *",
    [id]
  );

  res.json(result.rows[0]);
};

// Agent's Own Properties
exports.getMyProperties = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM properties WHERE agent_id=$1",
    [req.user.id]
  );

  res.json(result.rows);
};

// Update Property
exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, city, type } = req.body;

  // Check ownership
  const check = await pool.query(
    "SELECT * FROM properties WHERE id=$1 AND agent_id=$2",
    [id, req.user.id]
  );

  if (check.rows.length === 0) {
    return res.status(403).json({ message: "Not authorized to update this property" });
  }

  const result = await pool.query(
    `UPDATE properties 
     SET title=$1, description=$2, price=$3, city=$4, type=$5
     WHERE id=$6 RETURNING *`,
    [title, description, price, city, type, id]
  );

  res.json(result.rows[0]);
};

// Delete Property
exports.deleteProperty = async (req, res) => {
  const { id } = req.params;

  // Check ownership
  const check = await pool.query(
    "SELECT * FROM properties WHERE id=$1 AND agent_id=$2",
    [id, req.user.id]
  );

  if (check.rows.length === 0) {
    return res.status(403).json({ message: "Not authorized to delete this property" });
  }

  await pool.query("DELETE FROM properties WHERE id=$1", [id]);

  res.json({ message: "Property deleted successfully" });
};

// Get Single Property (Public)
exports.getSingleProperty = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT * FROM properties WHERE id=$1",
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Property not found" });
  }

  res.json(result.rows[0]);
};

// Get Pending Properties (Admin)
exports.getPendingProperties = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM properties WHERE is_approved = false"
  );

  res.json(result.rows);
};

// Get Featured Properties
exports.getFeaturedProperties = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM properties WHERE is_featured = true AND is_approved = true"
  );

  res.json(result.rows);
};

// Mark Property as Featured (Admin Only)
exports.markFeatured = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "UPDATE properties SET is_featured = true WHERE id=$1 RETURNING *",
    [id]
  );

  res.json(result.rows[0]);
};

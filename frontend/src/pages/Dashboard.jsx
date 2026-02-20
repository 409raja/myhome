import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProperties();
    fetchMyEnquiries();
  }, []);

  const fetchMyProperties = async () => {
    try {
      const { data } = await API.get("/properties/my");
      setProperties(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyEnquiries = async () => {
    try {
      const { data } = await API.get("/enquiries/my");
      setEnquiries(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/enquiries/${id}`, { status });
      fetchMyEnquiries();
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Agent Dashboard</h2>
      <button onClick={logout} style={logoutStyle}>Logout</button>
        <button
        onClick={() => navigate("/add-property")}
        style={{ marginBottom: "20px" }}
        >
        Add Property
        </button>

      <hr />

      <h3>My Properties</h3>
      {properties.length === 0 && <p>No properties found</p>}
      {properties.map((property) => (
        <div key={property.id} style={cardStyle}>
          <h4>{property.title}</h4>
          <p>{property.city}</p>
          <p>₹ {property.price}</p>
        </div>
      ))}

      <hr />

      <h3>My Enquiries</h3>
      {enquiries.length === 0 && <p>No enquiries yet</p>}
      {enquiries.map((enquiry) => (
        <div key={enquiry.id} style={cardStyle}>
          <p><strong>{enquiry.name}</strong></p>
          <p>{enquiry.mobile}</p>
          <p>{enquiry.email}</p>
          <p>Status: {enquiry.status}</p>

          <button onClick={() => updateStatus(enquiry.id, "contacted")}>
            Mark Contacted
          </button>

          <button onClick={() => updateStatus(enquiry.id, "closed")}>
            Mark Closed
          </button>
        </div>
      ))}
    </div>
  );
};

const cardStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  margin: "10px 0",
};

const logoutStyle = {
  padding: "5px 10px",
  backgroundColor: "red",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default Dashboard;

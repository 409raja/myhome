import { useEffect, useState } from "react";
import API from "../api/axios";

const Admin = () => {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const { data } = await API.get("/properties/pending");
      setPending(data);
    } catch (error) {
      console.error(error);
    }
  };

  const approve = async (id) => {
    try {
      await API.put(`/properties/${id}/approve`);
      fetchPending();
    } catch (error) {
      console.error(error);
    }
  };

  const feature = async (id) => {
  try {
    await API.put(`/properties/${id}/feature`);
    fetchPending();
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div style={{ padding: "30px" }}>
      <h2>Pending Properties</h2>

      {pending.length === 0 && <p>No pending properties</p>}

      {pending.map((property) => (
        <div key={property.id} style={cardStyle}>
          <h4>{property.title}</h4>
          <p>{property.city}</p>
          <p>₹ {property.price}</p>

          <button onClick={() => approve(property.id)}>
            Approve
          </button>
            <button
            onClick={() => feature(property.id)}
            className="bg-yellow-500 text-white px-3 py-1 rounded-md ml-2"
            >
            Feature
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

export default Admin;

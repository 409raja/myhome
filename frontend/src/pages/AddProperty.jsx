import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    type: "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      await API.post("/properties", formData);
      alert("Property submitted for approval");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Add Property</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input name="title" placeholder="Title" onChange={handleChange} required style={inputStyle} />
        <input name="description" placeholder="Description" onChange={handleChange} required style={inputStyle} />
        <input name="price" placeholder="Price" onChange={handleChange} required style={inputStyle} />
        <input name="city" placeholder="City" onChange={handleChange} required style={inputStyle} />
        <input name="type" placeholder="Type" onChange={handleChange} required style={inputStyle} />
        <input type="file" multiple onChange={handleFileChange} style={inputStyle} />

        <button type="submit" style={buttonStyle}>
          Submit
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
};

const buttonStyle = {
  padding: "10px",
  backgroundColor: "blue",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default AddProperty;

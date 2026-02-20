import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const { data } = await API.post("/auth/login", form);

        localStorage.setItem("token", data.token);

        window.location.href = "/";   // 🔥 force refresh
    } catch (error) {
        alert("Invalid credentials");
    }
    };


  return (
    <div style={{ padding: "40px" }}>
      <h2>Agent Login</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "300px" }}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Login
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
  backgroundColor: "green",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default Login;

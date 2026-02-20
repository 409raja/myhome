/*
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data } = await API.get(`/properties/${id}`);
      setProperty(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/enquiries", {
        property_id: property.id,
        name: form.name,
        mobile: form.mobile,
        email: form.email,
        message: form.message,
      });

      setSuccess("Enquiry sent successfully!");
      setForm({ name: "", mobile: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
    }
  };

  if (!property) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{property.title}</h1>
      <p>{property.city}</p>
      <h2>₹ {property.price}</h2>
      <p>{property.description}</p>

      {/* Image Gallery */ 
/*
      <div>
        {property.images &&
          property.images.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:5000${img}`}
              alt="property"
              style={{ width: "300px", margin: "10px" }}
            />
          ))}
      </div>

      <hr />

      <h2>Send Enquiry</h2>

      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Submit Enquiry
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
};

const buttonStyle = {
  padding: "10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default PropertyDetail;
*/
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef(null);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProperty();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (property?.images?.length > 0) {
        nextImage();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [property, activeImage]);

  const fetchProperty = async () => {
    try {
      const { data } = await API.get(`/properties/${id}`);
      setProperty(data);
    } catch (error) {
      console.error(error);
    }
  };

  const nextImage = () => {
    setActiveImage((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImage((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  // Swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextImage();
    if (diff < -50) prevImage();
  };

  if (!property) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">

      {/* IMAGE SLIDER */}
      {property.images && property.images.length > 0 && (
        <div className="relative mb-10">

          <div
            className="rounded-xl overflow-hidden shadow-lg relative group cursor-pointer"
            onClick={() => setLightboxOpen(true)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={`http://localhost:5000${property.images[activeImage]}`}
              alt={property.title}
              className="w-full h-[500px] object-cover transition-opacity duration-700"
            />

            {/* Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {activeImage + 1} / {property.images.length}
            </div>

            {/* Left Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white px-4 py-2 rounded-full"
            >
              ‹
            </button>

            {/* Right Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white px-4 py-2 rounded-full"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* DETAILS */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div>
          <h1 className="text-4xl font-bold mb-4">
            {property.title}
          </h1>

          <p className="text-gray-500 mb-2">
            {property.city}
          </p>

          <p className="text-2xl text-blue-600 font-bold mb-6">
            ₹ {property.price}
          </p>

          <p className="text-gray-700 leading-relaxed">
            {property.description}
          </p>

          {/* Virtual Tour Button */}
       <button
        onClick={() =>
          window.open(
            property.virtual_tour || "https://www.youtube.com/",
            "_blank"
          )
        }
        className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
      >
        Virtual Tour
      </button>

        </div>

        <div className="bg-gray-100 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Interested?
          </h2>
        <button
          onClick={() => setShowEnquiry(true)}
          className="bg-blue-600 text-white w-full py-3 rounded-md hover:bg-blue-700 transition"
        >
          Send Enquiry
        </button>

        </div>
      </div>

      {/* GOOGLE MAP */}
      <div className="mb-20">
        <h2 className="text-2xl font-semibold mb-6">
          Location
        </h2>

        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={{ lat: 26.8467, lng: 80.9462 }}  // Example Lucknow
            zoom={12}
          >
            <Marker position={{ lat: 26.8467, lng: 80.9462 }} />
          </GoogleMap>
        </LoadScript>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >
          <img
            src={`http://localhost:5000${property.images[activeImage]}`}
            alt="fullscreen"
            className="max-h-[90%] max-w-[90%] object-contain"
          />
        </div>
      )}

      {showEnquiry && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-semibold mb-4">
              Send Enquiry
            </h2>

            <textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border p-2 rounded-md mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEnquiry(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await API.post("/enquiries", {
                      property_id: property.id,
                      message: message
                    });
                    alert("Enquiry sent successfully");
                    setShowEnquiry(false);
                    setMessage("");
                  } catch (error) {
                    alert("Please login first");
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PropertyDetail;

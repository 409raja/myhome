import { useEffect, useState } from "react";
import API from "../api/axios";
import PropertyCard from "../components/PropertyCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

    useEffect(() => {
    fetchProperties();
    fetchFeatured();
    }, []);

  const fetchProperties = async () => {
    try {
      const { data } = await API.get("/properties");
      setProperties(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFeatured = async () => {
  try {
    const { data } = await API.get("/properties/featured");
    setFeatured(data);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div>

      {/* HERO SECTION */}
      <section className="relative bg-gray-900 text-white py-28 text-center">
        <div className="absolute inset-0 bg-black opacity-60"></div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-6">
            Find Your Dream Home
          </h1>

          <p className="text-lg mb-8">
            Buy or Rent properties in prime locations
          </p>

          <div className="flex justify-center">
            <input
                type="text"
                placeholder="Search by city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-3 w-80 text-black rounded-l-md"
            />

            <button
                onClick={() => navigate(`/search?city=${search}`)}
                className="bg-blue-600 px-6 rounded-r-md hover:bg-blue-700 transition"
            >
                Search
            </button>
            </div>

        </div>
      </section>

      {/* BUY / RENT QUICK CARDS */}
      <section className="py-16 px-8 bg-gray-100">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Explore Properties
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white shadow-xl p-10 text-center rounded-xl hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-3">Buy Property</h3>
            <p className="text-gray-600 mb-4">
              Find your perfect home to own
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
              Browse
            </button>
          </div>

          <div className="bg-white shadow-xl p-10 text-center rounded-xl hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-3">Rent Property</h3>
            <p className="text-gray-600 mb-4">
              Comfortable homes for rent
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-md">
              Browse
            </button>
          </div>
        </div>
      </section>

      {/* LATEST PROPERTIES */}
      <section className="py-16 px-8">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Latest Properties
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {properties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Want to List Your Property?
        </h2>

        <p className="mb-6">
          Reach thousands of buyers instantly.
        </p>

        <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
          Post Property
        </button>
      </section>

    {/* FEATURED PROPERTIES */}
    <section className="py-16 px-8 bg-yellow-50">
    <h2 className="text-3xl font-semibold text-center mb-10">
        Featured Projects
    </h2>

    <div className="grid md:grid-cols-3 gap-8">
        {featured.length > 0 ? (
        featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
        ))
        ) : (
        <p className="text-center col-span-3">
            No featured properties
        </p>
        )}
    </div>
    </section>

    </div>
  );
};

export default Home;

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api/axios";
import PropertyCard from "../components/PropertyCard";

const SearchResults = () => {
  const [properties, setProperties] = useState([]);
  const location = useLocation();
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get("city");

  useEffect(() => {
    setCurrentPage(1);
    fetchResults();
  }, [city, sort, minPrice, maxPrice]);

  const fetchResults = async () => {
  try {
    const { data } = await API.get("/properties");

    let filtered = data.filter((property) =>
      property.city?.toLowerCase().includes(city?.toLowerCase() || "")
    );

    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    if (sort === "low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setProperties(filtered);
  } catch (error) {
    console.error(error);
  }
};

const indexOfLast = currentPage * propertiesPerPage;
const indexOfFirst = indexOfLast - propertiesPerPage;
const currentProperties = properties.slice(indexOfFirst, indexOfLast);

const totalPages = Math.ceil(properties.length / propertiesPerPage);

  return (
    <div className="py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-10">
        Search Results for "{city}"
      </h2>
      <div className="flex justify-end mb-6">
        <select
          onChange={(e) => setSort(e.target.value)}
          className="border px-4 py-2 rounded-md"
        >
          <option value="">Sort By</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>
      <div className="flex gap-4 mb-6">
        <input
          type="number"
          placeholder="Min Price"
          onChange={(e) => setMinPrice(e.target.value)}
          className="border px-4 py-2 rounded-md"
        />
        <input
          type="number"
          placeholder="Max Price"
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-4 py-2 rounded-md"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {properties.length > 0 ? (
          currentProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p className="text-center col-span-3">
            No properties found
          </p>
        )}
      </div>
      <div className="flex justify-center mt-10 gap-2">
  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index}
      onClick={() => setCurrentPage(index + 1)}
      className={`px-4 py-2 rounded-md ${
        currentPage === index + 1
          ? "bg-blue-600 text-white"
          : "bg-gray-200"
      }`}
    >
      {index + 1}
    </button>
  ))}
</div>

    </div>
  );
};

export default SearchResults;

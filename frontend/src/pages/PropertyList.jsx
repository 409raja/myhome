import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import PropertyCard from "../components/PropertyCard";

const PropertyList = () => {
  const { category, subtype } = useParams();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchFiltered();
  }, [category, subtype]);

    const fetchFiltered = async () => {
    try {
        const { data } = await API.get("/properties");

        const filtered = data.filter((property) => {
        const categoryMatch =
            property.category?.toLowerCase() === category?.toLowerCase();

        const subtypeMatch = subtype
            ? property.type?.toLowerCase() === subtype?.toLowerCase()
            : true;

        return categoryMatch && subtypeMatch;
        });

        setProperties(filtered);
    } catch (error) {
        console.error(error);
    }
    };


  return (
    <div className="py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-10 capitalize">
        {category} {subtype}
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {properties.length > 0 ? (
          properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p className="text-center col-span-3">
            No properties found
          </p>
        )}
      </div>
    </div>
  );
};

export default PropertyList;

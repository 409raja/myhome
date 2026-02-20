import { Link } from "react-router-dom";

const PropertyCard = ({ property }) => {
  return (
    <Link to={`/property/${property.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden">

        {property.images && property.images.length > 0 && (
          <img
            src={`http://localhost:5000${property.images[0]}`}
            alt="property"
            className="w-full h-60 object-cover"
          />
        )}

        <div className="p-5">
          <h3 className="text-xl font-semibold mb-2">
            {property.title}
          </h3>

          <p className="text-gray-500">
            {property.city}
          </p>

          <p className="text-blue-600 font-bold text-lg mt-3">
            ₹ {property.price}
          </p>
        </div>

      </div>
    </Link>
  );
};

export default PropertyCard;

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MY HOME
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>

<div className="relative group">
  <button className="hover:text-blue-600">
    Buy
  </button>

  <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md min-w-[150px]">
    <Link
      to="/buy/flat"
      className="block px-4 py-2 hover:bg-gray-100"
    >
      Flat
    </Link>
    <Link
      to="/buy/villa"
      className="block px-4 py-2 hover:bg-gray-100"
    >
      Villa
    </Link>
    <Link
      to="/buy/plot"
      className="block px-4 py-2 hover:bg-gray-100"
    >
      Plot
    </Link>

  </div>
</div>

<div className="relative group">
  <button className="hover:text-blue-600">
    Rent
  </button>

  <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md min-w-[150px]">
    <Link
      to="/rent/flat"
      className="block px-4 py-2 hover:bg-gray-100"
    >
      Flat
    </Link>
    <Link
      to="/rent/villa"
      className="block px-4 py-2 hover:bg-gray-100"
    >
      Villa
    </Link>
    <Link
      to="/rent/plot"
      className="block px-4 py-2 hover:bg-gray-100"
    >
      Plot
    </Link>
  </div>
</div>

          {user?.role === "agent" && (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/add-property" className="hover:text-blue-600">
                Add Property
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/admin" className="hover:text-blue-600">
                Admin Panel
              </Link>
            </>
          )}

          {user ? (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 space-y-3">
          <Link to="/" className="block">Home</Link>
          <Link to="/buy/flat" className="block">Buy Flat</Link>
          <Link to="/buy/villa" className="block">Buy Villa</Link>
          <Link to="/buy/plot" className="block">Buy Plot</Link>
          <Link to="/rent/flat" className="block">Rent Flat</Link>
          <Link to="/rent/villa" className="block">Rent Villa</Link>
          <Link to="/rent/plot" className="block">Rent Plot</Link>

          {user?.role === "agent" && (
            <>
              <Link to="/dashboard" className="block">Dashboard</Link>
              <Link to="/add-property" className="block">Add Property</Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" className="block">Admin Panel</Link>
          )}

          {user ? (
            <button onClick={logout} className="block text-red-500">
              Logout
            </button>
          ) : (
            <Link to="/login" className="block text-blue-600">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

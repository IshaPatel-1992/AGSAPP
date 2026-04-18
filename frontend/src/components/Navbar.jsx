import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo/Airdrie-Samaj-Logo-png.png";
import navbarBg from "../assets/Footer/shutterstock_2506871797.jpg";
import { FaBars, FaTimes } from "react-icons/fa";
import AuthDropdown from "./AuthDropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Events", path: "/events" },
    { name: "Membership Info", path: "/membershipinfo" },
    { name: "Contact Us", path: "/contact" },
  ];

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("member");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    window.addEventListener("authChanged", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("authChanged", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("member");
    window.dispatchEvent(new Event("authChanged"));
    setUser(null);
    setIsOpen(false);
    navigate("/");
  };

  return (
    <header
      className="sticky top-0 z-50 shadow-md backdrop-blur-md"
      style={{
        backgroundImage: `url(${navbarBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-brand-saffron/80 to-brand-mint/80"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
          <img
            src={logo}
            alt="Logo"
            className="h-[80px] hover:scale-105 transition"
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="px-3 py-1 rounded-md font-medium text-gray-900 hover:text-white hover:bg-black/20 transition"
            >
              {item.name}
            </Link>
          ))}

          <div className="flex items-center gap-3 ml-2">
            {user && (
              <span className="text-sm font-medium text-gray-900 hidden lg:block">
                Hi, {user.full_name || user.email}
              </span>
            )}

            <AuthDropdown
              user={user}
              setUser={setUser}
              onLogout={handleLogout}
            /> 

          </div>
        </nav>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-3 relative z-20">
          <AuthDropdown
            user={user}
            setUser={setUser}
            onLogout={handleLogout}
            mobile
          /> 

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 rounded-md text-gray-900 hover:bg-black/10"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden relative z-20 bg-white px-6 py-4 space-y-3 shadow-lg"
        >
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="block py-2 px-2 text-gray-800 hover:bg-gray-100 rounded"
            >
              {item.name}
            </Link>
          ))}

          {user && (
            <p className="text-sm text-center text-gray-600 pt-2 border-t">
              Logged in as {user.full_name || user.email}
            </p>
          )}
        </div>
      )}
    </header>
  );
}
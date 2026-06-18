import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo/ags-logo-new-2026.png";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import AuthDropdown from "./AuthDropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const mainItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];

  const dropdownItems = [
    {
      name: "Events",
      items: [
        { name: "Upcoming Events", path: "/events" },
        { name: "Non-Member Tickets", path: "/events/find-ticket" },
        { name: "Gallery", path: "/gallerypage" },
      ],
    },
    {
      name: "Membership",
      items: [
        { name: "Membership Info", path: "/membershipinfo" },
        { name: "Member Dashboard", path: "/membershipdashboard" },
        { name: "My Tickets", path: "/member/mytickets" },
      ],
    },
    {
      name: "More",
      items: [
        { name: "Our Team", path: "/ourteam" },
        { name: "Contact Us", path: "/contact" },
      ],
    },
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

  const closeMenus = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("member");
    window.dispatchEvent(new Event("authChanged"));
    setUser(null);
    closeMenus();
    navigate("/");
  };

  return (
  <header className="sticky top-0 z-50 border-b border-orange-100 bg-gradient-to-r from-orange-50 via-white to-green-50 shadow-sm">
      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2 md:px-4">
        <Link
          to="/"
          className="flex min-w-0 flex-1 items-center md:flex-none"
          onClick={closeMenus}
        >
          <img
            src={logo}
            alt="Airdrie Gujarati Samaj Logo"
            className="h-[56px] w-auto max-w-[240px] object-contain transition duration-300 hover:scale-105 sm:h-[65px] md:h-[78px] md:max-w-none"
          />
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {mainItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="rounded-md px-3 py-2 font-semibold text-gray-900 transition hover:bg-black/20 hover:text-white"
            >
              {item.name}
            </Link>
          ))}

          {dropdownItems.map((group) => (
            <div
              key={group.name}
              className="relative"
              onMouseEnter={() => setOpenDropdown(group.name)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 rounded-md px-3 py-2 font-semibold text-gray-900 transition hover:bg-black/20 hover:text-white"
              >
                {group.name}
                <FaChevronDown size={12} />
              </button>

              {openDropdown === group.name && (
                <div className="absolute left-0 top-full min-w-[210px] rounded-2xl bg-white p-2 shadow-xl">
                  {group.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={closeMenus}
                      className="block rounded-xl px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-[#fdf6ef] hover:text-[#d4503e]"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="ml-2 flex items-center gap-3">
            {user && (
              <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-900 lg:block">
                Hi, {user.full_name || user.email}
              </span>
            )}

            <AuthDropdown user={user} setUser={setUser} onLogout={handleLogout} />
          </div>
        </nav>

        <div className="relative z-30 flex shrink-0 items-center gap-2 md:hidden">
          <div className="relative">
            <AuthDropdown
              user={user}
              setUser={setUser}
              onLogout={handleLogout}
              mobile
            />
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-md bg-white/40 p-2 text-gray-900 hover:bg-white/70"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="relative z-20 max-h-[75vh] overflow-y-auto bg-white px-5 py-4 shadow-lg md:hidden"
        >
          <MobileLink to="/" label="Home" onClick={closeMenus} />
          <MobileLink to="/about" label="About" onClick={closeMenus} />

          <MobileSection title="Events" />
          <MobileLink to="/events" label="Upcoming Events" onClick={closeMenus} />
          <MobileLink
            to="/events/find-ticket"
            label="Non-Member Tickets"
            onClick={closeMenus}
          />
          <MobileLink to="/gallerypage" label="Gallery" onClick={closeMenus} />

          <MobileSection title="Membership" />
          <MobileLink
            to="/membershipinfo"
            label="Membership Info"
            onClick={closeMenus}
          />
          <MobileLink
            to="/membershipdashboard"
            label="Member Dashboard"
            onClick={closeMenus}
          />
          <MobileLink
            to="/member/mytickets"
            label="My Tickets"
            onClick={closeMenus}
          />

          <MobileSection title="More" />
          <MobileLink to="/ourteam" label="Our Team" onClick={closeMenus} />
          <MobileLink to="/contact" label="Contact Us" onClick={closeMenus} />

          {user && (
            <p className="mt-4 border-t pt-3 text-center text-sm text-gray-600">
              Logged in as {user.full_name || user.email}
            </p>
          )}
        </div>
      )}
    </header>
  );
}

function MobileSection({ title }) {
  return (
    <p className="mt-4 border-t pt-3 text-xs font-bold uppercase tracking-wide text-[#d4503e] first:mt-0 first:border-t-0 first:pt-0">
      {title}
    </p>
  );
}

function MobileLink({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-[#fdf6ef] hover:text-[#d4503e]"
    >
      {label}
    </Link>
  );
}
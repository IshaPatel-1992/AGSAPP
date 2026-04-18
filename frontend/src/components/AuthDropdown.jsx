import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function AuthDropdown({ user, setUser, onLogout, mobile = false }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (mobile) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobile]);

  const goAfterLogin = (user) => {
    localStorage.setItem("member", JSON.stringify(user));
    window.dispatchEvent(new Event("authChanged"));
    setUser(user);
    setOpen(false);
    navigate("/membershipdashboard");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const result = await api.post("googleLogin.php", {
          access_token: tokenResponse.access_token,
        });

        if (result?.success && result?.user) {
          goAfterLogin(result.user);
        } else {
          alert(result?.message || "Google login failed");
        }
      } catch (err) {
        console.error(err);
        alert("Google login failed");
      }
    },
  });

  const renderAvatar = () => {
    if (user?.full_name) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center">
          {user.full_name.charAt(0)}
        </div>
      );
    }
    return <FaUserCircle className="text-2xl text-gray-800" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="p-2">
        {renderAvatar()}
      </button>

      {open && (
        <div
          className={`${
            mobile
              ? "mt-2 w-full bg-white p-3 rounded-lg shadow"
              : "absolute right-0 mt-2 w-64 bg-white p-4 rounded-lg shadow z-50"
          }`}
        >
          {user ? (
            <>
              <p className="text-center font-semibold">
                {user.full_name || user.email}
              </p>

              <button
                onClick={() => {
                  navigate("/membershipdashboard");
                  setOpen(false);
                }}
                className="w-full mt-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setOpen(false);
                }}
                className="w-full mt-3 py-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => googleLogin()}
                className="w-full h-[48px] border rounded flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>

              <button
                onClick={() => {
                  navigate("/login");
                  setOpen(false);
                }}
                className="w-full mt-3 py-2 bg-gray-100 rounded"
              >
                Sign In / Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
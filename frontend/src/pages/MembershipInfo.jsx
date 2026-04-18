import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../config/appConfig";
import { api } from "../api";

export default function MembershipInfo() {
  const navigate = useNavigate();

  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMembershipTypes = async () => {
      try {
        setLoading(true);
        const result = await api.get("getMembershipTypes.php");

        if (result?.success) {
          setMemberships(result.data || []);
        } else {
          setError(result?.message || "Failed to load membership types.");
        }
      } catch (err) {
        console.error("Error loading membership types:", err);
        setError("Something went wrong while loading memberships.");
      } finally {
        setLoading(false);
      }
    };

    loadMembershipTypes();
  }, []);

  const handleMembershipClick = (membershipType) => {
    if (!APP_CONFIG.MEMBERSHIP_ENABLED) return;

    const user = localStorage.getItem("member");

    if (user) {
      navigate("/membershipdashboard", {
        state: { selectedMembershipType: membershipType },
      });
      return;
    }

    const confirmed = window.confirm(
      "You need to log in first to apply for membership. Press OK to go to Login page."
    );

    if (confirmed) {
      navigate("/login", {
        state: { membershipType },
      });
    }
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative z-20 p-6 sm:p-10 max-w-5xl mx-auto animate-fadeIn">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center mb-10"
          style={{ color: "#d4503e" }}
        >
          Membership
        </h2>

        <p className="mb-6 text-lg text-center">
          Join Airdrie Gujarati Samaj to celebrate tradition and unity.
        </p>

        <h3 className="text-2xl font-semibold mb-6 text-center">
          Membership Options
        </h3>

        {loading && (
          <p className="text-center text-gray-500">
            Loading membership options...
          </p>
        )}

        {error && (
          <div className="text-center text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {memberships.map((m) => (
              <div
                key={m.id}
                onClick={() => handleMembershipClick(m.name)}
                className="cursor-pointer relative bg-white/90 rounded-2xl p-6 shadow-xl border hover:shadow-2xl transition transform hover:-translate-y-1 hover:scale-[1.02]"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>

                <h4 className="text-xl font-bold mb-3 text-center">
                  {m.name}
                </h4>

                <p className="text-gray-700 text-sm text-center mb-5">
                  {m.description}
                </p>

                {m.is_discount_active && (
                  <div className="text-center mb-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                      {m.price_label}
                    </span>
                  </div>
                )}

                <div className="flex justify-center">
                  {m.is_discount_active ? (
                    <div className="text-center">
                      <div className="text-sm text-gray-400 line-through">
                        ${Number(m.base_price).toFixed(2)}
                      </div>

                      <div className="mt-2 inline-flex items-center gap-2 bg-green-100 text-green-700 font-bold px-5 py-2 rounded-full">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-green-600 text-white text-xs">
                          ✓
                        </span>
                        <span>${Number(m.final_price).toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="bg-green-100 text-green-700 font-bold px-5 py-2 rounded-full">
                      ${Number(m.base_price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="mb-4 text-lg">
            Ready to join? Membership registration will open soon. Stay tuned!
          </p>
        </div>
      </div>
    </section>
  );
}
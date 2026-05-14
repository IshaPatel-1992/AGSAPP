import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyMemberships from "../components/MyMemberships";
import PaymentTermsNotice from "../components/PaymentTermsNotice";
import { msalInstance } from "../auth/msalConfig";
import { api } from "../api";

export default function MembershipDashboard() {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [membershipOptions, setMembershipOptions] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [typesError, setTypesError] = useState("");

  useEffect(() => {
    const loadMember = () => {
      try {
        const savedMember = localStorage.getItem("member");

        if (!savedMember) {
          setMember(null);
          navigate("/login");
          return;
        }

        const parsedMember = JSON.parse(savedMember);
        setMember(parsedMember);
      } catch (error) {
        console.error("Failed to parse member from localStorage:", error);
        localStorage.removeItem("member");
        setMember(null);
        navigate("/login");
      }
    };

    loadMember();

    window.addEventListener("storage", loadMember);
    window.addEventListener("authChanged", loadMember);

    return () => {
      window.removeEventListener("storage", loadMember);
      window.removeEventListener("authChanged", loadMember);
    };
  }, [navigate]);

  useEffect(() => {
    const loadMembershipTypes = async () => {
      try {
        setLoadingTypes(true);
        setTypesError("");

        const result = await api.get("getMembershipTypes.php");

        if (result?.success) {
          setMembershipOptions(result.data || []);
        } else {
          setTypesError(result?.message || "Failed to load membership types.");
        }
      } catch (error) {
        console.error("Error loading membership types:", error);
        setTypesError("Something went wrong while loading membership types.");
      } finally {
        setLoadingTypes(false);
      }
    };

    loadMembershipTypes();
  }, []);

  const handleNewMembership = (membershipType) => {
    navigate("/membershipform", {
      state: { membershipType },
    });
  };

  const handleLogout = async () => {
    try {
      await msalInstance.logoutPopup({
        mainWindowRedirectUri: "/",
      });
    } catch (err) {
      console.log("MS logout skipped:", err);
    }

    localStorage.removeItem("member");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand">
              Membership Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome{member?.full_name ? `, ${member.full_name}` : ""}. Manage
              membership applications for yourself and your family.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-brand mb-2">
            Start a New Membership Application
          </h2>

          <p className="text-gray-600 mb-6">
            Choose a membership type to create a new application under your
            account.
          </p>

          <PaymentTermsNotice
            showCheckbox={false}
            className="mb-6"
            notes={[
              "Airdrie Gujarati Samaj does not accept returns for membership. Once paid, the membership amount is non-refundable and non-transferable under any circumstances.",
              "Payment processing fees are applied by the payment provider and are non-refundable.",
              "All AGS event tickets are non-refundable as well. However, event cancellations made well ahead of the event day may be eligible for a partial refund under certain circumstances only. Management will periodically decide the eligible refund percentage.",
            ]}
          />

          {loadingTypes && (
            <p className="text-gray-500">Loading membership types...</p>
          )}

          {typesError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {typesError}
            </div>
          )}

          {!loadingTypes && !typesError && membershipOptions.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-600">
              No membership types are available right now.
            </div>
          )}

          {!loadingTypes && !typesError && membershipOptions.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {membershipOptions.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-lg transition"
                >
                  <div className="h-2 w-full rounded-full bg-yellow-500 mb-4" />

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>

                  {item.is_discount_active && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                        {item.price_label}
                      </span>
                    </div>
                  )}

                  <div className="flex items-end justify-between gap-3">
                    <div>
                      {item.is_discount_active ? (
                        <>
                          <div className="text-sm text-gray-400 line-through">
                            ${Number(item.base_price).toFixed(2)}
                          </div>
                          <div className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-bold">
                            ${Number(item.final_price).toFixed(2)}
                          </div>
                        </>
                      ) : (
                        <div className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 font-bold">
                          ${Number(item.base_price).toFixed(2)}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleNewMembership(item.name)}
                      className="px-4 py-2 rounded-lg bg-brand text-orange font-medium hover:opacity-90 transition"
                    >
                      Add Application
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <MyMemberships />
      </div>
    </section>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function MyMemberships() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const member = JSON.parse(localStorage.getItem("member") || "null");

  useEffect(() => {
    const load = async () => {
      try {
        const memberId = member?.id || member?.member_id;

        if (!memberId) {
          setError("Member ID not found in localStorage");
          return;
        }

        const result = await api.post("getMyMembershipApplications.php", {
          member_id: memberId,
        });

        if (result?.success) {
          setItems(result.applications || []);
        } else {
          setError(result?.message || "Failed to fetch memberships");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [member?.id, member?.member_id]);

  const unpaidItems = useMemo(
    () =>
      items.filter(
        (item) => (item.payment_status || "").toLowerCase() !== "paid"
      ),
    [items]
  );

  const paidItems = useMemo(
    () =>
      items.filter(
        (item) => (item.payment_status || "").toLowerCase() === "paid"
      ),
    [items]
  );

  const totalUnpaidAmount = useMemo(
    () =>
      unpaidItems.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [unpaidItems]
  );

  const handleEdit = (app) => {
    navigate("/membershipform", {
      state: {
        editMode: true,
        applicationId: app.id,
        membershipType: app.membership_type,
      },
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    try {
      const memberId = member?.id || member?.member_id;

      const result = await api.post("deleteMembershipApplication.php", {
        id,
        member_id: memberId,
      });

      if (result?.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(result?.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting");
    }
  };

  const handleCommonPayment = () => {
    if (!unpaidItems.length) {
      alert("No unpaid memberships available for payment.");
      return;
    }

    navigate("/payment", {
      state: {
        applications: unpaidItems,
        totalAmount: totalUnpaidAmount,
      },
    });
  };

  const getPaymentBadge = (payment) => {
    switch ((payment || "").toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "unpaid":
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderMembershipCard = (app, isPaid = false) => {
    return (
      <div
        key={app.id}
        className="border border-gray-200 rounded-xl p-4 sm:p-5 bg-white"
      >
        <div className="flex flex-col gap-4 sm:gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
              {app.membership_type}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 self-center">
                Payment
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadge(
                  app.payment_status || "Unpaid"
                )}`}
              >
                {app.payment_status || "Unpaid"}
              </span>

              {isPaid && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Active Membership
                </span>
              )}
            </div>

            <p className="mt-3 text-xs sm:text-sm text-gray-500 break-words">
              Submitted: {app.created_at || "N/A"}
            </p>
          </div>

          <div className="text-left md:text-right shrink-0">
            <div className="text-base sm:text-lg font-bold text-green-700">
              ${Number(app.amount || 0).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          {!isPaid ? (
            <>
              <button
                type="button"
                onClick={() => handleEdit(app)}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Edit
              </button>

              <span className="hidden sm:inline text-gray-300">|</span>

              <button
                type="button"
                onClick={() => handleDelete(app.id)}
                className="text-red-600 hover:underline cursor-pointer"
              >
                Delete
              </button>
            </>
          ) : (
            <span className="text-green-600 font-medium text-sm">
              Payment Completed ✔
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-8">
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-brand mb-2">
          My Membership Applications
        </h2>

        <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
          View and manage your submitted memberships.
        </p>

        {loading && <p className="text-sm sm:text-base">Loading...</p>}

        {!loading && error && (
          <p className="text-sm sm:text-base text-red-600">{error}</p>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="border border-dashed border-gray-300 rounded-xl p-6 sm:p-8 text-center text-sm sm:text-base text-gray-500">
            No membership applications found.
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="space-y-8">
            {/* Unpaid / Action Required */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Payment Required
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  New applications waiting for payment.
                </p>
              </div>

              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total unpaid membership amount</p>
                    <p className="text-2xl font-bold text-green-700">
                      ${totalUnpaidAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {unpaidItems.length} unpaid membership
                      {unpaidItems.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCommonPayment}
                    disabled={!unpaidItems.length}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold transition"
                  >
                    Pay Total Amount
                  </button>
                </div>
              </div>

              {unpaidItems.length > 0 ? (
                <div className="space-y-4">
                  {unpaidItems.map((app) => renderMembershipCard(app, false))}
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-500">
                  No unpaid applications.
                </div>
              )}
            </div>

            {/* Paid / Active */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Active Memberships
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Paid memberships currently active under your account.
                </p>
              </div>

              {paidItems.length > 0 ? (
                <div className="space-y-4">
                  {paidItems.map((app) => renderMembershipCard(app, true))}
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-500">
                  No active memberships yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
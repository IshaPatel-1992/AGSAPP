import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaFileAlt,
  FaHome,
  FaPlusCircle,
  FaSignOutAlt,
  FaTicketAlt,
  FaUserFriends,
} from "react-icons/fa";

import MyMemberships from "../components/MyMemberships";
import MyEventTickets from "../components/MyEventTickets";
import PaymentTermsNotice from "../components/PaymentTermsNotice";
import { msalInstance } from "../auth/msalConfig";
import { api } from "../api";

export default function MembershipDashboard() {
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [membershipOptions, setMembershipOptions] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [typesError, setTypesError] = useState("");

  const [pendingBookings, setPendingBookings] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);

  useEffect(() => {
    const loadMember = () => {
      try {
        const savedMember = localStorage.getItem("member");

        if (!savedMember) {
          navigate("/login");
          return;
        }

        setMember(JSON.parse(savedMember));
      } catch (error) {
        console.error("Failed to parse member:", error);
        localStorage.removeItem("member");
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
    const loadPendingBookings = async () => {
      if (!member?.id && !member?.email) return;

      try {
        setLoadingPending(true);

        const result = await api.post("getPendingEventBookings.php", {
          member_id: member?.id,
          email: member?.email,
        });

        if (result?.success) {
          setPendingBookings(result.data || []);
        } else {
          setPendingBookings([]);
        }
      } catch (error) {
        console.error("Pending bookings error:", error);
        setPendingBookings([]);
      } finally {
        setLoadingPending(false);
      }
    };

    loadPendingBookings();
  }, [member]);

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

  const handleNewMembership = (membership) => {
    navigate("/membershipform", {
      state: {
        selectedMembership: membership,
        membershipType: membership.name,
      },
    });
  };

  const handleResumePayment = (booking) => {
    let selectedPeople = {};

    try {
      selectedPeople = booking.selected_people_json
        ? JSON.parse(booking.selected_people_json)
        : {};
    } catch {
      selectedPeople = {};
    }

    const bookingData = {
      event_id: booking.event_id,
      booking_type: booking.booking_type,
      membership_application_id: booking.membership_application_id,
      member_id: booking.member_id,

      buyer_name: booking.buyer_name,
      buyer_email: booking.buyer_email,
      buyer_phone: booking.buyer_phone,

      adult_qty: booking.adult_qty,
      child_qty: booking.child_qty,
      student_qty: booking.student_qty,
      senior_qty: booking.senior_qty,

      adult_price: booking.adult_price,
      child_price: booking.child_price,
      student_price: booking.student_price,
      senior_price: booking.senior_price,

      total_tickets: booking.total_tickets,
      total_amount: booking.subtotal_amount || booking.total_amount,

      selected_people: selectedPeople,
    };

    sessionStorage.setItem("eventBookingData", JSON.stringify(bookingData));

    navigate(`/events/${booking.event_id}/payment`);
  };

  const handleDeletePendingBooking = async (booking) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this pending booking?"
    );

    if (!confirmed) return;

    try {
      const result = await api.post("deletePendingEventBooking.php", {
        booking_id: booking.id,
        member_id: member?.id,
        email: member?.email,
      });

      if (result?.success) {
        setPendingBookings((prev) =>
          prev.filter((item) => item.id !== booking.id)
        );
      } else {
        alert(result?.message || "Unable to delete booking.");
      }
    } catch (error) {
      console.error("Delete pending booking error:", error);
      alert("Something went wrong while deleting booking.");
    }
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
    <section className="min-h-screen bg-[#fdf6ef] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#d4503e] via-[#e66a3d] to-[#f59e0b] p-6 text-white shadow-lg md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
                Airdrie Gujarati Samaj
              </p>

              <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
                Welcome{member?.full_name ? `, ${member.full_name}` : ""}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 md:text-base">
                Manage your memberships, event tickets, applications, and AGS
                bookings from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 px-5 py-3 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/25 lg:w-auto"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl bg-white p-4 shadow-md">
            <div className="mb-4 rounded-2xl bg-[#fdf6ef] p-4">
              <p className="text-sm font-semibold text-gray-500">
                Signed in as
              </p>
              <p className="mt-1 font-bold text-gray-900">
                {member?.full_name || "AGS Member"}
              </p>
              <p className="mt-1 break-all text-sm text-gray-600">
                {member?.email}
              </p>
            </div>

            <nav className="space-y-2">
              <SidebarButton
                icon={<FaHome />}
                label="Overview"
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
              />

              <SidebarButton
                icon={<FaUserFriends />}
                label="My Memberships"
                active={activeTab === "memberships"}
                onClick={() => setActiveTab("memberships")}
              />

              <SidebarButton
                icon={<FaTicketAlt />}
                label="My Event Tickets"
                active={activeTab === "tickets"}
                onClick={() => setActiveTab("tickets")}
              />

              <SidebarButton
                icon={<FaPlusCircle />}
                label="New Membership"
                active={activeTab === "new-membership"}
                onClick={() => setActiveTab("new-membership")}
              />

              <SidebarButton
                icon={<FaCalendarAlt />}
                label="Book Events"
                active={false}
                onClick={() => navigate("/events")}
              />
            </nav>
          </aside>

          <main className="min-w-0">
            {activeTab === "overview" && (
              <DashboardPanel
                title="Dashboard Overview"
                subtitle="Please complete or delete pending event payments before starting a new booking."
              >
                <PendingEventPayments
                  bookings={pendingBookings}
                  loading={loadingPending}
                  onResume={handleResumePayment}
                  onDelete={handleDeletePendingBooking}
                />

                <h3 className="mb-4 mt-8 text-lg font-extrabold text-gray-900">
                  Quick Actions
                </h3>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <QuickCard
                    icon={<FaUserFriends />}
                    title="Memberships"
                    text="View your submitted and active membership applications."
                    buttonText="View"
                    onClick={() => setActiveTab("memberships")}
                  />

                  <QuickCard
                    icon={<FaTicketAlt />}
                    title="Tickets"
                    text="Download your paid AGS event tickets anytime."
                    buttonText="Download"
                    onClick={() => setActiveTab("tickets")}
                  />

                  <QuickCard
                    icon={<FaPlusCircle />}
                    title="New Application"
                    text="Start another family, single, student, or senior membership."
                    buttonText="Start"
                    onClick={() => setActiveTab("new-membership")}
                  />

                  <QuickCard
                    icon={<FaCalendarAlt />}
                    title="Events"
                    text="Book upcoming AGS events using member pricing."
                    buttonText="Book Now"
                    onClick={() => navigate("/events")}
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-5">
                  <div className="flex items-start gap-3">
                    <FaFileAlt className="mt-1 text-[#d4503e]" />
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Helpful Reminder
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-gray-700">
                        After a successful event payment, your ticket will be
                        emailed and also available here under My Event Tickets.
                      </p>
                    </div>
                  </div>
                </div>
              </DashboardPanel>
            )}

            {activeTab === "memberships" && (
              <DashboardPanel
                title="My Memberships"
                subtitle="View your membership applications and family member details."
              >
                <MyMemberships />
              </DashboardPanel>
            )}

            {activeTab === "tickets" && (
              <DashboardPanel
                title="My Event Tickets"
                subtitle="Download your confirmed AGS event tickets."
              >
                <MyEventTickets />
              </DashboardPanel>
            )}

            {activeTab === "new-membership" && (
              <DashboardPanel
                title="Start New Membership Application"
                subtitle="Choose a membership type and continue to the application form."
              >
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

                {!loadingTypes &&
                  !typesError &&
                  membershipOptions.length === 0 && (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-600">
                      No membership types are available right now.
                    </div>
                  )}

                {!loadingTypes &&
                  !typesError &&
                  membershipOptions.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {membershipOptions.map((item) => (
                        <MembershipTypeCard
                          key={item.id}
                          item={item}
                          onClick={() => handleNewMembership(item)}
                        />
                      ))}
                    </div>
                  )}
              </DashboardPanel>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
        active
          ? "bg-[#d4503e] text-white shadow"
          : "text-gray-700 hover:bg-[#fdf6ef] hover:text-[#d4503e]"
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </button>
  );
}

function DashboardPanel({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-md md:p-7">
      <div className="mb-6 border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-extrabold text-[#d4503e]">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}

function QuickCard({ icon, title, text, buttonText, onClick }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fdf6ef] text-xl text-[#d4503e]">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      <p className="mt-2 min-h-[60px] text-sm leading-6 text-gray-600">
        {text}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 w-full rounded-xl bg-[#d4503e] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#bb4332]"
      >
        {buttonText}
      </button>
    </div>
  );
}

function MembershipTypeCard({ item, onClick }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 h-2 w-full rounded-full bg-yellow-500" />

      <h3 className="mb-2 text-xl font-bold text-gray-900">{item.name}</h3>

      <p className="mb-4 text-sm leading-6 text-gray-600">
        {item.description}
      </p>

      {item.is_discount_active && (
        <div className="mb-3">
          <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
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

              <div className="inline-block rounded-full bg-green-100 px-4 py-1 font-bold text-green-700">
                ${Number(item.final_price).toFixed(2)}
              </div>
            </>
          ) : (
            <div className="inline-block rounded-full bg-green-100 px-4 py-1 font-bold text-green-700">
              ${Number(item.base_price).toFixed(2)}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClick}
          className="rounded-lg bg-[#d4503e] px-4 py-2 font-semibold text-white transition hover:bg-[#bb4332]"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function PendingEventPayments({ bookings, loading, onResume, onDelete }) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-orange-200 bg-orange-50 p-5">
        <p className="font-bold text-orange-700">
          Checking pending event payments...
        </p>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50 p-5">
        <h3 className="text-lg font-extrabold text-green-800">
          No Pending Event Payments
        </h3>
        <p className="mt-1 text-sm text-green-700">
          You do not have any unfinished event bookings right now.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border-2 border-orange-300 bg-[#fff7ed] p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-orange-900">
            Action Required: Pending Event Payment
          </h3>
          <p className="mt-1 text-sm text-orange-700">
            Please resume payment or delete the booking if you do not want to
            continue.
          </p>
        </div>

        <span className="w-fit rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white">
          {bookings.length} Pending
        </span>
      </div>

      <div className="space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-lg font-extrabold text-gray-900">
                  {booking.event_title || "AGS Event"}
                </p>

                <div className="mt-2 grid gap-1 text-sm text-gray-600 sm:grid-cols-2">
                  <p>
                    <span className="font-bold">Booking #:</span>{" "}
                    {booking.booking_number}
                  </p>

                  <p>
                    <span className="font-bold">Amount:</span>{" "}
                    ${Number(booking.total_amount || 0).toFixed(2)}
                  </p>

                  {booking.event_date && (
                    <p>
                      <span className="font-bold">Date:</span>{" "}
                      {booking.event_date}
                    </p>
                  )}

                  {booking.location && (
                    <p>
                      <span className="font-bold">Location:</span>{" "}
                      {booking.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row lg:min-w-[300px]">
                <button
                  type="button"
                  onClick={() => onResume(booking)}
                  className="flex-1 rounded-xl bg-[#d4503e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#bb4332]"
                >
                  Resume Payment
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(booking)}
                  className="flex-1 rounded-xl border border-red-300 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
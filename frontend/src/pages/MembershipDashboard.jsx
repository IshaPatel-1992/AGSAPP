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

  useEffect(() => {
    const loadMember = () => {
      try {
        const savedMember = localStorage.getItem("member");

        if (!savedMember) {
          setMember(null);
          navigate("/login");
          return;
        }

        const account = JSON.parse(savedMember);
        if (!account || typeof account !== "object" || Array.isArray(account) ||
            !Number.isInteger(Number(account.id)) || Number(account.id) <= 0) {
          setMember(null);
          navigate("/login", { replace: true });
          return;
        }
        setMember(account);
      } catch (error) {
        console.error("Failed to parse member:", error);
        setMember(null);
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

  if (!member) return null;

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
                Manage your AGS memberships and applications. Visit our Events page
                to book tickets through Ticket Tailor.
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
                label="Ticket Information"
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
                subtitle="Manage your membership here and book event tickets through our Events page."
              >
                <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                  <h3 className="font-bold text-green-800">Event Booking through Ticket Tailor</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-700">Visit our Events page for Diwali and Christmas party details, individual tickets, combos and free child registration. Choose your booking option there to continue to Ticket Tailor.</p>
                  <button type="button" onClick={() => navigate("/events")} className="mt-4 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800">View Events & Book Tickets</button>
                </div>

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
                    title="Ticket Information"
                    text="Find out how to access tickets from your booking confirmation email."
                    buttonText="View Information"
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
                    text="View parties, ticket prices and member booking options on our Events page."
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
                        Tickets for bookings made through Ticket Tailor are accessed
                        from your booking confirmation email. These tickets are
                        not displayed in this dashboard. Check the inbox and spam
                        folder for the email address used when booking.
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
                title="Ticket Information"
                subtitle="Your Ticket Tailor bookings and tickets are separate from your AGS membership dashboard."
              >
                <div className="space-y-5 text-sm leading-7 text-gray-700">
                  <section className="rounded-2xl bg-orange-50 p-5">
                    <h3 className="text-lg font-bold text-gray-900">How to Book</h3>
                    <p className="mt-2">Open our Events page, review the party dates and venues, then choose member or non-member booking. Ticket selection and checkout take place on Ticket Tailor.</p>
                    <button type="button" onClick={() => navigate("/events")} className="mt-4 rounded-xl bg-[#d4503e] px-5 py-3 font-bold text-white hover:bg-[#bb4332]">View Events & Book Tickets</button>
                  </section>
                  <section className="rounded-2xl border border-gray-200 p-5">
                    <h3 className="text-lg font-bold text-gray-900">Already Booked?</h3>
                    <p className="mt-2">Use the ticket link in the Ticket Tailor confirmation email sent to the address used for your booking. Check your spam or junk folder if you cannot find it.</p>
                    <p className="mt-2">For a Diwali and Christmas combo, use the ticket for the correct party. Every child under 10 must also be registered for each party they attend.</p>
                    <p className="mt-2">If you still need help, contact <a href="mailto:info@airdriegujaratisamaj.ca" className="break-words font-semibold text-[#d4503e] underline">info@airdriegujaratisamaj.ca</a> with your booking name, booking email and order reference if available.</p>
                  </section>
                </div>
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


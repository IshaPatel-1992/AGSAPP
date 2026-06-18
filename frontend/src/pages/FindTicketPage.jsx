import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { API_BASE_URL } from "../config";

export default function FindTicketPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleMemberTicketsClick = () => {
    const member = localStorage.getItem("member");

    if (member) {
      navigate("/membershipdashboard");
    } else {
      navigate("/login", {
        state: {
          redirectTo: "/membershipdashboard",
        },
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!email.trim() || !phone.trim()) {
      alert("Please enter email and phone number.");
      return;
    }

    setLoading(true);
    setSearched(false);
    setTickets([]);

    try {
      const result = await api.post("findNonMemberTickets.php", {
        email: email.trim(),
        phone: phone.trim(),
      });

      setTickets(result?.success && Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error(err);
      setTickets([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const buildPdfUrl = (bookingId) => {
    const base = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
    return `${base}downloadEventTicketPdf.php?booking_id=${bookingId}`;
  };

  return (
    <section className="min-h-screen bg-[#fdf6ef] px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-white p-6 shadow md:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
            Non-Member Ticket Lookup
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#d4503e]">
            Download Your Event Ticket
          </h1>

          <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-medium text-orange-900">
              This page is for <strong>Non-Member Event Bookings</strong> only.
            </p>

            <p className="mt-1 text-sm text-orange-700">
              AGS Members can sign in and view tickets from their member dashboard.
            </p>

            <button
              type="button"
              onClick={handleMemberTicketsClick}
              className="mt-4 rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              Member? View My Tickets
            </button>
          </div>

          <p className="mt-4 text-gray-600">
            Non-members can enter the same email address and phone number used
            during booking to retrieve and download the ticket PDF.
          </p>

          <form onSubmit={handleSearch} className="mt-6 grid gap-4 md:grid-cols-2">
            <InputField label="Email" type="email" value={email} onChange={setEmail} />
            <InputField label="Phone" value={phone} onChange={setPhone} />

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 rounded-xl bg-[#d4503e] px-5 py-3 font-bold text-white transition hover:bg-[#bb4332] disabled:opacity-60"
            >
              {loading ? "Searching..." : "Find Non-Member Tickets"}
            </button>
          </form>

          {searched && !tickets.length && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              No paid non-member tickets found with this email and phone number.
            </div>
          )}

          {!!tickets.length && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Your Non-Member Tickets
              </h2>

              {tickets.map((ticket) => (
                <div key={ticket.booking_id} className="rounded-2xl border border-gray-200 p-4">
                  <h3 className="font-bold text-gray-900">
                    {ticket.event_title || "Event Ticket"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Booking #{ticket.booking_id}
                  </p>

                  <p className="text-sm text-gray-600">
                    Total Tickets: {ticket.total_tickets}
                  </p>

                  <p className="text-sm text-gray-600">
                    Amount Paid: ${Number(ticket.total_amount).toFixed(2)}
                  </p>

                  <a
                    href={buildPdfUrl(ticket.booking_id)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block rounded-xl bg-[#d4503e] px-4 py-2 text-sm font-bold text-white hover:bg-[#bb4332]"
                  >
                    Download Ticket PDF
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label} <span className="text-[#d4503e]">*</span>
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#d4503e]"
      />
    </label>
  );
}
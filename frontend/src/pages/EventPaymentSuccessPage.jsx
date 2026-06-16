import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function EventPaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingId = location.state?.booking_id || "";
  const bookingNumber = location.state?.booking_number || "";
  const ticketsCreated = location.state?.tickets_created || 0;
  const buyerName = location.state?.buyer_name || "";
  const buyerEmail = location.state?.buyer_email || "";

  const handleDownloadPdf = () => {
    if (!bookingId) {
      alert("Booking ID not found.");
      return;
    }

    window.open(
      `${process.env.REACT_APP_API_URL}/downloadEventTicketPdf.php?booking_id=${bookingId}`,
      "_blank"
    );
  };

  return (
    <section className="min-h-screen bg-[#fdf6ef] px-6 py-12">
      <div className="mx-auto max-w-[800px] rounded-3xl bg-white p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✅
        </div>

        <p className="text-sm font-bold uppercase tracking-wide text-green-600">
          Payment Successful
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-[#d4503e] md:text-4xl">
          Your Picnic Booking is Confirmed!
        </h1>

        <p className="mx-auto mt-4 max-w-[600px] text-gray-600">
          Thank you for booking your AGS event tickets. Your payment was
          completed successfully and your booking has been saved.
        </p>

        <div className="mt-8 rounded-2xl bg-[#fdf6ef] p-5 text-left">
          <InfoRow label="Booking Number" value={bookingNumber || "N/A"} />
          <InfoRow label="Number of Tickets" value={ticketsCreated || "N/A"} />
          <InfoRow label="Buyer Name" value={buyerName || "N/A"} />
          <InfoRow label="Buyer Email" value={buyerEmail || "N/A"} />
        </div>

        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
          <p className="font-semibold text-green-700">
            Your tickets are confirmed.
          </p>
          <p className="mt-1 text-sm text-green-700">
            Please keep your booking number for event check-in.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="rounded-xl bg-[#d4503e] px-6 py-3 font-bold text-white transition hover:bg-[#bb4332]"
          >
            Download Ticket PDF
          </button>

          <button
            type="button"
            onClick={() => navigate("/events")}
            className="rounded-xl border border-[#d4503e] px-6 py-3 font-bold text-[#d4503e] transition hover:bg-[#fdf6ef]"
          >
            Back to Events
          </button>

          <Link
            to="/membershipdashboard"
            className="rounded-xl border border-gray-300 px-6 py-3 font-bold text-gray-700 transition hover:bg-gray-50"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col border-b border-orange-100 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-semibold text-gray-600">{label}</span>
      <span className="mt-1 font-bold text-gray-900 sm:mt-0">{value}</span>
    </div>
  );
}
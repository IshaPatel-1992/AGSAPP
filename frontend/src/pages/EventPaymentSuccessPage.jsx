import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function EventPaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const savedSuccess = JSON.parse(
    sessionStorage.getItem("eventPaymentSuccess") || "{}"
  );

  const bookingId = location.state?.booking_id || savedSuccess.booking_id || "";
  const bookingNumber =
    location.state?.booking_number || savedSuccess.booking_number || "";
  const ticketsCreated =
    location.state?.tickets_created || savedSuccess.tickets_created || 0;
  const buyerName = location.state?.buyer_name || savedSuccess.buyer_name || "";
  const buyerEmail =
    location.state?.buyer_email || savedSuccess.buyer_email || "";

  const paymentType =
    location.state?.payment_type || savedSuccess.payment_type || "paid";

  const isFreeBooking = paymentType === "free";

  const handleDownloadPdf = async () => {
    if (!bookingId) {
      alert("Booking ID not found.");
      return;
    }

    try {
      await fetch(
        `${API_BASE_URL}/generateEventTicketPdf.php?booking_id=${bookingId}`
      );

      window.open(
        `${API_BASE_URL}/downloadEventTicketPdf.php?booking_id=${bookingId}`,
        "_blank"
      );
    } catch (err) {
      console.error("Ticket download error:", err);
      alert("Unable to download ticket. Please try again.");
    }
  };

  return (
    <section className="min-h-screen bg-[#fdf6ef] px-6 py-12">
      <div className="mx-auto max-w-[800px] rounded-3xl bg-white p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
          ✅
        </div>

        <p className="text-sm font-bold uppercase tracking-wide text-green-600">
          {isFreeBooking ? "Free Booking Confirmed" : "Payment Successful"}
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-[#d4503e] md:text-4xl">
          Your Picnic Booking is Confirmed!
        </h1>

        <p className="mx-auto mt-4 max-w-[600px] text-gray-600">
          {isFreeBooking
            ? "Thank you for booking your AGS event tickets. No payment was required for this booking, and your tickets have been generated successfully."
            : "Thank you for booking your AGS event tickets. Your payment was completed successfully and your tickets have been generated successfully."}
        </p>

        <div className="mt-8 rounded-2xl bg-[#fdf6ef] p-5 text-left">
          <InfoRow label="Booking Number" value={bookingNumber || "N/A"} />
          <InfoRow label="Number of Tickets" value={ticketsCreated || "N/A"} />
          <InfoRow label="Buyer Name" value={buyerName || "N/A"} />
          <InfoRow label="Buyer Email" value={buyerEmail || "N/A"} />
          <InfoRow
            label="Booking Status"
            value={isFreeBooking ? "Free Ticket Confirmed" : "Payment Completed"}
          />
          <InfoRow
            label="Payment Status"
            value={isFreeBooking ? "No Payment Required" : "Paid"}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
          <p className="font-semibold text-green-700">
            Your tickets are confirmed.
          </p>
          <p className="mt-1 text-sm text-green-700">
            Please keep your booking number for event check-in.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="rounded-xl bg-[#d4503e] px-6 py-3 font-bold text-white transition hover:bg-[#bb4332]"
          >
            Download Ticket PDF
          </button>

          <Link
            to="/events/find-ticket"
            className="rounded-xl border border-[#d4503e] px-6 py-3 font-bold text-[#d4503e] transition hover:bg-[#fdf6ef]"
          >
            Find My Ticket
          </Link>

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
            Member Dashboard
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
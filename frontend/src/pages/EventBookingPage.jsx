import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EventBookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const handleMemberBooking = () => {
    navigate(`/events/${eventId}/booking/member`);
  };

  const handleNonMemberBooking = () => {
    navigate(`/events/${eventId}/booking/non-member`);
  };

  return (
    <section className="min-h-screen bg-[#fdf6ef] px-6 py-10">
      <div className="mx-auto max-w-[850px]">
        <button
          onClick={() => navigate("/events")}
          className="mb-6 text-sm font-semibold text-[#d4503e]"
        >
          ← Back to Events
        </button>

        <div className="rounded-3xl bg-white p-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
            Event Booking
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#d4503e] md:text-4xl">
            Airdrie Gujarati Samaj Picnic
          </h1>

          <p className="mx-auto mt-4 max-w-[600px] text-gray-600">
            Please select how you would like to continue with your picnic
            booking.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            <button
              onClick={handleMemberBooking}
              className="rounded-2xl border-2 border-[#d4503e] bg-[#fff3ef] p-6 text-left transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-2xl font-bold text-[#d4503e]">
                Member Booking
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Choose this option if you have an active paid AGS membership.
                Member pricing and eligibility will be applied.
              </p>

              <span className="mt-5 inline-block rounded-lg bg-[#d4503e] px-4 py-2 text-sm font-semibold text-white">
                Continue as Member
              </span>
            </button>

            <button
              onClick={handleNonMemberBooking}
              className="rounded-2xl border border-gray-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                Non-Member Booking
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Choose this option if you are not currently an AGS member or are
                booking as a guest.
              </p>

              <span className="mt-5 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
                Continue as Guest
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
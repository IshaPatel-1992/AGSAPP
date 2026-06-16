import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function NonMemberEventBookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [adultQty, setAdultQty] = useState(0);
  const [childQty, setChildQty] = useState(0);
  const [studentQty, setStudentQty] = useState(0);
  const [seniorQty, setSeniorQty] = useState(0);

  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  const prices = {
    adult: 15,
    child: 10,
    student: 12,
    senior: 12,
  };

  const totalAmount = useMemo(() => {
    return (
      adultQty * prices.adult +
      childQty * prices.child +
      studentQty * prices.student +
      seniorQty * prices.senior
    );
  }, [adultQty, childQty, studentQty, seniorQty]);

  const totalTickets = adultQty + childQty + studentQty + seniorQty;

  const handleContinue = () => {
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      alert("Please enter name, email, and phone number.");
      return;
    }

    if (totalTickets === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    const bookingData = {
      event_id: eventId,
      booking_type: "non_member",
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_phone: buyerPhone,
      adult_qty: adultQty,
      child_qty: childQty,
      student_qty: studentQty,
      senior_qty: seniorQty,
      adult_price: prices.adult,
      child_price: prices.child,
      student_price: prices.student,
      senior_price: prices.senior,
      total_tickets: totalTickets,
      total_amount: totalAmount,
    };

    sessionStorage.setItem("eventBookingData", JSON.stringify(bookingData));

    navigate(`/events/${eventId}/payment`);
  };

  return (
    <section className="min-h-screen bg-[#fdf6ef] px-6 py-10">
      <div className="mx-auto max-w-[850px]">
        <button
          onClick={() => navigate(`/events/${eventId}/booking`)}
          className="mb-6 text-sm font-semibold text-[#d4503e]"
        >
          ← Back
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] md:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
            Non-Member Booking
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#d4503e]">
            Picnic Tickets
          </h1>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <InputField
              label="Full Name"
              value={buyerName}
              onChange={setBuyerName}
            />

            <InputField
              label="Email"
              type="email"
              value={buyerEmail}
              onChange={setBuyerEmail}
            />

            <InputField
              label="Phone"
              value={buyerPhone}
              onChange={setBuyerPhone}
            />
          </div>

          <div className="mt-8">
            <TicketCounter
              title="Adult"
              price={prices.adult}
              value={adultQty}
              onMinus={() => setAdultQty((prev) => Math.max(0, prev - 1))}
              onPlus={() => setAdultQty((prev) => prev + 1)}
            />

            <TicketCounter
              title="Child"
              price={prices.child}
              value={childQty}
              onMinus={() => setChildQty((prev) => Math.max(0, prev - 1))}
              onPlus={() => setChildQty((prev) => prev + 1)}
            />

            <TicketCounter
              title="Student"
              price={prices.student}
              value={studentQty}
              onMinus={() => setStudentQty((prev) => Math.max(0, prev - 1))}
              onPlus={() => setStudentQty((prev) => prev + 1)}
            />

            <TicketCounter
              title="Senior"
              price={prices.senior}
              value={seniorQty}
              onMinus={() => setSeniorQty((prev) => Math.max(0, prev - 1))}
              onPlus={() => setSeniorQty((prev) => prev + 1)}
            />
          </div>

          <BookingSummary totalTickets={totalTickets} totalAmount={totalAmount} />

          <button
            onClick={handleContinue}
            className="mt-8 w-full rounded-xl bg-[#d4503e] px-5 py-3 font-bold text-white transition hover:bg-[#bb4332]"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </section>
  );
}

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
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

function TicketCounter({ title, price, value, onMinus, onPlus }) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-2xl border border-gray-200 p-4">
      <div>
        <h3 className="font-bold text-gray-900">{title} Ticket</h3>
        <p className="text-sm text-gray-600">${price.toFixed(2)} each</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onMinus}
          className="h-9 w-9 rounded-full bg-gray-100 text-xl font-bold text-gray-700"
        >
          -
        </button>

        <span className="w-8 text-center font-bold">{value}</span>

        <button
          onClick={onPlus}
          className="h-9 w-9 rounded-full bg-[#d4503e] text-xl font-bold text-white"
        >
          +
        </button>
      </div>
    </div>
  );
}

function BookingSummary({ totalTickets, totalAmount }) {
  return (
    <div className="mt-8 rounded-2xl bg-[#fdf6ef] p-5">
      <div className="flex justify-between text-sm text-gray-700">
        <span>Total Tickets</span>
        <strong>{totalTickets}</strong>
      </div>

      <div className="mt-3 flex justify-between text-xl font-bold text-gray-900">
        <span>Total Amount</span>
        <span>${totalAmount.toFixed(2)}</span>
      </div>
    </div>
  );
}
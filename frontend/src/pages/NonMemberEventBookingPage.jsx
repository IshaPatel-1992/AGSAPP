import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const INITIAL_ATTENDEES = {
  adult: [],
  child: [],
  student: [],
  senior: [],
};

export default function NonMemberEventBookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [noOnionNoGarlicQty, setNoOnionNoGarlicQty] = useState(0);

  const [adultQty, setAdultQty] = useState(0);
  const [childQty, setChildQty] = useState(0);
  const [studentQty, setStudentQty] = useState(0);
  const [seniorQty, setSeniorQty] = useState(0);

  const [buyerFirstName, setBuyerFirstName] = useState("");
  const [buyerLastName, setBuyerLastName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  const [attendees, setAttendees] = useState(INITIAL_ATTENDEES);

  const prices = {
    adult: 25,
    child: 0,
    student: 25,
    senior: 25,
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

  const updateQty = (type, newQty) => {
    const qty = Math.max(0, newQty);

    if (type === "adult") setAdultQty(qty);
    if (type === "child") setChildQty(qty);
    if (type === "student") setStudentQty(qty);
    if (type === "senior") setSeniorQty(qty);

    setAttendees((prev) => {
      const current = prev[type] || [];
      const updated = [...current];

      if (qty > updated.length) {
        while (updated.length < qty) {
          updated.push({ first_name: "", last_name: "" });
        }
      } else {
        updated.length = qty;
      }

      return {
        ...prev,
        [type]: updated,
      };
    });
  };

  const updateAttendee = (type, index, field, value) => {
    setAttendees((prev) => {
      const updatedList = [...prev[type]];
      updatedList[index] = {
        ...updatedList[index],
        [field]: value,
      };

      return {
        ...prev,
        [type]: updatedList,
      };
    });
  };

  const validateAttendees = () => {
    const ticketTypes = ["adult", "child", "student", "senior"];

    for (const type of ticketTypes) {
      for (let i = 0; i < attendees[type].length; i++) {
        const person = attendees[type][i];

        if (!person.first_name.trim()) {
          alert(`Please enter first name for ${formatTicketTitle(type)} ${i + 1}.`);
          return false;
        }

        if (type !== "child" && !person.last_name.trim()) {
          alert(`Please enter last name for ${formatTicketTitle(type)} ${i + 1}.`);
          return false;
        }
      }
    }

    return true;
  };

  const handleContinue = () => {
    if (
      !buyerFirstName.trim() ||
      !buyerLastName.trim() ||
      !buyerEmail.trim() ||
      !buyerPhone.trim()
    ) {
      alert("Please enter buyer first name, last name, email, and phone number.");
      return;
    }

    if (totalTickets === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    if (!validateAttendees()) {
      return;
    }

    const bookingData = {
      event_id: eventId,
      booking_type: "non_member",

      buyer_first_name: buyerFirstName.trim(),
      buyer_last_name: buyerLastName.trim(),
      buyer_name: `${buyerFirstName.trim()} ${buyerLastName.trim()}`,
      buyer_email: buyerEmail.trim(),
      buyer_phone: buyerPhone.trim(),

      adult_qty: adultQty,
      child_qty: childQty,
      student_qty: studentQty,
      senior_qty: seniorQty,

      no_onion_no_garlic_qty: noOnionNoGarlicQty,

      adult_price: prices.adult,
      child_price: prices.child,
      student_price: prices.student,
      senior_price: prices.senior,

      attendees,
      selected_people: attendees,

      total_tickets: totalTickets,
      total_amount: totalAmount,
      
    };

    sessionStorage.setItem(
      "eventBookingData",
      JSON.stringify(bookingData)
    );

    navigate(`/events/${eventId}/payment`);
  };

  return (
    <section className="min-h-screen bg-[#fdf6ef] px-6 py-10">
      <div className="mx-auto max-w-[900px]">
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

          <p className="mt-2 text-sm text-gray-600">
            Please enter buyer details and attendee names for individual ticket generation.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="Buyer First Name"
              value={buyerFirstName}
              onChange={setBuyerFirstName}
            />

            <InputField
              label="Buyer Last Name"
              value={buyerLastName}
              onChange={setBuyerLastName}
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
              onMinus={() => updateQty("adult", adultQty - 1)}
              onPlus={() => updateQty("adult", adultQty + 1)}
            />

            <TicketCounter
              title="Child Under 10"
              price={prices.child}
              value={childQty}
              onMinus={() => updateQty("child", childQty - 1)}
              onPlus={() => updateQty("child", childQty + 1)}
            />

            <TicketCounter
              title="Student"
              price={prices.student}
              value={studentQty}
              onMinus={() => updateQty("student", studentQty - 1)}
              onPlus={() => updateQty("student", studentQty + 1)}
            />

            <TicketCounter
              title="Senior"
              price={prices.senior}
              value={seniorQty}
              onMinus={() => updateQty("senior", seniorQty - 1)}
              onPlus={() => updateQty("senior", seniorQty + 1)}
            />
          </div>

          {totalTickets > 0 && (
            <AttendeeSection
              attendees={attendees}
              updateAttendee={updateAttendee}
            />
          )}

          <FoodPreferenceCounter
            value={noOnionNoGarlicQty}
            max={totalTickets}
            onMinus={() => setNoOnionNoGarlicQty((prev) => Math.max(0, prev - 1))}
            onPlus={() =>
              setNoOnionNoGarlicQty((prev) => Math.min(totalTickets, prev + 1))
            }
          />

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

function InputField({ label, value, onChange, type = "text", required = true }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-[#d4503e]">*</span>}
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
          type="button"
          onClick={onMinus}
          className="h-9 w-9 rounded-full bg-gray-100 text-xl font-bold text-gray-700"
        >
          -
        </button>

        <span className="w-8 text-center font-bold">{value}</span>

        <button
          type="button"
          onClick={onPlus}
          className="h-9 w-9 rounded-full bg-[#d4503e] text-xl font-bold text-white"
        >
          +
        </button>
      </div>
    </div>
  );
}

function AttendeeSection({ attendees, updateAttendee }) {
  return (
    <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50/40 p-5">
      <h2 className="text-xl font-bold text-gray-900">Attendee Details</h2>
      <p className="mt-1 text-sm text-gray-600">
        Each attendee will receive an individual ticket.
      </p>

      <AttendeeGroup
        type="adult"
        title="Adult"
        attendees={attendees.adult}
        updateAttendee={updateAttendee}
      />

      <AttendeeGroup
        type="child"
        title="Child Under 10"
        attendees={attendees.child}
        updateAttendee={updateAttendee}
        childNote="Last name is optional for children."
      />

      <AttendeeGroup
        type="student"
        title="Student"
        attendees={attendees.student}
        updateAttendee={updateAttendee}
      />

      <AttendeeGroup
        type="senior"
        title="Senior"
        attendees={attendees.senior}
        updateAttendee={updateAttendee}
      />
    </div>
  );
}

function FoodPreferenceCounter({ value, max, onMinus, onPlus }) {
  return (
    <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">
      <h3 className="font-bold text-gray-900">
        Food Preference
      </h3>

      <p className="mt-1 text-sm text-gray-600">
        How many people need No Onion / No Garlic food?
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          No Onion / No Garlic
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMinus}
            disabled={value <= 0}
            className="h-9 w-9 rounded-full bg-gray-100 text-xl font-bold text-gray-700 disabled:opacity-40"
          >
            -
          </button>

          <span className="w-8 text-center font-bold">{value}</span>

          <button
            type="button"
            onClick={onPlus}
            disabled={value >= max || max === 0}
            className="h-9 w-9 rounded-full bg-[#d4503e] text-xl font-bold text-white disabled:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Maximum allowed: {max}
      </p>
    </div>
  );
}

function AttendeeGroup({
  type,
  title,
  attendees,
  updateAttendee,
  childNote = "",
}) {
  if (!attendees.length) return null;

  return (
    <div className="mt-6">
      <h3 className="mb-3 font-bold text-[#d4503e]">{title} Attendees</h3>

      <div className="grid gap-4">
        {attendees.map((person, index) => (
          <div
            key={`${type}-${index}`}
            className="rounded-2xl bg-white p-4 shadow-sm"
          >
            <p className="mb-3 text-sm font-bold text-gray-800">
              {title} {index + 1}
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                label="First Name"
                value={person.first_name}
                onChange={(value) =>
                  updateAttendee(type, index, "first_name", value)
                }
              />

              <InputField
                label="Last Name"
                value={person.last_name}
                required={type !== "child"}
                onChange={(value) =>
                  updateAttendee(type, index, "last_name", value)
                }
              />
            </div>

            {childNote && (
              <p className="mt-2 text-xs text-gray-500">{childNote}</p>
            )}
          </div>
        ))}
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

function formatTicketTitle(type) {
  const labels = {
    adult: "Adult",
    child: "Child Under 10",
    student: "Student",
    senior: "Senior",
  };

  return labels[type] || type;
}
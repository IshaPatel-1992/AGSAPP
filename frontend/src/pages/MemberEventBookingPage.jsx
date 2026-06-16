import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

export default function MemberEventBookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [membership, setMembership] = useState(null);

  const [prices, setPrices] = useState({
  adult: 0,
  child: 0,
  student: 0,
  senior: 0,
});

  const [limits, setLimits] = useState({
    adult: 0,
    child: 0,
    student: 0,
    senior: 0,
  });

  const [people, setPeople] = useState({
    adult: [],
    child: [],
    student: [],
    senior: [],
  });

  const [adultQty, setAdultQty] = useState(0);
  const [childQty, setChildQty] = useState(0);
  const [studentQty, setStudentQty] = useState(0);
  const [seniorQty, setSeniorQty] = useState(0);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const savedMember = localStorage.getItem("member");

        if (!savedMember) {
          navigate("/login", {
            state: {
              message: "Please login to continue member booking.",
              redirectTo: `/events/${eventId}/booking/member`,
            },
            replace: true,
          });
          return;
        }

        const parsedMember = JSON.parse(savedMember);

        const result = await api.post("getMyEventEligibility.php", {
          event_id: eventId,
          member_id: parsedMember.id,
          email: parsedMember.email,
        });

        if (!result?.success) {
          setError(result?.message || "Unable to check membership eligibility.");
          return;
        }

        setMembership(result.membership);
        setPrices(
  result.prices || {
    adult: 0,
    child: 0,
    student: 0,
    senior: 0,
  }
);
        setLimits(result.limits || limits);
        setPeople(
          result.people || {
            adult: [],
            child: [],
            student: [],
            senior: [],
          }
        );
      } catch (err) {
        console.error("Eligibility error:", err);
        setError("Could not connect to backend.");
      } finally {
        setLoading(false);
      }
    };

    checkEligibility();
  }, [eventId, navigate]);

  const totalAmount = useMemo(() => {
    return (
      adultQty * Number(prices.adult || 0) +
      childQty * Number(prices.child || 0) +
      studentQty * Number(prices.student || 0) +
      seniorQty * Number(prices.senior || 0)
    );
  }, [adultQty, childQty, studentQty, seniorQty, prices]);

  const totalTickets = adultQty + childQty + studentQty + seniorQty;

  const selectedPeople = useMemo(() => {
    return {
      adult: people.adult.slice(0, adultQty),
      child: people.child.slice(0, childQty),
      student: people.student.slice(0, studentQty),
      senior: people.senior.slice(0, seniorQty),
    };
  }, [people, adultQty, childQty, studentQty, seniorQty]);

  const handleContinue = () => {
    if (totalTickets === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    const bookingData = {
      event_id: eventId,
      booking_type: "member",
      membership_application_id: membership?.application_id,
      membership_type: membership?.membership_type,
      buyer_name: membership?.main_contact_name,
      buyer_email: membership?.email,
      buyer_phone: membership?.phone,

      adult_qty: adultQty,
      child_qty: childQty,
      student_qty: studentQty,
      senior_qty: seniorQty,

      adult_price: Number(prices.adult || 0),
      child_price: Number(prices.child || 0),
      student_price: Number(prices.student || 0),
      senior_price: Number(prices.senior || 0),

      selected_people: selectedPeople,
      total_tickets: totalTickets,
      total_amount: totalAmount,
    };

    sessionStorage.setItem("eventBookingData", JSON.stringify(bookingData));

    navigate(`/events/${eventId}/payment`);
  };

  if (loading) {
    return <p className="px-6 py-10 text-center">Checking membership...</p>;
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[#fdf6ef] px-6 py-10">
        <div className="mx-auto max-w-[700px] rounded-3xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-[#d4503e]">
            Member Booking Not Available
          </h1>

          <p className="mt-4 text-gray-600">{error}</p>

          <button
            onClick={() => navigate(`/events/${eventId}/booking`)}
            className="mt-6 rounded-lg bg-[#d4503e] px-5 py-2 font-semibold text-white"
          >
            Go Back
          </button>
        </div>
      </section>
    );
  }

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
            Member Booking
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#d4503e]">
            Picnic Tickets
          </h1>

          <div className="mt-5 rounded-2xl bg-[#fdf6ef] p-5">
            <p className="font-bold text-gray-900">
              Membership Type: {membership?.membership_type}
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Booking for: {membership?.main_contact_name}
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Email: {membership?.email}
            </p>
          </div>

          <div className="mt-8">
            <TicketCounter
              title="Adult"
              price={prices.adult}
              value={adultQty}
              max={limits.adult}
              names={people.adult}
              selectedCount={adultQty}
              onMinus={() => setAdultQty((prev) => Math.max(0, prev - 1))}
              onPlus={() =>
                setAdultQty((prev) =>
                  Math.min(Number(limits.adult || 0), prev + 1)
                )
              }
            />

            <TicketCounter
              title="Kid Under 10"
              price={prices.child}
              value={childQty}
              max={limits.child}
              names={people.child}
              selectedCount={childQty}
              onMinus={() => setChildQty((prev) => Math.max(0, prev - 1))}
              onPlus={() =>
                setChildQty((prev) =>
                  Math.min(Number(limits.child || 0), prev + 1)
                )
              }
            />

            <TicketCounter
              title="Student"
              price={prices.student}
              value={studentQty}
              max={limits.student}
              names={people.student}
              selectedCount={studentQty}
              onMinus={() => setStudentQty((prev) => Math.max(0, prev - 1))}
              onPlus={() =>
                setStudentQty((prev) =>
                  Math.min(Number(limits.student || 0), prev + 1)
                )
              }
            />

            <TicketCounter
              title="Senior"
              price={prices.senior}
              value={seniorQty}
              max={limits.senior}
              names={people.senior}
              selectedCount={seniorQty}
              onMinus={() => setSeniorQty((prev) => Math.max(0, prev - 1))}
              onPlus={() =>
                setSeniorQty((prev) =>
                  Math.min(Number(limits.senior || 0), prev + 1)
                )
              }
            />
          </div>

          <BookingSummary
            totalTickets={totalTickets}
            totalAmount={totalAmount}
            selectedPeople={selectedPeople}
          />

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

function TicketCounter({
  title,
  price,
  value,
  max,
  names = [],
  selectedCount = 0,
  onMinus,
  onPlus,
}) {
  const isDisabled = Number(max || 0) === 0;
  const isFree = Number(price || 0) === 0;

  const getNameText = (person) => {
    if (typeof person === "string") return person;
    return person?.name || "";
  };

  return (
    <div
      className={`mb-4 rounded-2xl border p-4 ${
        isDisabled ? "border-gray-100 bg-gray-50 opacity-60" : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900">{title} Ticket</h3>

          <p className="text-sm text-gray-600">
            {isFree ? "Free" : `$${Number(price || 0).toFixed(2)} each`}
          </p>

          <p className="mt-1 text-xs text-gray-500">Allowed: {max}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onMinus}
            disabled={isDisabled || value <= 0}
            className="h-9 w-9 rounded-full bg-gray-100 text-xl font-bold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            -
          </button>

          <span className="w-8 text-center font-bold">{value}</span>

          <button
            onClick={onPlus}
            disabled={isDisabled || value >= Number(max || 0)}
            className="h-9 w-9 rounded-full bg-[#d4503e] text-xl font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      {names.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Member Names
          </p>

          <div className="flex flex-wrap gap-2">
            {names.map((person, index) => {
              const name = getNameText(person);
              const isSelected = index < selectedCount;

              return (
                <span
                  key={`${name}-${index}`}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isSelected
                      ? "bg-[#d4503e] text-white"
                      : "bg-[#fdf6ef] text-[#d4503e]"
                  }`}
                >
                  {name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function BookingSummary({ totalTickets, totalAmount, selectedPeople }) {
  const hasSelectedPeople =
    selectedPeople.adult.length > 0 ||
    selectedPeople.child.length > 0 ||
    selectedPeople.student.length > 0 ||
    selectedPeople.senior.length > 0;

  const getNameText = (person) => {
    if (typeof person === "string") return person;
    return person?.name || "";
  };

  return (
    <div className="mt-8 rounded-2xl bg-[#fdf6ef] p-5">
      <div className="flex justify-between text-sm text-gray-700">
        <span>Total Tickets</span>
        <strong>{totalTickets}</strong>
      </div>

      {hasSelectedPeople && (
        <div className="mt-4 rounded-xl bg-white p-4">
          <p className="mb-3 text-sm font-bold text-gray-900">
            Selected Ticket Holders
          </p>

          {Object.entries(selectedPeople).map(([type, list]) => {
            if (!list.length) return null;

            return (
              <div key={type} className="mb-2 text-sm text-gray-700">
                <strong className="capitalize">{type}:</strong>{" "}
                {list.map(getNameText).join(", ")}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 flex justify-between text-xl font-bold text-gray-900">
        <span>Total Amount</span>
        <span>${Number(totalAmount || 0).toFixed(2)}</span>
      </div>
    </div>
  );
}
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

const EMPTY_GROUPS = {
  adult: [],
  child: [],
  student: [],
  senior: [],
};

const EMPTY_LIMITS = {
  adult: 0,
  child: 0,
  student: 0,
  senior: 0,
};

const EMPTY_PRICES = {
  adult: 0,
  child: 0,
  student: 0,
  senior: 0,
};

export default function MemberEventBookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [noOnionNoGarlicQty, setNoOnionNoGarlicQty] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [membership, setMembership] = useState(null);
  const [prices, setPrices] = useState(EMPTY_PRICES);
  const [limits, setLimits] = useState(EMPTY_LIMITS);
  const [people, setPeople] = useState(EMPTY_GROUPS);

  const [alreadyFullyBooked, setAlreadyFullyBooked] = useState(false);
  const [alreadyBookedPeople, setAlreadyBookedPeople] = useState(EMPTY_GROUPS);
  const [pendingBooking, setPendingBooking] = useState(null);

  const [selectedPeople, setSelectedPeople] = useState(EMPTY_GROUPS);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        setLoading(true);
        setError("");
        setAlreadyFullyBooked(false);
        setPendingBooking(null);

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

        const isFullyBooked = Boolean(result.already_fully_booked);

        setMembership(result.membership || null);
        setPrices(result.prices || EMPTY_PRICES);
        setLimits(result.limits || EMPTY_LIMITS);
        setPeople(result.available_people || result.people || EMPTY_GROUPS);
        setAlreadyBookedPeople(result.already_booked_people || EMPTY_GROUPS);
        setPendingBooking(result.pending_booking || null);
        setAlreadyFullyBooked(isFullyBooked);
        setSelectedPeople(EMPTY_GROUPS);

        if (isFullyBooked) {
          setError(
            result.message ||
              "You have already purchased tickets for all registered members."
          );
        }
      } catch (err) {
        console.error("Eligibility error:", err);
        setError("Could not connect to backend.");
      } finally {
        setLoading(false);
      }
    };

    checkEligibility();
  }, [eventId, navigate]);

  const adultQty = selectedPeople.adult.length;
  const childQty = selectedPeople.child.length;
  const studentQty = selectedPeople.student.length;
  const seniorQty = selectedPeople.senior.length;

  const totalTickets = adultQty + childQty + studentQty + seniorQty;

  const totalAmount = useMemo(() => {
    return (
      adultQty * Number(prices.adult || 0) +
      childQty * Number(prices.child || 0) +
      studentQty * Number(prices.student || 0) +
      seniorQty * Number(prices.senior || 0)
    );
  }, [adultQty, childQty, studentQty, seniorQty, prices]);

  useEffect(() => {
    if (noOnionNoGarlicQty > totalTickets) {
      setNoOnionNoGarlicQty(totalTickets);
    }
  }, [totalTickets, noOnionNoGarlicQty]);

  const availableCount =
    Number(limits.adult || 0) +
    Number(limits.child || 0) +
    Number(limits.student || 0) +
    Number(limits.senior || 0);

  const getPersonKey = (person, index) => {
    if (typeof person === "string") return `${person}-${index}`;
    return person?.id || person?.membership_person_id || person?.name || index;
  };

  const togglePerson = (type, person, index) => {
    const key = getPersonKey(person, index);

    setSelectedPeople((prev) => {
      const currentList = prev[type] || [];

      const alreadySelected = currentList.some(
        (item, itemIndex) => getPersonKey(item, itemIndex) === key
      );

      if (alreadySelected) {
        return {
          ...prev,
          [type]: currentList.filter(
            (item, itemIndex) => getPersonKey(item, itemIndex) !== key
          ),
        };
      }

      return {
        ...prev,
        [type]: [...currentList, person],
      };
    });
  };

  const handleContinue = () => {
    if (totalTickets === 0) {
      alert("Please select at least one ticket holder.");
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

      no_onion_no_garlic_qty: noOnionNoGarlicQty,

      adult_price: Number(prices.adult || 0),
      child_price: Number(prices.child || 0),
      student_price: Number(prices.student || 0),
      senior_price: Number(prices.senior || 0),

      selected_people: selectedPeople,
      total_tickets: totalTickets,
      total_amount: totalAmount,
    };

    console.log("Member bookingData:", bookingData);
    sessionStorage.setItem("eventBookingData", JSON.stringify(bookingData));

    navigate(`/events/${eventId}/payment`);
  };

  if (loading) {
    return <p className="px-6 py-10 text-center">Checking membership...</p>;
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[#fdf6ef] px-6 py-10">
        <div className="mx-auto max-w-[760px] rounded-3xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-[#d4503e]">
            {alreadyFullyBooked
              ? "Tickets Already Purchased"
              : "Member Booking Not Available"}
          </h1>

          <p className="mt-4 text-gray-600">{error}</p>

          {alreadyFullyBooked && (
            <>
              <AlreadyBookedPeople people={alreadyBookedPeople} />

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => navigate("/member/mytickets")}
                  className="rounded-lg bg-[#d4503e] px-5 py-2 font-semibold text-white transition hover:bg-[#bb4332]"
                >
                  Go to My Tickets
                </button>

                <button
                  onClick={() =>
                    navigate(`/events/${eventId}/booking/non-member`)
                  }
                  className="rounded-lg border border-[#d4503e] px-5 py-2 font-semibold text-[#d4503e] transition hover:bg-[#fdf6ef]"
                >
                  Buy Non-Member Tickets
                </button>
              </div>
            </>
          )}

          {!alreadyFullyBooked && (
            <button
              onClick={() => navigate(`/events/${eventId}/booking`)}
              className="mt-6 rounded-lg bg-[#d4503e] px-5 py-2 font-semibold text-white"
            >
              Go Back
            </button>
          )}
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

          {pendingBooking && (
            <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
              You have a previous pending booking attempt. You can still book
              available remaining members here. If your payment was already
              completed, please check My Tickets first.
            </div>
          )}

          <AvailableNotice availableCount={availableCount} />

          <div className="mt-8 space-y-5">
            <PersonSelector
              title="Adult"
              type="adult"
              price={prices.adult}
              people={people.adult}
              selectedPeople={selectedPeople.adult}
              onToggle={togglePerson}
            />

            <PersonSelector
              title="Kid Under 10"
              type="child"
              price={prices.child}
              people={people.child}
              selectedPeople={selectedPeople.child}
              onToggle={togglePerson}
            />

            <PersonSelector
              title="Student"
              type="student"
              price={prices.student}
              people={people.student}
              selectedPeople={selectedPeople.student}
              onToggle={togglePerson}
            />

            <PersonSelector
              title="Senior"
              type="senior"
              price={prices.senior}
              people={people.senior}
              selectedPeople={selectedPeople.senior}
              onToggle={togglePerson}
            />
          </div>

          <AlreadyBookedPeople people={alreadyBookedPeople} />

          <FoodPreferenceCounter
            value={noOnionNoGarlicQty}
            max={totalTickets}
            onMinus={() =>
              setNoOnionNoGarlicQty((prev) => Math.max(0, prev - 1))
            }
            onPlus={() =>
              setNoOnionNoGarlicQty((prev) =>
                Math.min(totalTickets, prev + 1)
              )
            }
          />

          <BookingSummary
            totalTickets={totalTickets}
            totalAmount={totalAmount}
            selectedPeople={selectedPeople}
          />

          <button
            onClick={handleContinue}
            disabled={totalTickets === 0}
            className="mt-8 w-full rounded-xl bg-[#d4503e] px-5 py-3 font-bold text-white transition hover:bg-[#bb4332] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </section>
  );
}

function PersonSelector({
  title,
  type,
  price,
  people = [],
  selectedPeople = [],
  onToggle,
}) {
  const isFree = Number(price || 0) === 0;

  const getNameText = (person) => {
    if (typeof person === "string") return person;
    return person?.name || person?.full_name || "";
  };

  const getPersonKey = (person, index) => {
    if (typeof person === "string") return `${person}-${index}`;
    return person?.id || person?.membership_person_id || person?.name || index;
  };

  const isSelected = (person, index) => {
    const key = getPersonKey(person, index);

    return selectedPeople.some(
      (item, itemIndex) => getPersonKey(item, itemIndex) === key
    );
  };

  if (!people?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-gray-900">{title} Tickets</h3>
          <p className="text-sm text-gray-600">
            Select the member name who needs a ticket.
          </p>
        </div>

        <div className="text-sm font-bold text-[#d4503e]">
          {isFree ? "Free" : `$${Number(price || 0).toFixed(2)} each`}
        </div>
      </div>

      <div className="space-y-2">
        {people.map((person, index) => {
          const name = getNameText(person);
          const checked = isSelected(person, index);

          return (
            <label
              key={`${type}-${getPersonKey(person, index)}`}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition ${
                checked
                  ? "border-[#d4503e] bg-[#fff3ef]"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(type, person, index)}
                  className="h-5 w-5 accent-[#d4503e]"
                />

                <span className="font-semibold text-gray-800">{name}</span>
              </div>

              <span className="text-sm font-semibold text-gray-600">
                {isFree ? "Free" : `$${Number(price || 0).toFixed(2)}`}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function FoodPreferenceCounter({ value, max, onMinus, onPlus }) {
  return (
    <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">
      <h3 className="font-bold text-gray-900">Food Preference</h3>

      <p className="mt-1 text-sm text-gray-600">
        How many selected ticket holders need No Onion / No Garlic food?
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

      <p className="mt-2 text-xs text-gray-500">Maximum allowed: {max}</p>
    </div>
  );
}

function AvailableNotice({ availableCount }) {
  if (availableCount <= 0) return null;

  return (
    <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
      You can book tickets for {availableCount} remaining registered member
      {availableCount === 1 ? "" : "s"}.
    </div>
  );
}

function AlreadyBookedPeople({ people }) {
  const hasBooked =
    people.adult?.length > 0 ||
    people.child?.length > 0 ||
    people.student?.length > 0 ||
    people.senior?.length > 0;

  if (!hasBooked) return null;

  const getNameText = (person) => {
    if (typeof person === "string") return person;
    return person?.name || person?.full_name || "";
  };

  return (
    <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left">
      <p className="mb-3 text-sm font-bold text-gray-900">
        Already Purchased Tickets
      </p>

      {Object.entries(people).map(([type, list]) => {
        if (!list?.length) return null;

        const names = list.map(getNameText).filter(Boolean);

        if (!names.length) return null;

        return (
          <div key={type} className="mb-2 text-sm text-gray-700">
            <strong className="capitalize">{type}:</strong> {names.join(", ")}
          </div>
        );
      })}
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
    return person?.name || person?.full_name || "";
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
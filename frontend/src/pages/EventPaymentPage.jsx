import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { api } from "../api";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function EventPaymentPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [error, setError] = useState("");
  const [adminHelp, setAdminHelp] = useState(false);

  useEffect(() => {
    const savedBooking = sessionStorage.getItem("eventBookingData");

    if (!savedBooking) {
      navigate(`/events/${eventId}/booking`);
      return;
    }

    setBookingData(JSON.parse(savedBooking));
  }, [eventId, navigate]);

  const totalAmount = useMemo(() => {
    return Number(bookingData?.total_amount || 0);
  }, [bookingData]);

  const handleCreatePaymentIntent = async () => {
    try {
      setLoadingPayment(true);
      setError("");
      setAdminHelp(false);

      const savedMember = localStorage.getItem("member");
      const parsedMember = savedMember ? JSON.parse(savedMember) : null;

      const result = await api.post("createEventPaymentIntent.php", {
        ...bookingData,
        member_id: parsedMember?.id || bookingData?.member_id || null,
      });

      if (!result?.success) {
        setError(result?.message || "Unable to start payment.");
        setAdminHelp(Boolean(result?.requires_admin));
        return;
      }

      if (result.payment_already_completed) {
        const confirmResult = await api.post("confirmEventPayment.php", {
          booking_id: result.booking_id,
          payment_intent_id: result.paymentIntentId || result.payment_intent_id,
        });

        if (!confirmResult?.success) {
          setError(confirmResult?.message || "Payment completed, but booking confirmation failed. Please contact administrator.");
          setAdminHelp(true);
          return;
        }

        sessionStorage.removeItem("eventBookingData");

        const successData = {
          booking_id: confirmResult.booking_id || result.booking_id,
          booking_number: confirmResult.booking_number || result.booking_number,
          tickets_created: confirmResult.tickets_created || bookingData?.total_tickets || 0,
          buyer_name: confirmResult.buyer_name || bookingData?.buyer_name || "",
          buyer_email: confirmResult.buyer_email || bookingData?.buyer_email || "",
          payment_type: "paid",
        };

        sessionStorage.setItem("eventPaymentSuccess", JSON.stringify(successData));

        navigate(`/events/payment-success`, {
          state: successData,
        });

        return;
      }

      setPaymentInfo(result);
    } catch (err) {
      console.error("Create event payment error:", err);
      setError("Could not connect to payment server.");
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleCreateFreeBooking = async () => {
    try {
      setLoadingPayment(true);
      setError("");
      setAdminHelp(false);

      const result = await api.post("createFreeEventBooking.php", bookingData);

      if (!result?.success) {
        setError(result?.message || "Unable to create free booking.");
        setAdminHelp(Boolean(result?.requires_admin));
        return;
      }

      sessionStorage.removeItem("eventBookingData");

      const successData = {
        booking_id: result.booking_id,
        booking_number: result.booking_number,
        tickets_created: result.tickets_created || bookingData?.total_tickets || 0,
        buyer_name: result.buyer_name || bookingData?.buyer_name || "",
        buyer_email: result.buyer_email || bookingData?.buyer_email || "",
        payment_type: "free",
      };

      sessionStorage.setItem("eventPaymentSuccess", JSON.stringify(successData));

      navigate(`/events/payment-success`, {
        state: successData,
      });
    } catch (err) {
      console.error("Free booking error:", err);
      setError("Could not create free booking.");
    } finally {
      setLoadingPayment(false);
    }
  };

  if (!bookingData) {
    return <p className="px-6 py-10 text-center">Loading payment...</p>;
  }

  return (
    <section className="min-h-screen bg-[#fdf6ef] px-6 py-10">
      <div className="mx-auto max-w-[850px]">
        <button
          onClick={() =>
            navigate(
              bookingData.booking_type === "member"
                ? `/events/${eventId}/booking/member`
                : `/events/${eventId}/booking/non-member`
            )
          }
          className="mb-6 text-sm font-semibold text-[#d4503e]"
        >
          ← Back to Booking
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] md:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
            Payment Summary
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#d4503e]">
            Confirm Picnic Booking
          </h1>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}

              {adminHelp && (
                <button
                  onClick={() => navigate("/contact")}
                  className="mt-4 block rounded-lg bg-red-600 px-4 py-2 text-white"
                >
                  Contact Administrator
                </button>
              )}
            </div>
          )}

          {paymentInfo?.resumed_payment && (
            <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm font-semibold text-orange-800">
              You already had a pending booking. We found your payment session, so you can continue payment below.
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-[#fdf6ef] p-5">
            <p className="font-bold text-gray-900">
              Booking Type:{" "}
              {bookingData.booking_type === "member" ? "Member" : "Non-Member"}
            </p>

            {bookingData.membership_type && (
              <p className="mt-1 text-sm text-gray-600">
                Membership Type: {bookingData.membership_type}
              </p>
            )}

            <p className="mt-1 text-sm text-gray-600">
              Name: {bookingData.buyer_name}
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Email: {bookingData.buyer_email}
            </p>

            {bookingData.buyer_phone && (
              <p className="mt-1 text-sm text-gray-600">
                Phone: {bookingData.buyer_phone}
              </p>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <SummaryRow label="Adult Tickets" qty={bookingData.adult_qty} price={bookingData.adult_price} />
            <SummaryRow label="Kid Under 10 Tickets" qty={bookingData.child_qty} price={bookingData.child_price} />
            <SummaryRow label="Student Tickets" qty={bookingData.student_qty} price={bookingData.student_price} />
            <SummaryRow label="Senior Tickets" qty={bookingData.senior_qty} price={bookingData.senior_price} />
          </div>

          <SelectedPeople selectedPeople={bookingData.selected_people} />

          <div className="mt-8 rounded-2xl border border-gray-200 p-5">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Total Tickets</span>
              <strong>{bookingData.total_tickets}</strong>
            </div>

            <div className="mt-3 flex justify-between text-xl font-bold text-gray-900">
              <span>Ticket Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            {paymentInfo && (
              <>
                <div className="mt-3 flex justify-between text-sm text-gray-700">
                  <span>Processing Fee</span>
                  <strong>${Number(paymentInfo.processingFee || 0).toFixed(2)}</strong>
                </div>

                <div className="mt-3 flex justify-between text-2xl font-extrabold text-gray-900">
                  <span>Final Amount</span>
                  <span>${Number(paymentInfo.finalAmount || 0).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {!paymentInfo ? (
            <button
              onClick={totalAmount <= 0 ? handleCreateFreeBooking : handleCreatePaymentIntent}
              disabled={loadingPayment}
              className="mt-8 w-full rounded-xl bg-[#d4503e] px-5 py-3 font-bold text-white transition hover:bg-[#bb4332] disabled:opacity-60"
            >
              {loadingPayment
                ? totalAmount <= 0
                  ? "Generating Tickets..."
                  : "Preparing Payment..."
                : totalAmount <= 0
                  ? "Confirm Free Booking"
                  : "Proceed to Payment"}
            </button>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: paymentInfo.clientSecret || paymentInfo.client_secret,
              }}
            >
              <EventCheckoutForm
                bookingId={paymentInfo.booking_id}
                bookingNumber={paymentInfo.booking_number}
                paymentIntentId={paymentInfo.paymentIntentId || paymentInfo.payment_intent_id}
                bookingData={bookingData}
              />
            </Elements>
          )}
        </div>
      </div>
    </section>
  );
}

function EventCheckoutForm({ bookingId, bookingNumber, paymentIntentId, bookingData }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [adminHelp, setAdminHelp] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setPaying(true);
    setPaymentError("");
    setAdminHelp(false);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      setPaymentError(result.error.message || "Payment failed.");
      setPaying(false);
      return;
    }

    try {
      const confirmResult = await api.post("confirmEventPayment.php", {
        booking_id: bookingId,
        payment_intent_id: result.paymentIntent?.id || paymentIntentId,
      });

      if (!confirmResult?.success) {
        setPaymentError(confirmResult?.message || "Payment completed but server confirmation failed.");
        setAdminHelp(true);
        setPaying(false);
        return;
      }

      sessionStorage.removeItem("eventBookingData");

      const successData = {
        booking_id: bookingId,
        booking_number: bookingNumber,
        tickets_created: confirmResult?.tickets_created || bookingData?.total_tickets || 0,
        buyer_name: confirmResult?.buyer_name || bookingData?.buyer_name || "",
        buyer_email: confirmResult?.buyer_email || bookingData?.buyer_email || "",
        payment_type: "paid",
      };

      sessionStorage.setItem("eventPaymentSuccess", JSON.stringify(successData));

      navigate(`/events/payment-success`, {
        state: successData,
      });
    } catch (err) {
      console.error("Confirm event payment error:", err);
      setPaymentError("Payment completed but server confirmation failed.");
      setAdminHelp(true);
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="mt-8">
      {paymentError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {paymentError}

          {adminHelp && (
            <button
              type="button"
              onClick={() => navigate("/contact")}
              className="mt-4 block rounded-lg bg-red-600 px-4 py-2 text-white"
            >
              Contact Administrator
            </button>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 p-4">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || paying}
        className="mt-6 w-full rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
      >
        {paying ? "Processing Payment..." : "Pay Now"}
      </button>
    </form>
  );
}

function SummaryRow({ label, qty, price }) {
  const quantity = Number(qty || 0);
  const ticketPrice = Number(price || 0);
  const lineTotal = quantity * ticketPrice;

  if (quantity === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
      <div>
        <p className="font-bold text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">
          {quantity} × {ticketPrice === 0 ? "Free" : `$${ticketPrice.toFixed(2)}`}
        </p>
      </div>

      <p className="font-bold text-gray-900">${lineTotal.toFixed(2)}</p>
    </div>
  );
}

function SelectedPeople({ selectedPeople }) {
  if (!selectedPeople) return null;

  const getNameText = (person) => {
    if (typeof person === "string") return person;

    const fullName = `${person?.first_name || ""} ${person?.last_name || ""}`.trim();

    return person?.name || fullName || "";
  };

  const hasPeople = Object.values(selectedPeople).some(
    (list) => Array.isArray(list) && list.length > 0
  );

  if (!hasPeople) return null;

  return (
    <div className="mt-8 rounded-2xl bg-[#fdf6ef] p-5">
      <p className="mb-3 text-sm font-bold text-gray-900">
        Selected Ticket Holders
      </p>

      {Object.entries(selectedPeople).map(([type, list]) => {
        if (!Array.isArray(list) || list.length === 0) return null;

        return (
          <div key={type} className="mb-2 text-sm text-gray-700">
            <strong className="capitalize">
              {type === "child" ? "Kid Under 10" : type}:
            </strong>{" "}
            {list.map(getNameText).filter(Boolean).join(", ")}
          </div>
        );
      })}
    </div>
  );
}
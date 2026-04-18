import React, { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function PaymentCheckoutForm({ memberId, totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || loading) return;

    try {
      setLoading(true);
      setErrorMessage("");

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed.");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        const result = await api.post("confirmMembershipPayment.php", {
          member_id: memberId,
          payment_intent_id: paymentIntent.id,
        });

        if (result?.success) {
          navigate("/membershipdashboard", { replace: true });
        } else {
          setErrorMessage(
            result?.message || "Payment succeeded, but DB update failed."
          );
        }
      } else {
        setErrorMessage("Payment not completed.");
      }
    } catch (err) {
      console.error("Stripe payment error:", err);
      setErrorMessage("Something went wrong while processing payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="border border-gray-200 rounded-2xl p-4 bg-white">
        <PaymentElement />
      </div>

      {errorMessage ? (
        <div className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-xl p-3">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="mt-5 w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
      >
        {loading
          ? "Processing Payment..."
          : `Pay $${Number(totalAmount).toFixed(2)}`}
      </button>
    </form>
  );
}
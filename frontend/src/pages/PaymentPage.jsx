import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { api } from "../api";
import PaymentCheckoutForm from "../components/PaymentCheckoutForm";
import PaymentTermsNotice from "../components/PaymentTermsNotice";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const applications = location.state?.applications || [];

  const totalAmount =
    location.state?.totalAmount ||
    applications.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const member = JSON.parse(localStorage.getItem("member") || "null");
  const memberId = member?.id || member?.member_id;

  const [clientSecret, setClientSecret] = useState("");
  const [loadingIntent, setLoadingIntent] = useState(true);
  const [error, setError] = useState("");
  const [baseAmount, setBaseAmount] = useState(0);
  const [processingFee, setProcessingFee] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [agreePolicy, setAgreePolicy] = useState(false);

  const applicationIds = useMemo(() => {
    return applications.map((app) => app.id);
  }, [applications]);

  useEffect(() => {
    const createIntent = async () => {
      try {
        setLoadingIntent(true);
        setError("");

        if (!memberId) {
          setError("Member not found. Please login again.");
          setLoadingIntent(false);
          return;
        }

        if (!applications.length) {
          setError("No unpaid memberships found for payment.");
          setLoadingIntent(false);
          return;
        }

        const result = await api.post("createStripePaymentIntent.php", {
          member_id: memberId,
          application_ids: applicationIds,
          total_amount: totalAmount,
        });

        if (result?.success && result?.clientSecret) {
          setClientSecret(result.clientSecret);
          setBaseAmount(Number(result.baseAmount || totalAmount));
          setProcessingFee(Number(result.processingFee || 0));
          setFinalAmount(Number(result.finalAmount || totalAmount));
        } else {
          setError(result?.message || "Failed to initialize payment.");
        }
      } catch (err) {
        console.error("Create payment intent error:", err);
        setError("Something went wrong while initializing payment.");
      } finally {
        setLoadingIntent(false);
      }
    };

    createIntent();
  }, [memberId, applications.length, applicationIds, totalAmount]);

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#16a34a",
        borderRadius: "12px",
      },
    },
  };

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand mb-2">
            Membership Payment
          </h1>
          <p className="text-gray-600">
            Review all unpaid memberships and complete one common payment.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          {!applications.length ? (
            <div className="text-center text-gray-500 py-8">
              No unpaid memberships found for payment.
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {app.membership_type}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Submitted: {app.created_at || "N/A"}
                      </p>
                    </div>

                    <div className="text-lg font-bold text-green-700">
                      ${Number(app.amount || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t pt-5 space-y-3">
                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-base font-medium">Membership Total</span>
                  <span className="text-base font-semibold">
                    ${Number(baseAmount || totalAmount).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-base font-medium">
                    Processing Fee (Stripe)
                  </span>
                  <span className="text-base font-semibold">
                    ${Number(processingFee || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-lg font-semibold text-gray-800">
                    Total Payable
                  </span>
                  <span className="text-2xl font-bold text-green-700">
                    ${Number(finalAmount || totalAmount).toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  A small processing fee is added to cover secure online payment
                  charges.
                </p>
              </div>

              <PaymentTermsNotice
                agreed={agreePolicy}
                setAgreed={setAgreePolicy}
                notes={[
                  "Payment processing fees are applied by the payment provider and are non-refundable.",
                  "Airdrie Gujarati Samaj does not accept returns for membership. Once paid, the membership amount is non-refundable and non-transferable under any circumstances.",
                ]}
                checkboxLabel="I understand and agree that payment processing fees are non-refundable, and membership payments are non-refundable and non-transferable."
              />

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/membershipdashboard")}
                  className="mb-4 w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Back
                </button>

                {loadingIntent ? (
                  <div className="text-gray-500 py-4">
                    Preparing secure payment...
                  </div>
                ) : error ? (
                  <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4">
                    {error}
                  </div>
                ) : !agreePolicy ? (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
                    Please accept the payment terms above to continue with
                    payment.
                  </div>
                ) : clientSecret ? (
                  <Elements stripe={stripePromise} options={options}>
                    <PaymentCheckoutForm
                      memberId={memberId}
                      totalAmount={finalAmount || totalAmount}
                      applicationIds={applicationIds}
                    />
                  </Elements>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
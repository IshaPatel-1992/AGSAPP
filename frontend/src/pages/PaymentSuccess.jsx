import React from "react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you. Your membership payment was completed successfully.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/membershipdashboard"
            className="w-full bg-brand text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/mymemberships"
            className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            View My Memberships
          </Link>
        </div>
      </div>
    </section>
  );
}
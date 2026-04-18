import React from "react";

export default function PaymentTermsNotice({
  agreed,
  setAgreed,
  showCheckbox = true,
  className = "",
  title = "Important Payment Notice",
  notes = [],
  checkboxLabel = "I understand and agree to the payment terms.",
}) {
  return (
    <div
      className={`mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 ${className}`}
    >
      <p className="text-sm font-semibold text-amber-900 mb-2">{title}</p>

      <div className="space-y-2 text-sm text-amber-800">
        {notes.map((note, index) => (
          <p key={index}>{note}</p>
        ))}
      </div>

      {showCheckbox && (
        <label className="mt-4 flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700 leading-6">
            {checkboxLabel}
          </span>
        </label>
      )}
    </div>
  );
}
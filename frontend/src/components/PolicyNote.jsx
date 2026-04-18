import React from "react";

export default function PolicyNote({
  title = "Important Note",
  className = "",
  showMembershipPolicy = true,
  showEventPolicy = true,
  orgName = "Airdrie Gujarati Samaj",
  compact = false,
}) {
  return (
    <div
      className={`rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-gray-700 ${className}`}
    >
      <p className="font-semibold text-yellow-800 mb-2">{title}</p>

      {showMembershipPolicy && (
        <p className={showEventPolicy ? "mb-2" : ""}>
          {orgName} does not accept returns for memberships. Once paid, the
          membership amount is{" "}
          <strong>non-refundable and non-transferable</strong> under any
          circumstances.
        </p>
      )}

      {showEventPolicy && (
        <p>
          All event tickets are also <strong>non-refundable</strong>. However,
          event cancellations made well ahead of the event day may be eligible
          for a partial refund under certain circumstances only. Management will
          periodically decide the percentage of the refund amount eligible.
        </p>
      )}

      {compact && (
        <p className="mt-2 text-xs text-gray-600">
          Please review this policy before proceeding.
        </p>
      )}
    </div>
  );
}
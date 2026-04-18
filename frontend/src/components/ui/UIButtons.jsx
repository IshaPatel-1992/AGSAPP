import React from "react";
import { Link } from "react-router-dom";

const VARIANT_CLASSES = {
  saffron: "bg-brand-saffron text-white",
  green: "bg-brand-green text-white",
  yellow: "bg-yellow-500 text-white",
  default: "bg-brand text-white",
};

export default function UIButton({
  to,
  href,
  children,
  variant = "default",
  className = "",
  ...props
}) {
  const baseClasses =
    "font-semibold px-6 py-2 rounded-lg shadow transition-transform duration-300 transform hover:scale-105";

  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.default;

  // ✅ Internal SPA link
  if (to) {
    return (
      <Link
        to={to}
        className={`${baseClasses} ${variantClass} ${className}`}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // ✅ External link (opens in new tab)
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variantClass} ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  }

  // ✅ Regular button
  return (
    <button
      className={`${baseClasses} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
import React from "react";
import { Link } from "react-router-dom";

export default function UIButton({
  to,
  children,
  className = "",
  ...props
}) {
  const baseClasses =
    "px-4 py-2 rounded font-medium transition duration-200 bg-brand text-white hover:bg-brand-hover";

  // If "to" exists → treat as Link button
  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${className}`}>
        {children}
      </Link>
    );
  }

  // Otherwise → regular HTML button
  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}

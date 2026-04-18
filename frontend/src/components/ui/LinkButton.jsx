export function LinkButton({ to, children, className = '' }) {
  if (!to) {
    console.error('Missing "to" prop in LinkButton');
    return null;
  }

  return (
    <Link
      to={to}
      className={`text-white px-4 py-2 rounded hover:bg-yellow-400 hover:text-[#4b1d1d] transition-colors duration-200 ${className}`}
    >
      {children}
    </Link>
  );
}

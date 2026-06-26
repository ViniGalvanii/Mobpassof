export function Button({ children, type="button", onClick, variant="primary", disabled=false }) {
  const styles = {
    primary: "bg-gradient-to-r from-violet-600 to-purple-700 text-white hover:from-violet-700 hover:to-purple-800 shadow-lg shadow-purple-500/30",
    secondary: "bg-white text-violet-700 border-2 border-violet-200 hover:bg-violet-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-violet-100 text-violet-700 hover:bg-violet-200",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]}`}>
      {children}
    </button>
  );
}

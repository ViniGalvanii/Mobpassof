export function Input({ label, placeholder, type="text", value, onChange, required, icon }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400">{icon}</div>}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} required={required}
          className={`w-full bg-white border-2 border-violet-100 rounded-xl ${icon?'pl-10':'pl-4'} pr-4 py-3 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all duration-200 shadow-sm`}
        />
      </div>
    </div>
  );
}
